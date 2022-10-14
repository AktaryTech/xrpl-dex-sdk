import BigNumber from 'bignumber.js';
import { randomUUID } from 'crypto';
import _ from 'lodash';
import {
  AccountTxRequest,
  AccountTxResponse,
  Client,
  dropsToXrp,
  ErrorResponse,
  LedgerEntryRequest,
  OfferCreate,
  OfferCreateFlags,
  RippledError,
  rippleTimeToISOTime,
  rippleTimeToUnixTime,
  TransactionMetadata,
  TxRequest,
  TxResponse,
  unixTimeToRippleTime,
} from 'xrpl';
import { Amount, LedgerIndex } from 'xrpl/dist/npm/models/common';
import { Offer, OfferFlags } from 'xrpl/dist/npm/models/ledger';
import { parseAmountValue } from 'xrpl/dist/npm/models/transactions/common';
import { hashOfferId } from 'xrpl/dist/npm/utils/hashes';
import { CURRENCY_PRECISION, DEFAULT_LIMIT, DEFAULT_SEARCH_LIMIT } from '../constants';
import {
  AccountAddress,
  OrderId,
  AccountTransaction,
  LedgerTransaction,
  Node,
  OrderSide,
  TransactionData,
  TxResult,
  XrplErrorTypes,
  Sequence,
  OrderStatus,
  Trade,
  TradeSourceData,
  SDKContext,
  OrderSourceData,
  OrderTimeInForce,
  Order,
  BadOrderId,
  OrderNotFound,
  DeletedNode,
} from '../models';
import { getAmountCurrencyCode, getAmountIssuer, getMarketSymbolFromAmount } from './conversions';
import { BN, subtractAmounts } from './numbers';

/**
 * Parsers
 */
export const parseOrderId = (orderId: OrderId) => {
  const [account, sequenceString] = orderId.split(':');
  const sequence = BN(sequenceString);
  return { account, sequence: sequence.toNumber(), sequenceString };
};

/**
 * Validates an OrderId. Throws an error if invalid, otherwise returns nothing.
 * @param orderId ID to evaluate
 */
export const validateOrderId = (orderId: OrderId) => {
  if (!orderId.includes(':'))
    throw new BadOrderId(`Invalid OrderId: "${orderId}". OrderIds must be in the form [AccountAddress]/[Sequence]`);
  const [account, sequenceString] = orderId.split(':');
  if (!account || !sequenceString) {
    throw new BadOrderId(`Invalid OrderId: "${orderId}". OrderIds must be in the form [AccountAddress]/[Sequence]`);
  }
};

/**
 * Getters
 */
export const getOrderId = (account: AccountAddress, sequence: Sequence): OrderId => `${account}:${sequence}`;
export const getOrderSideFromFlags = (flags: number): OrderSide =>
  (flags & OfferFlags.lsfSell) === OfferFlags.lsfSell
    ? 'sell'
    : (flags & OfferCreateFlags.tfSell) === OfferCreateFlags.tfSell
    ? 'sell'
    : 'buy';
export const getBaseAmountKey = (side: OrderSide) => (side === 'buy' ? 'TakerPays' : 'TakerGets');
export const getQuoteAmountKey = (side: OrderSide) => (side === 'buy' ? 'TakerGets' : 'TakerPays');
export const getTakerOrMaker = (side: OrderSide) => (side === 'buy' ? 'taker' : 'maker');

/**
 * Returns an Offer Ledger object from an AffectedNode
 */
export const getOfferFromNode = (node: Node): Offer | undefined => {
  const { PreviousTxnID, LedgerIndex, LedgerEntryType, FinalFields, PreviousFields } = Object.values(node)[0];

  if (LedgerEntryType !== 'Offer' || !FinalFields) return;

  const offer: Offer = {
    ...FinalFields,
    index: LedgerIndex,
    PreviousTxnID: FinalFields.PreviousTxnID ?? PreviousTxnID,
    TakerGets: PreviousFields
      ? subtractAmounts(PreviousFields.TakerGets as Amount, FinalFields.TakerGets as Amount)
      : FinalFields.TakerGets,
    TakerPays: PreviousFields
      ? subtractAmounts(PreviousFields.TakerPays as Amount, FinalFields.TakerPays as Amount)
      : FinalFields.TakerPays,
  };

  return offer;
};

/**
 * Returns an Offer Ledger object from a Transaction
 */
export const getOfferFromTransaction = (
  transaction: TransactionData<OfferCreate>['transaction']
): Offer | undefined => {
  if (transaction.TransactionType !== 'OfferCreate') return;

  const { Account, Flags, Sequence, TakerGets, TakerPays } = transaction;

  if (!Sequence) return;

  return {
    Account,
    BookDirectory: '',
    BookNode: '0',
    LedgerEntryType: 'Offer',
    Flags: Flags as OfferCreateFlags,
    OwnerNode: '0',
    Sequence,
    TakerGets,
    TakerPays,
    index: hashOfferId(Account, Sequence),
    PreviousTxnID: '',
    PreviousTxnLgrSeq: 0,
  } as Offer;
};

/**
 * Get Base and Quote Currency data
 * @param source Offer | Transaction
 * @returns Data object with Base/Quote information
 */
export const getBaseQuoteData = (source: Record<string, any>) => {
  const data: Record<string, any> = {};

  data.side = (source.Flags & OfferFlags.lsfSell) === OfferFlags.lsfSell ? 'sell' : 'buy';

  data.baseAmount = source[getBaseAmountKey(data.side)];
  data.baseValue = BN(
    typeof data.baseAmount === 'string'
      ? dropsToXrp(parseAmountValue(data.baseAmount))
      : parseAmountValue(data.baseAmount)
  );

  data.quoteAmount = source[getQuoteAmountKey(data.side)];
  data.quoteValue = BN(
    typeof data.quoteAmount === 'string'
      ? dropsToXrp(parseAmountValue(data.quoteAmount))
      : parseAmountValue(data.quoteAmount)
  );

  data.symbol = getMarketSymbolFromAmount(data.baseAmount, data.quoteAmount);

  return data;
};

/**
 * Get basic Order data
 * @param this
 * @param source
 * @returns
 */
export async function getSharedOrderData(this: SDKContext, source: Record<string, any>) {
  const data: Record<string, any> = getBaseQuoteData(source);

  data.baseCurrency = getAmountCurrencyCode(data.baseAmount);
  data.baseIssuer = getAmountIssuer(data.baseAmount);
  data.baseRate = data.baseIssuer ? await this.fetchTransferRate(data.baseIssuer) : BN(0);

  data.quoteCurrency = getAmountCurrencyCode(data.quoteAmount);
  data.quoteIssuer = getAmountIssuer(data.quoteAmount);
  data.quoteRate = data.quoteIssuer ? await this.fetchTransferRate(data.quoteIssuer) : BN(0);

  data.amount = data.baseValue;
  data.price = data.quoteValue.dividedBy(data.baseValue);

  data.feeCurrency = data.side === 'buy' ? data.quoteCurrency : data.baseCurrency;
  data.feeRate = data.side === 'buy' ? data.quoteRate : data.baseRate;

  return data;
}

export const getOrderFeeFromData = (feeCost: BigNumber, data: Record<string, any>) => {
  if (feeCost.isGreaterThan(0)) {
    return {
      currency: data.feeCurrency,
      cost: (+feeCost.toPrecision(CURRENCY_PRECISION)).toString(),
      rate: (+data.feeRate.toPrecision(CURRENCY_PRECISION)).toString(),
      percentage: true,
    };
  }
};

/**
 * Parse OrderSourceData into a CCXT Order object
 * @param this SDKContext
 * @param source OrderSourceData
 * @param info Record<string, any>
 * @returns Order
 */
export async function getOrderFromData(this: SDKContext, source: OrderSourceData, info: Record<string, any> = {}) {
  const side: OrderSide =
    (source.Flags as number & OfferCreateFlags.tfSell) === OfferCreateFlags.tfSell ? 'sell' : 'buy';

  let orderTimeInForce: OrderTimeInForce = 'GTC';
  if (source.Flags === OfferCreateFlags.tfPassive) orderTimeInForce = 'PO';
  else if (source.Flags === OfferCreateFlags.tfFillOrKill) orderTimeInForce = 'FOK';
  else if (source.Flags === OfferCreateFlags.tfImmediateOrCancel) orderTimeInForce = 'IOC';

  const sourceData = await getSharedOrderData.call(this, source);

  const actualPrice = source.fillPrice;
  const average = source.trades.length ? source.totalFillPrice.dividedBy(source.trades.length) : BN(0);
  const remaining = sourceData.amount.minus(source.filled);
  const cost = source.filled.times(actualPrice);

  const feeCost = source.filled.times(sourceData.feeRate);

  const order: Order = {
    id: getOrderId(source.Account, source.Sequence),
    clientOrderId: hashOfferId(source.Account, source.Sequence),
    datetime: rippleTimeToISOTime(source.date),
    timestamp: rippleTimeToUnixTime(source.date),
    status: source.status,
    symbol: getMarketSymbolFromAmount(sourceData.baseAmount, sourceData.quoteAmount),
    type: 'limit',
    timeInForce: orderTimeInForce,
    side: side,
    amount: (+sourceData.amount.toPrecision(CURRENCY_PRECISION)).toString(),
    price: (+sourceData.price.toPrecision(CURRENCY_PRECISION)).toString(),
    average: (+average.toPrecision(CURRENCY_PRECISION)).toString(),
    filled: (+source.filled.toPrecision(CURRENCY_PRECISION)).toString(),
    remaining: (+remaining.toPrecision(CURRENCY_PRECISION)).toString(),
    cost: (+cost.toPrecision(CURRENCY_PRECISION)).toString(),
    trades: source.trades,
    info: { ...info },
  };

  if (source.trades.length) order.lastTradeTimestamp = source.trades[source.trades.length - 1].timestamp;

  const fee = getOrderFeeFromData(feeCost, sourceData);
  if (fee) order.fee = fee;

  return order;
}

/**
 * Parse TradeSourceData into a CCXT Trade object
 * @param this SDKContext
 * @param source TradeSourceData
 * @param info Record<string, any>
 * @returns Trade
 */
export async function getTradeFromData(this: SDKContext, source: TradeSourceData, info: Record<string, any> = {}) {
  const side: OrderSide = (source.Flags & OfferFlags.lsfSell) === OfferFlags.lsfSell ? 'sell' : 'buy';

  const tradeId = getOrderId(source.Account, source.Sequence);
  const orderId = getOrderId(source.OrderAccount, source.OrderSequence);

  const sourceData = await getSharedOrderData.call(this, source);

  const cost = sourceData.amount.times(sourceData.price);
  const feeCost = (side === 'buy' ? sourceData.quoteValue : sourceData.baseValue).times(sourceData.feeRate);

  const trade: Trade = {
    id: tradeId,
    order: orderId,
    datetime: rippleTimeToISOTime(source.date || 0),
    timestamp: rippleTimeToUnixTime(source.date || 0),
    symbol: getMarketSymbolFromAmount(sourceData.baseAmount, sourceData.quoteAmount),
    type: 'limit',
    side,
    amount: (+sourceData.amount.toPrecision(CURRENCY_PRECISION)).toString(),
    price: (+sourceData.price.toPrecision(CURRENCY_PRECISION)).toString(),
    takerOrMaker: getTakerOrMaker(side),
    cost: (+cost.toPrecision(CURRENCY_PRECISION)).toString(),
    info: { ...info },
  };

  const fee = getOrderFeeFromData(feeCost, sourceData);
  if (fee) trade.fee = fee;

  return trade;
}

/**
 * Fetchers
 */

/**
 * Fetches an Offer's Ledger entry, or returns undefined if not found
 */
export const fetchOfferEntry = async (
  client: Client,
  orderId: OrderId,
  ledgerIndex: LedgerIndex = 'validated'
): Promise<Offer | undefined> => {
  const { account, sequence } = parseOrderId(orderId);
  try {
    const offerResult = await client.request({
      id: randomUUID(),
      command: 'ledger_entry',
      ledger_index: ledgerIndex,
      offer: {
        account,
        seq: sequence,
      },
    } as LedgerEntryRequest);
    return offerResult.result.node as Offer;
  } catch (err: unknown) {
    const error = err as RippledError;
    if ((error.data as ErrorResponse).error !== XrplErrorTypes.EntryNotFound) {
      console.error(err);
      throw error;
    }
  }
};

/**
 * Fetches a Transaction, or returns undefined if not found
 */
export const fetchTxn = async (client: Client, txnHash: string): Promise<TxResponse | undefined> => {
  try {
    const txResponse = await client.request({
      id: randomUUID(),
      command: 'tx',
      transaction: txnHash,
    } as TxRequest);
    return txResponse;
  } catch (err: unknown) {
    const error = err as RippledError;
    if ((error.data as ErrorResponse).error !== XrplErrorTypes.TxnNotFound) {
      console.error(err);
      throw error;
    }
  }
};

/**
 * Fetches a list of AccountTransactions, or returns undefined if not found
 */
export const fetchAccountTxns = async (
  client: Client,
  account: AccountAddress,
  limit?: number,
  marker?: any
): Promise<AccountTxResponse | undefined> => {
  try {
    const accountTxResponse = await client.request({
      id: randomUUID(),
      command: 'account_tx',
      account,
      ledger_index_min: -1,
      ledger_index_max: -1,
      binary: false,
      limit,
      marker,
      validated: true,
    } as AccountTxRequest);
    return accountTxResponse;
  } catch (err: unknown) {
    const error = err as RippledError;
    if ((error.data as ErrorResponse).error !== XrplErrorTypes.TxnNotFound) {
      console.error(err);
      throw error;
    }
  }
};

/**
 * Filter out irrelevant Transactions, parse AffectedNodes, and normalize results
 */
export const parseTransaction = (
  orderId: OrderId,
  transaction:
    | TxResponse
    | AccountTransaction
    | (OfferCreate & {
        metaData?: TransactionMetadata | undefined;
      })
): TransactionData<OfferCreate> | undefined => {
  const { account, sequence } = parseOrderId(orderId);
  const offerLedgerIndex = hashOfferId(account, sequence);

  let previousTxnHash: string | undefined;

  let tx: TxResult<OfferCreate>;
  let metadata: string | TransactionMetadata | undefined;

  if (transaction.hasOwnProperty('result')) {
    if ((transaction as TxResponse).result.TransactionType !== 'OfferCreate') return;
    tx = (transaction as TxResponse).result as TxResult<OfferCreate>;
    metadata = tx.meta;
  } else if (transaction.hasOwnProperty('tx')) {
    if ((transaction as AccountTransaction).tx?.TransactionType !== 'OfferCreate') return;
    tx = (transaction as AccountTransaction).tx as TxResult<OfferCreate>;
    metadata = (transaction as AccountTransaction).meta;
  } else if (transaction.hasOwnProperty('metaData')) {
    if ((transaction as LedgerTransaction<OfferCreate>).TransactionType !== 'OfferCreate') return;
    const { metaData, ...ledgerTx } = transaction as LedgerTransaction<OfferCreate>;
    tx = ledgerTx as TxResult<OfferCreate>;
    metadata = metaData;
  } else return;

  if (!tx.hash ?? tx?.TransactionType !== 'OfferCreate' ?? typeof metadata !== 'object') return;

  const parsedNodes: Node[] = [];
  const tradeOffers: Offer[] = [];

  if (tx.Account === account && tx.Sequence === sequence) {
    metadata.AffectedNodes.forEach((affectedNode: Node) => {
      const offer = getOfferFromNode(affectedNode);
      if (offer && offer.Account !== account) {
        tradeOffers.push(offer);
        parsedNodes.push(affectedNode);
      }
    });

    previousTxnHash = undefined;
  } else {
    if (tx.Account !== account) {
      metadata.AffectedNodes.forEach((affectedNode: Node) => {
        const offer = getOfferFromNode(affectedNode);
        if (offer && offer.index === offerLedgerIndex) {
          previousTxnHash = offer.PreviousTxnID;

          // In this case, the Transaction is the Trade data, with the Offer's amounts
          const tradeOffer = {
            ...getOfferFromTransaction(tx),
            PreviousTxnID: offer.PreviousTxnID,
            TakerGets: offer.TakerGets,
            TakerPays: offer.TakerPays,
          } as Offer;
          if (!tradeOffer) return;

          tradeOffers.push(tradeOffer);
          parsedNodes.push(affectedNode);
        }
      });
    }
  }

  // Strip out the `meta` prop in case the transaction is of type TxResponse['result']
  const txData = tx.meta ? _.omit(tx, ['meta']) : tx;

  const transactionData = {
    transaction: {
      ...txData,
    },
    metadata: {
      ...metadata,
      AffectedNodes: parsedNodes,
    } as TransactionMetadata,
    offers: tradeOffers,
    previousTxnId: previousTxnHash,
    date: tx.date ?? txData.date ?? unixTimeToRippleTime(0),
  };

  return transactionData;
};

/**
 * Get data for the most recent Transaction to affect an Order
 */
export const getMostRecentTx = async (
  client: Client,
  orderId: OrderId,
  /** This is to prevent us spending forever searching through an account's Transactions for an Order */
  searchLimit: number = DEFAULT_SEARCH_LIMIT
): Promise<
  { previousTxnData?: TransactionData<OfferCreate>; previousTxnId?: string; orderStatus: OrderStatus } | undefined
> => {
  let orderStatus: OrderStatus = 'open';

  const ledgerOffer = await fetchOfferEntry(client, orderId);
  if (ledgerOffer) {
    const txResponse = await fetchTxn(client, ledgerOffer.PreviousTxnID);
    if (txResponse) {
      const previousTxnData = parseTransaction(orderId, txResponse);
      if (previousTxnData) return { previousTxnData, previousTxnId: previousTxnData?.previousTxnId, orderStatus };
    }
  } else {
    orderStatus = 'closed';

    const { account, sequence } = parseOrderId(orderId);

    const limit = DEFAULT_LIMIT;
    let marker: unknown;
    let hasNextPage = true;
    let page = 1;

    while (hasNextPage) {
      const accountTxResponse = await fetchAccountTxns(client, account, limit, marker);
      if (!accountTxResponse) return { orderStatus };

      marker = accountTxResponse.result.marker;

      accountTxResponse.result.transactions.sort((a, b) => (b.tx?.date ?? 0) - (a.tx?.date ?? 0));

      for (const transaction of accountTxResponse.result.transactions) {
        if (typeof transaction.meta === 'string') continue;

        if (transaction.tx?.TransactionType === 'OfferCancel') {
          for (const node of transaction.meta.AffectedNodes) {
            if (node.hasOwnProperty('DeletedNode')) {
              const finalFields = (node as DeletedNode).DeletedNode.FinalFields;
              if (finalFields.Account === account && finalFields.Sequence === sequence) {
                orderStatus = 'canceled';
                const previousTxResponse = await fetchTxn(client, finalFields.PreviousTxnID as string);
                if (previousTxResponse) {
                  const previousTxnData = parseTransaction(orderId, previousTxResponse);
                  if (previousTxnData)
                    return { previousTxnData, previousTxnId: previousTxnData?.previousTxnId, orderStatus };
                }
              }
            }
          }
          continue;
        }

        const previousTxnData = parseTransaction(orderId, transaction);
        if (previousTxnData) return { previousTxnData, previousTxnId: previousTxnData?.previousTxnId, orderStatus };
      }

      if (!marker ?? limit * page >= searchLimit) hasNextPage = false;
      else {
        page += 1;
      }
    }

    throw new OrderNotFound(
      `Could not find data for Order ${orderId}. Try increasing the searchLimit parameter or using a full history XRPL server.`
    );
  }
};

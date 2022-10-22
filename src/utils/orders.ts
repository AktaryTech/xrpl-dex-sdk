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
} from 'xrpl';
import { Amount, LedgerIndex } from 'xrpl/dist/npm/models/common';
import { Offer, OfferFlags } from 'xrpl/dist/npm/models/ledger';
// import { parseAmountValue } from 'xrpl/dist/npm/models/transactions/common';
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
  LedgerEntryType,
  Order,
  BadOrderId,
  OrderNotFound,
  DeletedNode,
  AffectedNode,
} from '../models';
import { getAmountCurrencyCode, getAmountIssuer, getMarketSymbol, getMarketSymbolFromAmount } from './conversions';
import { BN, parseAmountValue, subtractAmounts } from './numbers';

/**
 * Parsers
 */
export const parseAffectedNode = (
  affectedNode: Record<string, any>,
  entryType: LedgerEntryType = LedgerEntryType.Offer
) => {
  if (affectedNode.hasOwnProperty('CreatedNode')) {
    const nodeData: Record<string, any> = affectedNode.CreatedNode;
    if ((nodeData.LedgerEntryType as LedgerEntryType) === entryType)
      return {
        type: 'CreatedNode',
        LedgerEntryType: nodeData.LedgerEntryType,
        LedgerIndex: nodeData.LedgerIndex,
        NewFields: nodeData.NewFields,
      } as AffectedNode;
  } else if (affectedNode.hasOwnProperty('ModifiedNode')) {
    const nodeData: Record<string, any> = affectedNode.ModifiedNode;
    if ((nodeData.LedgerEntryType as LedgerEntryType) === entryType)
      return {
        type: 'ModifiedNode',
        LedgerEntryType: nodeData.LedgerEntryType,
        LedgerIndex: nodeData.LedgerIndex,
        FinalFields: nodeData.FinalFields,
        PreviousFields: nodeData.PreviousFields,
        PreviousTxnID: nodeData.PreviousTxnID,
        PreviouTxnLgrSeq: nodeData.PreviouTxnLgrSeq,
      } as AffectedNode;
  } else if (affectedNode.hasOwnProperty('DeletedNode')) {
    const nodeData: Record<string, any> = affectedNode.DeletedNode;
    if ((nodeData.LedgerEntryType as LedgerEntryType) === entryType)
      return {
        type: 'DeletedNode',
        LedgerEntryType: nodeData.LedgerEntryType,
        LedgerIndex: nodeData.LedgerIndex,
        FinalFields: nodeData.FinalFields,
        PreviousFields: nodeData.PreviousFields,
      } as AffectedNode;
  }
};

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
export const getOrderTimeInForce = (order: Record<string, any>): OrderTimeInForce => {
  let orderTimeInForce: OrderTimeInForce = 'GTC';
  if (order.Flags === OfferCreateFlags.tfPassive) orderTimeInForce = 'PO';
  else if (order.Flags === OfferCreateFlags.tfFillOrKill) orderTimeInForce = 'FOK';
  else if (order.Flags === OfferCreateFlags.tfImmediateOrCancel) orderTimeInForce = 'IOC';
  return orderTimeInForce;
};
export const getBaseAmountKey = (side: OrderSide) => (side === 'buy' ? 'TakerPays' : 'TakerGets');
export const getQuoteAmountKey = (side: OrderSide) => (side === 'buy' ? 'TakerGets' : 'TakerPays');
export const getTakerOrMaker = (side: OrderSide) => (side === 'buy' ? 'taker' : 'maker');

/**
 * Returns an Offer Ledger object from an AffectedNode
 */
export const getOfferFromNode = (node: Node): Offer | undefined => {
  const affectedNode = parseAffectedNode(node, LedgerEntryType.Offer);

  if (!affectedNode || !affectedNode.FinalFields) return;

  const LedgerIndex = affectedNode.LedgerIndex;
  const FinalFields = affectedNode.FinalFields;
  const PreviousTxnID = affectedNode.PreviousTxnID || (FinalFields.PreviousTxnID as string);
  const PreviousFields = affectedNode.PreviousFields;

  const offerIndex = LedgerIndex;

  const TakerGets = PreviousFields
    ? subtractAmounts(PreviousFields.TakerGets as Amount, FinalFields.TakerGets as Amount)
    : (FinalFields.TakerGets as Amount);
  const TakerPays = PreviousFields
    ? subtractAmounts(PreviousFields.TakerPays as Amount, FinalFields.TakerPays as Amount)
    : (FinalFields.TakerPays as Amount);

  const offer: Offer = {
    Account: FinalFields.Account as string,
    BookDirectory: '',
    BookNode: '0',
    Flags: FinalFields.Flags as number,
    LedgerEntryType: LedgerEntryType.Offer,
    OwnerNode: '0',
    PreviousTxnID,
    PreviousTxnLgrSeq: 0,
    Sequence: FinalFields.Sequence as number,
    TakerGets,
    TakerPays,
    index: offerIndex,
  };

  return offer;

  // const { PreviousTxnID, LedgerIndex, LedgerEntryType, FinalFields, PreviousFields } = Object.values(node)[0];

  // if (LedgerEntryType !== 'Offer' || !FinalFields) return;

  // const offer: Offer = {
  //   ...FinalFields,
  //   index: LedgerIndex,
  //   PreviousTxnID: FinalFields.PreviousTxnID ?? PreviousTxnID,
  //   TakerGets: PreviousFields
  //     ? subtractAmounts(PreviousFields.TakerGets as Amount, FinalFields.TakerGets as Amount)
  //     : FinalFields.TakerGets,
  //   TakerPays: PreviousFields
  //     ? subtractAmounts(PreviousFields.TakerPays as Amount, FinalFields.TakerPays as Amount)
  //     : FinalFields.TakerPays,
  // };

  // return offer;
};

/**
 * Returns an Offer Ledger object from a Transaction
 */
export const getOfferFromTransaction = (
  transaction: Record<string, any>,
  // transaction: TransactionData<OfferCreate>['transaction'],
  overrides: Record<string, any> = {}
): Offer | undefined => {
  if (transaction.TransactionType !== 'OfferCreate') return;

  const tx = { ...transaction, ...overrides };

  if (!tx.Sequence) return;

  const offer: Offer = {
    Account: tx.Account,
    BookDirectory: '',
    BookNode: '0',
    Flags: tx.Flags,
    LedgerEntryType: LedgerEntryType.Offer,
    OwnerNode: '0',
    PreviousTxnID: tx.PreviousTxnID,
    PreviousTxnLgrSeq: 0,
    Sequence: tx.Sequence,
    TakerGets: tx.TakerGets,
    TakerPays: tx.TakerPays,
    index: hashOfferId(tx.Account, tx.Sequence),
  };

  return offer;

  //   const { Account, Flags, Sequence, TakerGets, TakerPays } = transaction;

  //   if (!Sequence) return;

  //   return {
  //     Account,
  //     BookDirectory: '',
  //     BookNode: '0',
  //     LedgerEntryType: 'Offer',
  //     Flags: Flags as OfferCreateFlags,
  //     OwnerNode: '0',
  //     Sequence,
  //     TakerGets,
  //     TakerPays,
  //     index: hashOfferId(Account, Sequence),
  //     PreviousTxnID: '',
  //     PreviousTxnLgrSeq: 0,
  //   } as Offer;
};

/**
 * Get Base and Quote Currency data
 * @param source Offer | Transaction
 * @returns Data object with Base/Quote information
 */
export const getBaseAndQuoteData = (source: Record<string, any>) => {
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
  if (data.quoteValue.isZero()) return;

  // data.symbol = getMarketSymbolFromAmount(data.baseAmount, data.quoteAmount);
  data.symbol = getMarketSymbol(source);

  return data;
};

/**
 * Get basic Order data
 * @param this
 * @param source
 * @returns
 */
export async function getSharedOrderData(this: SDKContext, source: Record<string, any>) {
  const data = getBaseAndQuoteData(source);

  if (!data) return;

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

export const getOrderFeeFromData = (feeCost: BigNumber, source: Record<string, any>) => {
  if (feeCost.isGreaterThan(0)) {
    return {
      // currency: source.feeCurrency,
      currency: source.quoteCurrency,
      cost: (+feeCost.toPrecision(CURRENCY_PRECISION)).toString(),
      rate: (+source.feeRate.toPrecision(CURRENCY_PRECISION)).toString(),
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
export async function getOrderFromData(this: SDKContext, inputData: OrderSourceData, info: Record<string, any> = {}) {
  const sourceData = await getSharedOrderData.call(this, inputData);

  if (!sourceData) return;

  const data = _.merge(inputData, sourceData);

  const actualPrice = data.fillPrice;
  const average = data.trades.length ? data.totalFillPrice.dividedBy(data.trades.length) : BN(0);
  const remaining = data.amount.minus(data.filled);
  const cost = data.filled.times(actualPrice);

  const order: Order = {
    id: getOrderId(data.Account, data.Sequence),
    clientOrderId: hashOfferId(data.Account, data.Sequence),
    datetime: rippleTimeToISOTime(data.date),
    timestamp: rippleTimeToUnixTime(data.date),
    status: data.status,
    symbol: data.symbol,
    type: 'limit',
    timeInForce: getOrderTimeInForce(data),
    side: data.side,
    amount: (+data.amount.toPrecision(CURRENCY_PRECISION)).toString(),
    price: (+data.price.toPrecision(CURRENCY_PRECISION)).toString(),
    average: (+average.toPrecision(CURRENCY_PRECISION)).toString(),
    filled: (+data.filled.toPrecision(CURRENCY_PRECISION)).toString(),
    remaining: (+remaining.toPrecision(CURRENCY_PRECISION)).toString(),
    cost: (+cost.toPrecision(CURRENCY_PRECISION)).toString(),
    trades: data.trades,
    info,
  };

  if (data.trades.length) order.lastTradeTimestamp = data.trades[data.trades.length - 1].timestamp;

  const feeCost = data.filled.times(data.feeRate);
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
export async function getTradeFromData(this: SDKContext, inputData: TradeSourceData, info: Record<string, any> = {}) {
  const sourceData = await getSharedOrderData.call(this, inputData);

  if (!sourceData) return;

  const data: Record<string, any> = _.merge({
    ...inputData,
    ...sourceData,
  });

  const tradeId = getOrderId(data.Account, data.Sequence);
  const orderId = getOrderId(data.OrderAccount, data.OrderSequence);

  const cost = data.amount.times(data.price);
  const feeCost = (data.side === 'buy' ? data.quoteValue : data.baseValue).times(data.feeRate);
  const fee = getOrderFeeFromData(feeCost, data);

  const trade: Trade = {
    id: tradeId,
    order: orderId,
    datetime: rippleTimeToISOTime(data.date || 0),
    timestamp: rippleTimeToUnixTime(data.date || 0),
    symbol: getMarketSymbolFromAmount(data.baseAmount, data.quoteAmount),
    type: 'limit',
    side: data.side,
    amount: (+data.amount.toPrecision(CURRENCY_PRECISION)).toString(),
    price: (+data.price.toPrecision(CURRENCY_PRECISION)).toString(),
    takerOrMaker: getTakerOrMaker(data.side),
    cost: (+cost.toPrecision(CURRENCY_PRECISION)).toString(),
    info,
  };

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
  transaction: Record<string, any>
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

  const tradeOffers: Offer[] = [];

  if (tx.Account === account && tx.Sequence === sequence) {
    for (const affectedNode of metadata.AffectedNodes) {
      const offer = getOfferFromNode(affectedNode);
      if (offer && offer.Account !== account) tradeOffers.push(offer);
    }

    previousTxnHash = undefined;
  } else if (tx.Account !== account) {
    for (const affectedNode of metadata.AffectedNodes) {
      const offer = getOfferFromNode(affectedNode);
      if (offer && offer.index === offerLedgerIndex) {
        previousTxnHash = offer.PreviousTxnID;

        const tradeOffer = getOfferFromTransaction(tx, {
          PreviousTxnID: offer.PreviousTxnID,
          TakerGets: offer.TakerGets,
          TakerPays: offer.TakerPays,
        });

        if (!tradeOffer) continue;

        tradeOffers.push(tradeOffer);
      }
    }
  } else {
    return;
  }

  const parsedTransaction = {
    transaction: tx,
    metadata,
    offers: tradeOffers,
    previousTxnId: previousTxnHash,
    date: tx.date ?? 0,
  };

  return parsedTransaction;
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
    const tx = txResponse?.result;

    if (!tx) throw new Error(`Couldn\'t look up data for Order "${orderId}"`);

    const previousTxnData = parseTransaction(orderId, tx);

    if (previousTxnData) return { previousTxnData, previousTxnId: previousTxnData.previousTxnId, orderStatus };
  } else {
    orderStatus = 'closed';

    const { account, sequence } = parseOrderId(orderId);

    const limit = DEFAULT_LIMIT;
    let marker: unknown;
    let hasNextPage = true;
    let page = 0;

    while (hasNextPage) {
      const accountTxResponse = await fetchAccountTxns(client, account, limit, marker);

      const accountTx = accountTxResponse?.result;

      if (!accountTx) return { orderStatus };

      marker = accountTx.marker;

      const transactions = accountTx.transactions;

      transactions.sort((a, b) => (b.tx?.date ?? 0) - (a.tx?.date ?? 0));

      for (const transaction of transactions) {
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
        } else {
          const previousTxnData = parseTransaction(orderId, transaction);
          if (previousTxnData) return { previousTxnData, previousTxnId: previousTxnData?.previousTxnId, orderStatus };
        }
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

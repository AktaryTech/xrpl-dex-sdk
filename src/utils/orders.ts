import { BadResponse } from 'ccxt';
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
import { DEFAULT_LIMIT, DEFAULT_SEARCH_LIMIT } from '../constants';
import {
  AccountAddress,
  AccountSequencePair,
  AccountTransaction,
  BaseOrder,
  LedgerTransaction,
  Node,
  OrderSide,
  TransactionData,
  TxResult,
  XrplErrorTypes,
  XrplTimestamp,
} from '../models';
import { getAmountCurrencyCode, getMarketSymbol } from './conversions';
import { fetchTransferRate } from './markets';
import { divideAmountValues, subtractAmounts } from './numbers';

/**
 * Parsers
 */
export const parseOrderId = (orderId: string) => {
  const [account, sequenceString] = orderId.split(':');
  const sequence = parseInt(sequenceString);
  return { account, sequence, sequenceString };
};

/**
 * Getters
 */
export const getOrderOrTradeId = (account: AccountAddress, sequence: number) => `${account}:${sequence}`;

export const getOrderSideFromTx = (tx: TxResponse['result']): OrderSide =>
  tx.Flags === OfferFlags.lsfSell ? 'sell' : 'buy';
export const getOrderSideFromOffer = (offer: Offer): OrderSide => (offer.Flags === OfferFlags.lsfSell ? 'sell' : 'buy');

export const getBaseAmountKey = (side: OrderSide) => (side === 'buy' ? 'TakerPays' : 'TakerGets');
export const getQuoteAmountKey = (side: OrderSide) => (side === 'buy' ? 'TakerGets' : 'TakerPays');
export const getAmountKeys = (side: OrderSide): [base: string, quote: string] => [
  getBaseAmountKey(side),
  getQuoteAmountKey(side),
];

export const getOrderBaseAmount = (offer: Offer) => offer[getBaseAmountKey(getOrderSideFromOffer(offer))];
export const getOrderQuoteAmount = (offer: Offer) => offer[getQuoteAmountKey(getOrderSideFromOffer(offer))];

export const getOrderAmountValue = (amount: Amount) =>
  typeof amount === 'object' ? parseAmountValue(amount) : parseFloat(dropsToXrp(parseAmountValue(amount)));

export const getOrderPrice = (baseAmount: Amount, quoteAmount: Amount) => divideAmountValues(baseAmount, quoteAmount);
export const getOrderCost = (baseAmount: Amount, price: number) => parseAmountValue(baseAmount) * price;

// TODO: verify this result is correct
export const getTakerOrMaker = (side: OrderSide) => (side === 'buy' ? 'taker' : 'maker');

/**
 * Returns an Offer Ledger object from an AffectedNode
 */
export const getOfferFromNode = (node: Node): Offer | undefined => {
  const { PreviousTxnID, LedgerIndex, LedgerEntryType, FinalFields, PreviousFields } = Object.values(node)[0];

  if (LedgerEntryType !== 'Offer' || !FinalFields) return;

  return {
    ...FinalFields,
    index: LedgerIndex,
    PreviousTxnID: FinalFields.PreviousTxnID || PreviousTxnID,
    TakerGets: PreviousFields
      ? subtractAmounts(PreviousFields.TakerGets as Amount, FinalFields.TakerGets as Amount)
      : FinalFields.TakerGets,
    TakerPays: PreviousFields
      ? subtractAmounts(PreviousFields.TakerPays as Amount, FinalFields.TakerPays as Amount)
      : FinalFields.TakerPays,
  };
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
 * Fetchers
 */

/**
 * Fetches an Offer's Ledger entry, or returns undefined if not found
 */
export const fetchOfferEntry = async (
  client: Client,
  orderId: AccountSequencePair,
  ledgerIndex: LedgerIndex = 'validated'
): Promise<Offer | undefined> => {
  const { account, sequence } = parseOrderId(orderId);
  try {
    const offerResult = await client.request({
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
    if ((error.data as ErrorResponse).error !== XrplErrorTypes.EntryNotFound) throw error;
  }
};

/**
 * Fetches a Transaction, or returns undefined if not found
 */
export const fetchTxn = async (client: Client, txnHash: string): Promise<TxResponse | undefined> => {
  try {
    return await client.request({
      command: 'tx',
      transaction: txnHash,
    } as TxRequest);
  } catch (err: unknown) {
    const error = err as RippledError;
    if ((error.data as ErrorResponse).error !== XrplErrorTypes.TxnNotFound) throw error;
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
    return await client.request({
      command: 'account_tx',
      account,
      ledger_index_min: -1,
      ledger_index_max: -1,
      binary: false,
      limit,
      marker,
    } as AccountTxRequest);
  } catch (err: unknown) {
    const error = err as RippledError;
    if ((error.data as ErrorResponse).error !== XrplErrorTypes.TxnNotFound) throw error;
  }
};

/**
 * Filter out irrelevant Transactions, parse AffectedNodes, and normalize results
 */
export const parseTransaction = (
  orderId: AccountSequencePair,
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

  if (!tx.hash || tx?.TransactionType !== 'OfferCreate' || typeof metadata !== 'object') return;

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
  const { meta, ...txData } = tx;

  return {
    transaction: {
      ...txData,
    },
    metadata: {
      ...metadata,
      AffectedNodes: parsedNodes,
    } as TransactionMetadata,
    offers: tradeOffers,
    previousTxnId: previousTxnHash,
    date: tx.date || txData.date || unixTimeToRippleTime(0),
  };
};

/**
 * Get the most recent Transaction to affect an Order
 */
export const getMostRecentTxId = async (
  client: Client,
  id: AccountSequencePair,
  /** This is to prevent us spending forever searching through an account's Transactions for an Order */
  searchLimit: number = DEFAULT_SEARCH_LIMIT
) => {
  const ledgerOffer = await fetchOfferEntry(client, id);

  if (ledgerOffer) {
    return ledgerOffer.PreviousTxnID;
  } else {
    const { account } = parseOrderId(id);

    const limit = DEFAULT_LIMIT;
    let marker: unknown;
    let hasNextPage = true;
    let page = 1;

    while (hasNextPage) {
      const accountTxResponse = await fetchAccountTxns(client, account, limit, marker);
      if (!accountTxResponse) return;
      marker = accountTxResponse.result.marker;

      accountTxResponse.result.transactions.sort((a, b) => (b.tx?.date || 0) - (a.tx?.date || 0));

      for (const transaction of accountTxResponse.result.transactions) {
        // if (transaction.tx?.TransactionType === 'OfferCancel' && transaction.tx.Account === account) {
        //   status = 'canceled';
        // }

        const previousTxnData = parseTransaction(id, transaction);
        if (previousTxnData) return previousTxnData?.previousTxnId;
      }

      if (!marker || limit * page >= searchLimit) hasNextPage = false;
      else {
        page += 1;
      }
    }

    throw new BadResponse(`Could not find Transaction history for Order ${id}`);
  }
};

export const getBaseOrder = async (
  client: Client,
  source: (OfferCreate & { date?: number }) | Offer,
  date: XrplTimestamp,
  filled?: number
) => {
  const side: OrderSide = source.Flags === OfferFlags.lsfSell ? 'sell' : 'buy';

  const baseAmount = source[getBaseAmountKey(side)];
  const quoteAmount = source[getQuoteAmountKey(side)];

  const baseCode = getAmountCurrencyCode(baseAmount);
  const quoteCode = getAmountCurrencyCode(quoteAmount);

  const baseRate = parseFloat(await fetchTransferRate(client, baseAmount));
  const quoteRate = parseFloat(await fetchTransferRate(client, quoteAmount));

  const baseValue = parseAmountValue(baseAmount);
  const quoteValue = parseAmountValue(quoteAmount);

  const price = quoteValue / baseValue;
  const cost = (filled || baseValue) * price;

  const feeRate = side === 'buy' ? quoteRate : baseRate;
  // const feeValue = side === 'buy' ? quoteValue : baseValue;
  // const feeCode = side === 'buy' ? quoteCode : baseCode;
  // const feeCost = (filled || feeValue) * feeRate;
  const feeCost = (filled || baseValue) * feeRate;

  const baseOrder: BaseOrder = {
    datetime: rippleTimeToISOTime(date),
    timestamp: rippleTimeToUnixTime(date),
    symbol: getMarketSymbol(baseAmount, quoteAmount),
    type: 'limit',
    side,
    amount: baseCode === 'XRP' ? dropsToXrp(baseValue) : baseValue.toString(),
    price: quoteCode === 'XRP' ? dropsToXrp(price) : price.toString(),
    cost: quoteCode === 'XRP' ? dropsToXrp(cost) : cost.toString(),
  };

  if (feeCost != 0) {
    baseOrder.fee = {
      currency: getAmountCurrencyCode(side === 'buy' ? quoteAmount : baseAmount),
      cost: baseCode === 'XRP' ? dropsToXrp(feeCost) : feeCost.toString(),
      // cost: feeCode === 'XRP' ? dropsToXrp(feeCost) : feeCost.toString(),
      rate: feeRate.toString(),
      percentage: true,
    };
  }

  return baseOrder;
};

// /**
//  * Trades
//  */
// export const getTrade = async (
//   client: Client,
//   orderId: string,
//   affectedOffer: Offer,
//   txData: TransactionData<OfferCreate>
// ): Promise<Trade | undefined> => {
//   const { date, transaction } = txData;

//   if (!transaction.Sequence) return;

//   const tradeSide = transaction.Flags === OfferFlags.lsfSell ? OrderSide.Sell : OrderSide.Buy;

//   const tradeBaseAmount = affectedOffer[getBaseAmountKey(tradeSide)];
//   const tradeQuoteAmount = affectedOffer[getQuoteAmountKey(tradeSide)];

//   const tradeBaseRate = parseFloat(await fetchTransferRate(client, tradeBaseAmount));
//   const tradeQuoteRate = parseFloat(await fetchTransferRate(client, tradeQuoteAmount));

//   const tradeBaseValue = parseAmountValue(tradeBaseAmount);
//   const tradeQuoteValue = parseAmountValue(tradeQuoteAmount);

//   const tradePrice = tradeQuoteValue / tradeBaseValue;
//   const tradeCost = tradeBaseValue * tradePrice;

//   const tradeFeeCurrency = getAmountCurrencyCode(tradeSide === OrderSide.Buy ? tradeQuoteAmount : tradeBaseAmount);
//   const tradeFeeRate = tradeSide === OrderSide.Buy ? tradeQuoteRate : tradeBaseRate;
//   const tradeFees = tradeBaseValue * tradeFeeRate;

//   const tradeFee: Fee = {
//     currency: tradeFeeCurrency,
//     cost: tradeFees.toString(),
//   };

//   if (tradeFee.cost != 0) {
//     tradeFee.rate = tradeFeeRate.toString();
//     tradeFee.percentage = true;
//   }

//   return {
//     id: getOrderOrTradeId(transaction.Account, transaction.Sequence),
//     order: orderId,
//     datetime: rippleTimeToISOTime(date || 0),
//     timestamp: rippleTimeToUnixTime(date || 0),
//     symbol: getMarketSymbol(tradeBaseAmount, tradeQuoteAmount),
//     type: OrderType.Limit,
//     side: tradeSide,
//     amount: tradeBaseValue.toString(),
//     price: tradePrice.toString(),
//     takerOrMaker: getTakerOrMaker(tradeSide),
//     cost: tradeCost.toString(),
//     fee: tradeFee,
//     info: txData,
//   } as Trade;
// };

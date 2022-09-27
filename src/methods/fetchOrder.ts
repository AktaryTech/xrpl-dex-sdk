import _ from 'lodash';
import { dropsToXrp, OfferCreate, OfferCreateFlags, rippleTimeToISOTime, rippleTimeToUnixTime } from 'xrpl';
import { OfferFlags } from 'xrpl/dist/npm/models/ledger';
import { parseAmountValue } from 'xrpl/dist/npm/models/transactions/common';
import { hashOfferId } from 'xrpl/dist/npm/utils/hashes';
import {
  FetchOrderParams,
  FetchOrderResponse,
  MarketSymbol,
  OrderId,
  TransactionData,
  Order,
  Trade,
  OrderStatus,
  OrderSide,
  OrderTimeInForce,
  SDKContext,
} from '../models';
import {
  BN,
  fetchTransferRate,
  fetchTxn,
  getAmountCurrencyCode,
  getBaseAmountKey,
  getMarketSymbol,
  getMostRecentTxId,
  getOrderOrTradeId,
  getQuoteAmountKey,
  getTakerOrMaker,
  parseOrderId,
  parseTransaction,
} from '../utils';

async function fetchOrder(
  this: SDKContext,
  /** The Order's Account and Sequence number, separated by a colon */
  id: OrderId,
  /** Symbol field is not used */
  /* eslint-disable-next-line */
  symbol: MarketSymbol | undefined = undefined,
  params: FetchOrderParams = {}
): Promise<FetchOrderResponse> {
  /**
   * Set things up
   */
  const { account, sequence } = parseOrderId(id);

  const transactions: TransactionData<OfferCreate>[] = [];

  let status: OrderStatus = 'open';
  let previousTxnId = await getMostRecentTxId(this.client, id, params.searchLimit);
  let previousTxnData: TransactionData<OfferCreate> | undefined;

  /**
   * Build a Transaction history for this Order
   */
  while (previousTxnId) {
    const previousTxnResponse = await fetchTxn(this.client, previousTxnId);
    if (previousTxnResponse) {
      previousTxnData = parseTransaction(id, previousTxnResponse);
      if (previousTxnData) {
        transactions.push(previousTxnData);
        previousTxnId = previousTxnData.previousTxnId;
      }
    }
  }

  /**
   * Parse the Transaction history for Trade and Order objects
   */
  const trades: Trade[] = [];
  let order: Order | undefined;
  let filled = BN(0);

  transactions.sort((a, b) => a.date - b.date);

  for (const transactionData of transactions) {
    const { transaction, offers, date } = transactionData;

    for (const offer of offers) {
      const source = transaction.Account !== account ? transaction : offer;

      if (!source.Sequence) continue;

      const side: OrderSide = source.Flags === OfferFlags.lsfSell ? 'sell' : 'buy';

      const baseAmount = source[getBaseAmountKey(side)];
      const quoteAmount = source[getQuoteAmountKey(side)];

      const baseRate = await fetchTransferRate(this.client, baseAmount);
      const quoteRate = await fetchTransferRate(this.client, quoteAmount);

      const baseCurrency = getAmountCurrencyCode(baseAmount);
      const quoteCurrency = getAmountCurrencyCode(quoteAmount);

      const baseValue =
        baseCurrency === 'XRP' ? BN(dropsToXrp(parseAmountValue(baseAmount))) : BN(parseAmountValue(baseAmount));
      const quoteValue =
        quoteCurrency === 'XRP' ? BN(dropsToXrp(parseAmountValue(quoteAmount))) : BN(parseAmountValue(quoteAmount));

      const amount = baseValue;
      const price = quoteValue.dividedBy(baseValue);
      const cost = amount.times(price);

      const feeRate = side === 'buy' ? quoteRate : baseRate;
      const feeCost = (side === 'buy' ? quoteValue : baseValue).times(feeRate);

      filled = filled.plus(amount);

      const trade: Trade = {
        id: getOrderOrTradeId(source.Account, source.Sequence),
        order: id,
        datetime: rippleTimeToISOTime(date || 0),
        timestamp: rippleTimeToUnixTime(date || 0),
        symbol: getMarketSymbol(baseAmount, quoteAmount),
        type: 'limit',
        side: side,
        amount: amount.toString(),
        price: price.toString(),
        takerOrMaker: getTakerOrMaker(side),
        cost: cost.toString(),
        info: { [transaction.Account !== account ? 'transaction' : 'offer']: source },
      };

      if (feeCost.isGreaterThan(0)) {
        trade.fee = {
          currency: side === 'buy' ? quoteCurrency : baseCurrency,
          cost: feeCost.toString(),
          rate: feeRate.toString(),
          percentage: true,
        };
      }

      trades.push(trade);
    }

    if (transaction.Account === account && transaction.Sequence === sequence) {
      const source = transaction as OfferCreate;

      if (!source.Sequence) return;

      const side: OrderSide = source.Flags === OfferCreateFlags.tfSell ? 'sell' : 'buy';

      let orderTimeInForce: OrderTimeInForce = 'GTC';
      if (source.Flags === OfferCreateFlags.tfPassive) orderTimeInForce = 'PO';
      else if (source.Flags === OfferCreateFlags.tfFillOrKill) orderTimeInForce = 'FOK';
      else if (source.Flags === OfferCreateFlags.tfImmediateOrCancel) orderTimeInForce = 'IOC';

      const baseAmount = source[getBaseAmountKey(side)];
      const quoteAmount = source[getQuoteAmountKey(side)];

      const baseRate = await fetchTransferRate(this.client, baseAmount);
      const quoteRate = await fetchTransferRate(this.client, quoteAmount);

      const baseCurrency = getAmountCurrencyCode(baseAmount);
      const quoteCurrency = getAmountCurrencyCode(quoteAmount);

      const baseValue =
        baseCurrency === 'XRP' ? BN(dropsToXrp(parseAmountValue(baseAmount))) : BN(parseAmountValue(baseAmount));
      const quoteValue =
        quoteCurrency === 'XRP' ? BN(dropsToXrp(parseAmountValue(quoteAmount))) : BN(parseAmountValue(quoteAmount));

      const amount = baseValue;
      const price = quoteValue.dividedBy(baseValue);
      const cost = filled.times(price);
      const remaining = amount.minus(filled);

      const feeRate = side === 'buy' ? quoteRate : baseRate;
      const feeCost = filled.times(feeRate);

      order = {
        id,
        clientOrderId: hashOfferId(source.Account, source.Sequence),
        datetime: rippleTimeToISOTime(date),
        timestamp: rippleTimeToUnixTime(date),
        lastTradeTimestamp: rippleTimeToUnixTime(transactions[0].date || 0),
        status,
        symbol: getMarketSymbol(baseAmount, quoteAmount),
        type: 'limit',
        timeInForce: orderTimeInForce,
        side,
        amount: amount.toString(),
        price: price.toString(),
        average: (trades.length ? filled.dividedBy(trades.length) : 0).toString(), // as cool as dividing by zero is, we shouldn't do it
        filled: filled.toString(),
        remaining: remaining.toString(),
        cost: cost.toString(),
        trades,
        info: { transactionData },
      };

      if (feeCost.isGreaterThan(0)) {
        order.fee = {
          currency: side === 'buy' ? quoteCurrency : baseCurrency,
          cost: feeCost.toString(),
          rate: feeRate.toString(),
          percentage: true,
        };
      }
    }
  }

  return order;
}

export default fetchOrder;

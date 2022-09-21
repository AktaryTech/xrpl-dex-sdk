import _ from 'lodash';
import { Readable } from 'stream';
import {
  dropsToXrp,
  OfferCreate,
  OfferCreateFlags,
  rippleTimeToISOTime,
  rippleTimeToUnixTime,
  SubscribeRequest,
  TransactionStream,
} from 'xrpl';
import { Offer, OfferFlags } from 'xrpl/dist/npm/models/ledger';
import { parseAmountValue } from 'xrpl/dist/npm/models/transactions/common';
import { hashOfferId } from 'xrpl/dist/npm/utils/hashes';
import {
  MarketSymbol,
  WatchOrdersParams,
  SDKContext,
  Node,
  Order,
  OrderSide,
  Trade,
  OrderTimeInForce,
  OrderStatus,
  XrplTimestamp,
} from '../models';
import {
  fetchTransferRate,
  getAmountCurrencyCode,
  getBaseAmountKey,
  getMarketSymbol,
  getOfferFromNode,
  getOrderOrTradeId,
  getQuoteAmountKey,
  getTakerOrMaker,
} from '../utils';

/**
 * Retrieves order book data for mulitple market pairs. Returns a
 * {@link WatchOrdersResponse}.
 *
 * @category Methods
 */
async function watchOrders(
  this: SDKContext,
  /** Filter Orders by market symbol */
  symbol?: MarketSymbol,
  /** eslint-disable-next-line */
  params: WatchOrdersParams = {}
): Promise<Readable> {
  const showOpen = params.showOpen || true;
  const showClosed = params.showClosed || true;
  const showCanceled = params.showCanceled || true;

  const orderStream = new Readable({ read: () => this });

  await this.client.request({
    command: 'subscribe',
    streams: ['transactions'],
  } as SubscribeRequest);

  this.client.on('transaction', async (tx: TransactionStream) => {
    if (!tx.validated || tx.transaction.TransactionType !== 'OfferCreate') return;

    const transaction = tx.transaction as OfferCreate;
    if (!transaction.Sequence) return;

    const tradeOffers: Offer[] = [];
    const parsedNodes: Node[] = [];

    tx.meta?.AffectedNodes.forEach((affectedNode: Node) => {
      const offer = getOfferFromNode(affectedNode);
      if (offer && offer.Account !== transaction.Account) {
        tradeOffers.push(offer);
        parsedNodes.push(affectedNode);
      }
    });

    const orderId = getOrderOrTradeId(transaction.Account, transaction.Sequence);
    const trades: Trade[] = [];
    const date: XrplTimestamp | undefined = tx.transaction.date;
    let order: Order | undefined;
    let status: OrderStatus = 'open';
    let filled = 0;

    const orderSide: OrderSide = transaction.Flags === OfferCreateFlags.tfSell ? 'sell' : 'buy';
    const orderBaseAmount = transaction[getBaseAmountKey(orderSide)];
    const orderQuoteAmount = transaction[getQuoteAmountKey(orderSide)];
    const orderSymbol = getMarketSymbol(orderBaseAmount, orderQuoteAmount);

    /** Filter by symbol (if applicable) */
    if (symbol && symbol !== orderSymbol) return;

    for (const offer of tradeOffers) {
      if (!offer.Sequence) continue;

      const side: OrderSide = offer.Flags === OfferFlags.lsfSell ? 'sell' : 'buy';

      const baseAmount = offer[getBaseAmountKey(side)];
      const quoteAmount = offer[getQuoteAmountKey(side)];

      const baseRate = parseFloat(await fetchTransferRate(this.client, baseAmount));
      const quoteRate = parseFloat(await fetchTransferRate(this.client, quoteAmount));

      const baseCurrency = getAmountCurrencyCode(baseAmount);
      const quoteCurrency = getAmountCurrencyCode(quoteAmount);

      const baseValue = parseAmountValue(baseAmount);
      const quoteValue = parseAmountValue(quoteAmount);

      const price = quoteValue / baseValue;
      const cost = baseValue * price;

      const feeRate = side === 'buy' ? quoteRate : baseRate;
      const feeCost = baseValue * feeRate;

      filled += baseValue;

      const trade: Trade = {
        id: getOrderOrTradeId(offer.Account, offer.Sequence),
        order: getOrderOrTradeId(transaction.Account, transaction.Sequence),
        datetime: rippleTimeToISOTime(date || 0),
        timestamp: rippleTimeToUnixTime(date || 0),
        symbol: getMarketSymbol(baseAmount, quoteAmount),
        type: 'limit',
        side: side,
        amount: baseCurrency === 'XRP' ? dropsToXrp(baseValue) : baseValue.toString(),
        price: quoteCurrency === 'XRP' ? dropsToXrp(price) : price.toString(),
        takerOrMaker: getTakerOrMaker(side),
        cost: baseCurrency === 'XRP' ? dropsToXrp(cost) : cost.toString(),
        info: { [transaction.Account !== transaction.Account ? 'transaction' : 'offer']: offer },
      };

      if (feeCost != 0) {
        trade.fee = {
          currency: side === 'buy' ? quoteCurrency : baseCurrency,
          cost: feeCost.toString(),
          rate: feeRate.toString(),
          percentage: true,
        };
      }

      trades.push(trade);
    }

    let orderTimeInForce: OrderTimeInForce = 'GTC';
    if (transaction.Flags === OfferCreateFlags.tfPassive) orderTimeInForce = 'PO';
    else if (transaction.Flags === OfferCreateFlags.tfFillOrKill) orderTimeInForce = 'FOK';
    else if (transaction.Flags === OfferCreateFlags.tfImmediateOrCancel) orderTimeInForce = 'IOC';

    const baseRate = parseFloat(await fetchTransferRate(this.client, orderBaseAmount));
    const quoteRate = parseFloat(await fetchTransferRate(this.client, orderQuoteAmount));

    const baseCurrency = getAmountCurrencyCode(orderBaseAmount);
    const quoteCurrency = getAmountCurrencyCode(orderQuoteAmount);

    const baseValue = parseAmountValue(orderBaseAmount);
    const quoteValue = parseAmountValue(orderQuoteAmount);

    const orderPrice = quoteValue / baseValue;
    const cost = filled * orderPrice;
    const remaining = baseValue - filled;

    const feeRate = orderSide === 'buy' ? quoteRate : baseRate;
    const feeCost = filled * feeRate;

    order = {
      id: orderId,
      clientOrderId: hashOfferId(transaction.Account, transaction.Sequence),
      datetime: rippleTimeToISOTime(date || 0),
      timestamp: rippleTimeToUnixTime(date || 0),
      lastTradeTimestamp: rippleTimeToUnixTime(date || 0),
      status,
      symbol: orderSymbol,
      type: 'limit',
      timeInForce: orderTimeInForce,
      side: orderSide,
      amount: baseCurrency === 'XRP' ? dropsToXrp(baseValue) : baseValue.toString(),
      price: quoteCurrency === 'XRP' ? dropsToXrp(orderPrice) : orderPrice.toString(),
      average: (trades.length ? filled / trades.length : 0).toString(), // as cool as dividing by zero is, we shouldn't do it
      filled: baseCurrency === 'XRP' ? dropsToXrp(filled) : filled.toString(),
      remaining: baseCurrency === 'XRP' ? dropsToXrp(remaining) : remaining.toString(),
      cost: baseCurrency === 'XRP' ? dropsToXrp(cost) : cost.toString(),
      trades,
      info: { transaction: tx },
    };

    if (feeCost != 0) {
      order.fee = {
        currency: orderSide === 'buy' ? quoteCurrency : baseCurrency,
        cost: feeCost.toString(),
        rate: feeRate.toString(),
        percentage: true,
      };
    }

    /** Filter by status if `showOpen`, `showClosed`, or `showCanceled` is defined */
    if (
      (order.status === 'open' && !showOpen) ||
      (order.status === 'closed' && !showClosed) ||
      (order.status === 'canceled' && !showCanceled)
    )
      return;

    orderStream.push(JSON.stringify(order));
  });

  return orderStream;
}

export default watchOrders;

import { BaseError, Order } from 'ccxt';
import {
  OfferCreate,
  OfferCreateFlags,
  rippleTimeToISOTime,
  rippleTimeToUnixTime,
  setTransactionFlagsToNumber,
  TxResponse,
} from 'xrpl';
import { Amount } from 'xrpl/dist/npm/models/common';
import { Offer, OfferFlags } from 'xrpl/dist/npm/models/ledger';
import {
  CurrencyCode,
  MarketSymbol,
  ModifiedNode,
  OrderSide,
  OrderStatus,
  OrderTimeInForce,
  OrderType,
  Trade,
} from '../models';
import { parseCurrencyAmount } from './numbers';

export const getOrderSideFromTx = (tx: TxResponse['result']) =>
  tx.Flags === OfferFlags.lsfSell ? OrderSide.Sell : OrderSide.Buy;
export const getOrderSideFromOffer = (offer: Offer) =>
  offer.Flags === OfferFlags.lsfSell ? OrderSide.Sell : OrderSide.Buy;
export const getBaseAmountKey = (side: OrderSide) => (side === OrderSide.Buy ? 'TakerPays' : 'TakerGets');
export const getQuoteAmountKey = (side: OrderSide) => (side === OrderSide.Buy ? 'TakerGets' : 'TakerPays');

export const getOfferTradeFromModifiedOffer = (
  id: string,
  modifiedOffer: ModifiedNode['ModifiedNode'],
  transaction: TxResponse['result']
) => {
  if (!transaction.Sequence) throw new BaseError(`No Sequence number found for transaction ${transaction.hash}`);

  const tradePreviousFields = modifiedOffer.PreviousFields as unknown as Offer;
  const tradeFinalFields = modifiedOffer.FinalFields as unknown as Offer;

  const tradeSide = transaction.Flags === OfferFlags.lsfSell ? OrderSide.Sell : OrderSide.Buy;

  const tradeBaseAmountKey = tradeSide === OrderSide.Buy ? 'TakerPays' : 'TakerGets';
  const tradeQuoteAmountKey = tradeSide === OrderSide.Buy ? 'TakerGets' : 'TakerPays';

  // 4. Subtract the FinalFields TakerGets/TakerPays values from the PreviousFields values
  const tradePreviousBaseAmount = tradePreviousFields[tradeBaseAmountKey];
  const tradeFinalBaseAmount = tradeFinalFields[tradeBaseAmountKey];

  const tradePreviousQuoteAmount = tradePreviousFields[tradeQuoteAmountKey];
  const tradeFinalQuoteAmount = tradeFinalFields[tradeQuoteAmountKey];

  const tradeBaseAmount = parseCurrencyAmount(tradeFinalBaseAmount, tradePreviousBaseAmount);
  const tradeQuoteAmount = parseCurrencyAmount(tradeFinalQuoteAmount, tradePreviousQuoteAmount);
  const tradePrice = tradeBaseAmount / tradeQuoteAmount;

  // 5. Assemble Trade data from the ModifiedNode's FinalFields object
  const trade: Trade = {
    id: transaction.Sequence.toString(),
    order: id,
    datetime: rippleTimeToISOTime(transaction.date || 0),
    timestamp: rippleTimeToUnixTime(transaction.date || 0),
    symbol: getMarketSymbol(tradeFinalFields[tradeBaseAmountKey], tradeFinalFields[tradeQuoteAmountKey]),
    type: OrderType.Limit,
    side: tradeSide,
    amount: tradeBaseAmount.toString(),
    price: tradePrice.toString(),
    takerOrMaker: tradeSide === OrderSide.Buy ? 'taker' : 'maker', // verify this is correct
    cost: (tradeBaseAmount * tradePrice).toString(),
    fee: {
      currency: 'XRP',
      cost: transaction.Fee || '0',
    },
    info: { transaction: transaction },
  };

  return trade;
};

export const xrplOfferToCcxtTrade = (offer: Offer, transaction: TxResponse, offerPrevious?: Offer): Trade => {
  const tradeSide = offer.Flags === OfferFlags.lsfSell ? OrderSide.Sell : OrderSide.Buy;
  const tradeBase = tradeSide === OrderSide.Buy ? offer.TakerPays : offer.TakerGets;
  const tradeBasePrevious = offerPrevious
    ? tradeSide === OrderSide.Buy
      ? offerPrevious.TakerPays
      : offerPrevious.TakerGets
    : '0';

  const tradeQuote = tradeSide === OrderSide.Buy ? offer.TakerGets : offer.TakerPays;
  const tradeQuotePrevious = offerPrevious
    ? tradeSide === OrderSide.Buy
      ? offerPrevious.TakerGets
      : offerPrevious.TakerPays
    : '0';

  const tradeSymbol = getMarketSymbol(tradeBase, tradeQuote);

  const tradeAmount = parseCurrencyAmount(tradeBase, tradeBasePrevious);
  const tradePrice = parseCurrencyAmount(tradeQuote, tradeQuotePrevious);

  const feeCost = stringToInt(transaction.result.Fee || '0') || 0;

  const trade: Trade = {
    id: offer.Sequence.toString(),
    order: offer.Sequence.toString(),
    datetime: rippleTimeToISOTime(transaction.result.date || 0),
    timestamp: rippleTimeToUnixTime(transaction.result.date || 0),
    symbol: tradeSymbol,
    type: OrderType.Limit,
    side: tradeSide,
    amount: tradeAmount.toString(),
    price: tradePrice.toString(),
    takerOrMaker: 'maker',
    cost: (tradeAmount * tradePrice + feeCost).toString(),
    fee: {
      currency: 'XRP',
      cost: feeCost,
    },
    info: { offer, transaction },
  };

  return trade;
};

export const xrplOfferToCcxtOrder = (offer: Offer): Order => {
  const price = parseCurrencyAmount(offer.TakerGets);
  const amount = parseCurrencyAmount(offer.TakerPays);

  // TODO: get this data from Trades
  const filled = 0;
  const remaining = amount;

  // Average filling price (float)
  const average = 0;

  const order: Order = {
    id: offer.Sequence.toString(),
    clientOrderId: '',
    datetime: '',
    timestamp: 0,
    lastTradeTimestamp: 0, // TODO: get this data
    status: OrderStatus.Open, // TODO: get this data
    symbol: getMarketSymbol(offer.TakerPays, offer.TakerGets),
    type: OrderType.Limit, // TODO: get this data
    timeInForce: offer.Flags === OfferFlags.lsfPassive ? OrderTimeInForce.PostOnly : undefined,
    side: offer.Flags === OfferFlags.lsfSell ? 'sell' : 'buy',
    price,
    average,
    amount,
    filled,
    remaining,
    cost: filled * price,
    trades: [],
    fee: {
      currency: 'XRP',
      cost: 0,
      rate: 0,
      type: 'maker', // TODO: get this data
    },
    info: JSON.stringify(offer),
  };
  return order;
};

export const parseMarketSymbol = (symbol: MarketSymbol): [base: CurrencyCode, quote: CurrencyCode] => {
  const [base, quote] = symbol.split('/');
  return [base, quote];
};

export const getMarketSymbol = (base: Amount, quote: Amount): MarketSymbol => {
  const symbol: string[] = [];

  symbol.push(typeof base === 'object' ? base.currency : 'XRP');
  symbol.push(typeof quote === 'object' ? quote.currency : 'XRP');

  return symbol.join('/');
};

export const offerCreateFlagsToTimeInForce = (tx: OfferCreate): OrderTimeInForce | undefined => {
  setTransactionFlagsToNumber(tx);
  const flags = tx.Flags as number;
  if (flags === 0 && !tx.Expiration) {
    return OrderTimeInForce.GoodTillCanceled;
  } else if ((flags & OfferCreateFlags.tfFillOrKill) === OfferCreateFlags.tfFillOrKill) {
    return OrderTimeInForce.FillOrKill;
  } else if ((flags & OfferCreateFlags.tfImmediateOrCancel) === OfferCreateFlags.tfImmediateOrCancel) {
    return OrderTimeInForce.ImmediateOrCancel;
  } else if ((flags & OfferCreateFlags.tfPassive) === OfferCreateFlags.tfPassive) {
    return OrderTimeInForce.PostOnly;
  }
};

export const stringToInt = (input?: string): number | undefined => {
  try {
    return input ? parseInt(input) : 0;
  } catch (err) {
    return;
  }
};

export const stringToFloat = (input?: string): number | undefined => {
  try {
    return input ? parseFloat(input) : 0;
  } catch (err) {
    return;
  }
};

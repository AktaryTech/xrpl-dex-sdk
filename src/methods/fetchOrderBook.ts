import { BadRequest } from 'ccxt';
import _ from 'lodash';
import { BookOffersRequest, dropsToXrp } from 'xrpl';
import { parseAmountValue } from 'xrpl/dist/npm/models/transactions/common';
import { DEFAULT_SEARCH_LIMIT } from '../constants';
import {
  OrderBookAsk,
  MarketSymbol,
  FetchOrderBookParams,
  FetchOrderBookResponse,
  SDKContext,
  OrderBookBid,
  OrderBook,
} from '../models';
import { getBaseAmountKey, getOrderSideFromOffer, parseMarketSymbol } from '../utils';

/**
 * Retrieves order book data for a single market pair. Returns an
 * {@link FetchOrderBookResponse}.
 *
 * @category Methods
 */
async function fetchOrderBook(
  this: SDKContext,
  /** Token pair (called Unified Market Symbol in CCXT) */
  symbol: MarketSymbol,
  /** Number of results to return */
  limit: number = DEFAULT_SEARCH_LIMIT,
  /** Parameters specific to the exchange API endpoint */
  params: FetchOrderBookParams
): Promise<FetchOrderBookResponse | undefined> {
  if (!params) throw new BadRequest('Must provide a params object');

  const { issuers } = params;

  const [base, quote] = parseMarketSymbol(symbol);

  if ((base !== 'XRP' && !issuers[base]) || (quote !== 'XRP' && !issuers[quote]))
    throw new BadRequest('Must specify an issuer for non-XRP currencies');

  const orderBookRequest: BookOffersRequest = {
    command: 'book_offers',
    taker_pays: { currency: base },
    taker_gets: { currency: quote },
    limit,
    both: true,
  };

  if (base !== 'XRP') orderBookRequest.taker_pays.issuer = issuers[base];
  if (quote !== 'XRP') orderBookRequest.taker_gets.issuer = issuers[quote];

  const orderBookResponse = await this.client.request(orderBookRequest);
  const offers = orderBookResponse.result.offers;

  const bids: OrderBookBid[] = [];
  const asks: OrderBookAsk[] = [];

  for (const offer of offers) {
    if (!offer.quality) return;
    const side = getOrderSideFromOffer(offer);
    const baseAmount = offer[getBaseAmountKey(side)];
    const baseValue =
      base === 'XRP' ? dropsToXrp(parseAmountValue(baseAmount)) : parseAmountValue(baseAmount).toString();

    const orderBookEntry = [offer.quality, baseValue];

    if (side === 'buy') {
      bids.push(orderBookEntry as OrderBookBid);
    } else {
      asks.push(orderBookEntry as OrderBookAsk);
    }
  }
  const nonce = offers[offers.length - 1].Sequence;

  const response: OrderBook = {
    symbol,
    nonce,
    bids,
    asks,
  };

  return response;
}

export default fetchOrderBook;

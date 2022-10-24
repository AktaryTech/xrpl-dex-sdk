import { randomUUID } from 'crypto';
import _ from 'lodash';
import { BookOffersRequest } from 'xrpl';
import { CURRENCY_PRECISION, DEFAULT_LIMIT, DEFAULT_SEARCH_LIMIT } from '../constants';
import {
  OrderBookAsk,
  MarketSymbol,
  FetchOrderBookParams,
  FetchOrderBookResponse,
  SDKContext,
  OrderBookBid,
  OrderBook,
  ArgumentsRequired,
} from '../models';
import { getSharedOrderData, getTakerAmount, parseMarketSymbol, validateMarketSymbol } from '../utils';

/**
 * Retrieves order book data for a single market pair. Returns an
 * {@link FetchOrderBookResponse}.
 *
 * @category Methods
 *
 * @param symbol Market symbol to get order book for
 * @param limit (Optional) Total number of entries to return (default is 20)
 * @param params (Optional) Additional request parameters
 * @returns A FetchOrderBookResponse object
 */
async function fetchOrderBook(
  this: SDKContext,
  symbol: MarketSymbol,
  limit: number = DEFAULT_LIMIT,
  params: FetchOrderBookParams = {
    searchLimit: DEFAULT_SEARCH_LIMIT,
  }
): Promise<FetchOrderBookResponse> {
  if (!symbol) throw new ArgumentsRequired('Missing required arguments for fetchOrderBook call');
  validateMarketSymbol(symbol);

  const { searchLimit } = params;

  const [baseCurrency, quoteCurrency] = parseMarketSymbol(symbol);

  const baseAmount = getTakerAmount(baseCurrency);
  const quoteAmount = getTakerAmount(quoteCurrency);

  const orderBookRequest: BookOffersRequest = {
    id: randomUUID(),
    command: 'book_offers',
    taker_pays: baseAmount,
    taker_gets: quoteAmount,
    limit: searchLimit,
    both: true,
  };

  if (params.ledgerHash) orderBookRequest.ledger_hash = params.ledgerHash;
  if (params.ledgerIndex) orderBookRequest.ledger_index = params.ledgerIndex;

  const orderBookResponse = await this.client.request(orderBookRequest);
  const offers = orderBookResponse.result.offers;

  const bids: OrderBookBid[] = [];
  const asks: OrderBookAsk[] = [];

  for (const offer of offers) {
    const sharedData = await getSharedOrderData.call(this, offer);

    if (!sharedData) continue;

    const { side, price, amount } = sharedData;

    const orderBookEntry = [
      (+price.toPrecision(CURRENCY_PRECISION)).toString(),
      (+amount.toPrecision(CURRENCY_PRECISION)).toString(),
    ];

    if (side === 'sell') asks.push(orderBookEntry as OrderBookAsk);
    else bids.push(orderBookEntry as OrderBookBid);

    if (bids.length + asks.length > limit) break;
  }

  const nonce = orderBookResponse.result.ledger_index ?? Date.now();

  const response: OrderBook = {
    symbol,
    nonce,
    bids,
    asks,
  };

  return response;
}

export default fetchOrderBook;

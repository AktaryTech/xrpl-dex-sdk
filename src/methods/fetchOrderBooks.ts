import _ from 'lodash';
import { DEFAULT_LIMIT } from '../constants';
import { SDKContext, FetchOrderBooksParams, FetchOrderBooksResponse, MarketSymbol, ArgumentsRequired } from '../models';
import { validateMarketSymbol } from '../utils';

/**
 * Retrieves order book data for multiple market pairs. Returns an
 * {@link FetchOrderBooksResponse}.
 *
 * @category Methods
 *
 * @param symbols Array of Market symbols to get order books for
 * @param limit (Optional) Total number of entries to return (default is 20)
 * @param params (Optional) Additional request parameters
 * @returns A FetchOrderBooksResponse object
 */
async function fetchOrderBooks(
  this: SDKContext,
  symbols: MarketSymbol[],
  limit: number = DEFAULT_LIMIT,
  params: FetchOrderBooksParams
): Promise<FetchOrderBooksResponse> {
  if (!symbols) throw new ArgumentsRequired('Missing required arguments for fetchOrderBooks call');
  const orderBooks: FetchOrderBooksResponse = {};

  for (let s = 0, sl = symbols.length; s < sl; s += 1) {
    const symbol = symbols[s];
    validateMarketSymbol(symbol);
    const orderBook = await this.fetchOrderBook(symbol, limit, params[symbol] || {});
    if (orderBook) orderBooks[symbol] = orderBook;
  }

  return orderBooks;
}

export default fetchOrderBooks;

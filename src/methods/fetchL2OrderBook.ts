import _ from 'lodash';
import { DEFAULT_LIMIT } from '../constants';
import { MarketSymbol, SDKContext, FetchL2OrderBookParams, FetchL2OrderBookResponse } from '../models';

async function fetchL2OrderBook(
  this: SDKContext,
  /** Order Book market */
  symbol: MarketSymbol,
  /** Total number of entries to return */
  limit: number = DEFAULT_LIMIT,
  /** eslint-disable-next-line */
  params: FetchL2OrderBookParams = {}
): Promise<FetchL2OrderBookResponse> {
  return await this.fetchOrderBook(symbol, limit, params);
}

export default fetchL2OrderBook;

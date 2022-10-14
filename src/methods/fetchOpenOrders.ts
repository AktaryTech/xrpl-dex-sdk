import _ from 'lodash';
import { DEFAULT_LIMIT } from '../constants';
import { FetchOpenOrdersParams, FetchOpenOrdersResponse, MarketSymbol, UnixTimestamp, SDKContext } from '../models';
import { validateMarketSymbol } from '../utils';

async function fetchOpenOrders(
  this: SDKContext,
  /** Filter Orders by market symbol */
  symbol?: MarketSymbol,
  /** Only return Orders since this date */
  since?: UnixTimestamp,
  /** Total number of Orders to return */
  limit: number = DEFAULT_LIMIT,
  /** eslint-disable-next-line */
  params: FetchOpenOrdersParams = {}
): Promise<FetchOpenOrdersResponse> {
  if (symbol) validateMarketSymbol(symbol);

  const { searchLimit } = params;

  const orders =
    (await this.fetchOrders(symbol, since, limit, {
      searchLimit,
      showOpen: true,
      showClosed: false,
      showCanceled: false,
    })) || [];

  return orders;
}

export default fetchOpenOrders;

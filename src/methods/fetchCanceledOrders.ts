import _ from 'lodash';
import { DEFAULT_LIMIT } from '../constants';
import {
  FetchCanceledOrdersParams,
  FetchCanceledOrdersResponse,
  MarketSymbol,
  UnixTimestamp,
  SDKContext,
} from '../models';
import { validateMarketSymbol } from '../utils';

async function fetchCanceledOrders(
  this: SDKContext,
  /** Filter Orders by market symbol */
  symbol?: MarketSymbol,
  /** Only return Orders since this date */
  since?: UnixTimestamp,
  /** Total number of Orders to return */
  limit: number = DEFAULT_LIMIT,
  /** eslint-disable-next-line */
  params: FetchCanceledOrdersParams = {}
): Promise<FetchCanceledOrdersResponse> {
  if (symbol) validateMarketSymbol(symbol);

  const { searchLimit } = params;

  const orders =
    (await this.fetchOrders(symbol, since, limit, {
      searchLimit,
      showOpen: false,
      showClosed: false,
      showCanceled: true,
    })) || [];

  return orders;
}

export default fetchCanceledOrders;

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

/**
 * Fetches a list of canceled Orders from the dEX. Returns a {@link FetchCanceledOrderResponse}.
 *
 * @category Methods
 *
 * @param this SDKContext
 * @param symbol (Optional) Market symbol to filter Orders by
 * @param since (Optional) Only return Orders since this date
 * @param limit (Optional) Total number of Orders to return (default is 20)
 * @param params (Optional) Additional request parameters
 * @returns A FetchCanceledOrdersResponse object
 */
async function fetchCanceledOrders(
  this: SDKContext,
  symbol?: MarketSymbol,
  since?: UnixTimestamp,
  limit: number = DEFAULT_LIMIT,
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

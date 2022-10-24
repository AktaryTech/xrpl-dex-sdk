import _ from 'lodash';
import {
  ArgumentsRequired,
  CreateLimitBuyOrderParams,
  CreateLimitBuyOrderResponse,
  MarketSymbol,
  SDKContext,
} from '../models';
import { validateMarketSymbol } from '../utils';

/**
 * Places a Limit Buy Order on the Ripple dEX. Returns an {@link CreateLimitBuyOrderResponse}
 * with the newly created Order object.
 *
 * @category Methods
 *
 * @param this SDKContext
 * @param symbol Market symbol for new Order
 * @param amount How much currency you want to trade (in units of base currency)
 * @param price Price at which the order is to be fullfilled (in units of quote currency)
 * @param params (Optional) Additional request parameters
 * @returns A CreateLimitBuyOrderResponse object
 */
async function createLimitBuyOrder(
  this: SDKContext,
  symbol: MarketSymbol,
  amount: string,
  price: string,
  params: CreateLimitBuyOrderParams = {}
): Promise<CreateLimitBuyOrderResponse> {
  if (!symbol || !amount || !price || !params)
    throw new ArgumentsRequired('Missing required arguments for createLimitBuyOrder call');
  validateMarketSymbol(symbol);

  const newOrder = await this.createOrder(symbol, 'buy', 'limit', amount, price, params);

  return newOrder;
}

export default createLimitBuyOrder;

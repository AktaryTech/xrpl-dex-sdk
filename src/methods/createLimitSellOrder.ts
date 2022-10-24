import _ from 'lodash';
import {
  ArgumentsRequired,
  CreateLimitSellOrderParams,
  CreateLimitSellOrderResponse,
  MarketSymbol,
  SDKContext,
} from '../models';
import { validateMarketSymbol } from '../utils';

/**
 * Places a Limit Sell Order on the Ripple dEX. Returns an {@link CreateLimitSellOrderResponse}
 * with the newly created Order object.
 *
 * @category Methods
 *
 * @param this SDKContext
 * @param symbol Market symbol for new Order
 * @param amount How much currency you want to trade (in units of base currency)
 * @param price Price at which the order is to be fullfilled (in units of quote currency)
 * @param params (Optional) Additional request parameters
 * @returns A CreateLimitSellOrderResponse object
 */
async function createLimitSellOrder(
  this: SDKContext,
  symbol: MarketSymbol,
  amount: string,
  price: string,
  params: CreateLimitSellOrderParams = {}
): Promise<CreateLimitSellOrderResponse> {
  if (!symbol || !amount || !price || !params)
    throw new ArgumentsRequired('Missing required arguments for createLimitSellOrder call');
  validateMarketSymbol(symbol);

  const newOrder = await this.createOrder(symbol, 'sell', 'limit', amount, price, params);

  return newOrder;
}

export default createLimitSellOrder;

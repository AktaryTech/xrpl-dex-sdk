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
 * Creates a new Order on the Ripple dEX. Returns an {@link CreateLimitSellOrderResponse}
 * with the newly created Order object.
 *
 * @category Methods
 */
async function createLimitSellOrder(
  this: SDKContext,
  /** Token pair (called Unified Market Symbol in CCXT) */
  symbol: MarketSymbol,
  /** How much currency you want to trade (usually, but not always) in units of the base currency) */
  amount: string,
  /** The price at which the order is to be fullfilled in units of the quote currency (ignored in market orders) */
  price: string,
  /** Parameters specific to the exchange API endpoint */
  params: CreateLimitSellOrderParams
): Promise<CreateLimitSellOrderResponse> {
  if (!symbol || !amount || !price || !params)
    throw new ArgumentsRequired('Missing required arguments for createLimitSellOrder call');
  validateMarketSymbol(symbol);

  const newOrderId = await this.createOrder(symbol, 'sell', 'limit', amount, price, params);

  return newOrderId;
}

export default createLimitSellOrder;

import { BalanceStream } from '../ccxt';
import { CurrencyCode } from '../common';

/**
 * Request parameters for a watchBalance call
 *
 * @category Parameters
 */
export interface WatchBalanceParams {
  /** Currency code to filter balances by */
  code?: CurrencyCode;
}

/**
 * Expected response from a watchBalance call
 *
 * @category Responses
 */
export type WatchBalanceResponse = BalanceStream;

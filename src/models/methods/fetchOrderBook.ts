import { LedgerIndex } from 'xrpl/dist/npm/models/common';
import { OrderBook } from '../ccxt';
import { AccountAddress, BaseParams, CurrencyCode } from '../common';

/**
 * Request parameters for a fetchOrderBook call
 *
 * @category Parameters
 */
export interface FetchOrderBookParams extends BaseParams {
  issuers: Record<CurrencyCode, AccountAddress>;
  /** Get order book from the given ledger */
  ledgerIndex?: LedgerIndex;
  /** Get order book from the provided hash */
  ledgerHash?: string;
}

/**
 * Expected response from a fetchOrderBook call
 *
 * @category Responses
 */
export type FetchOrderBookResponse = OrderBook;

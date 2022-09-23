import { LedgerIndex } from 'xrpl/dist/npm/models/common';
import { OrderBookStream } from '../ccxt/OrderBook';
import { AccountAddress } from '../common';

/**
 * Request parameters for a watchOrderBook call
 *
 * @category Parameters
 */
export interface WatchOrderBookParams {
  /** Filter order book by taker address */
  taker?: AccountAddress;
  /** Get order book from the given ledger */
  ledger_index?: LedgerIndex;
  /** Get order book from the provided hash */
  ledger_hash?: string;
}

/**
 * Expected response from a watchOrderBook call
 *
 * @category Responses
 */
export type WatchOrderBookResponse = OrderBookStream;

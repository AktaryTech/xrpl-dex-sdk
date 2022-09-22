import { LedgerIndex } from 'xrpl/dist/npm/models/common';
import { OrderBook } from '../ccxt';
import { AccountAddress, BaseParams } from '../common';

/**
 * Request parameters for a fetchL2OrderBook call
 *
 * @category Parameters
 */
export interface FetchL2OrderBookParams extends BaseParams {
  /** Issuer for the currency being received by the order creator (if other than XRP) */
  taker_pays_issuer?: AccountAddress;
  /** Issuer for the currency being paid by the order creator (if other than XRP) */
  taker_gets_issuer?: AccountAddress;
  /** Filter order book by taker address */
  taker?: AccountAddress;
  /** Get order book from the given ledger */
  ledger_index?: LedgerIndex;
  /** Get order book from the provided hash */
  ledger_hash?: string;
}

/**
 * Expected response from a fetchL2OrderBook call
 *
 * @category Responses
 */
export type FetchL2OrderBookResponse = OrderBook;

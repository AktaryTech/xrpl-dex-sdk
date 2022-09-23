import { Readable } from 'stream';
import { LedgerIndex } from 'xrpl/dist/npm/models/common';
import { AccountAddress, BaseParams, CurrencyCode } from '../common';

/**
 * Request parameters for a watchOrderBook call
 *
 * @category Parameters
 */
export interface WatchOrderBookParams extends BaseParams {
  issuers: Record<CurrencyCode, AccountAddress>;
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
export type WatchOrderBookResponse = Readable;

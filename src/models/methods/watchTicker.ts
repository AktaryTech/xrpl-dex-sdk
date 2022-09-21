import { Readable } from 'stream';
import { AccountAddress, BaseParams, CurrencyCode } from '../common';

/**
 * Request parameters for a watchTicker call
 *
 * @category Parameters
 */
export interface WatchTickerParams extends BaseParams {
  issuers: Record<CurrencyCode, AccountAddress>;
  /** Max number of Orders to look through before calculating ticker data */
  searchLimit?: number;
}

/**
 * Expected response from a watchTicker call
 *
 * @category Responses
 */
export type WatchTickerResponse = Readable;

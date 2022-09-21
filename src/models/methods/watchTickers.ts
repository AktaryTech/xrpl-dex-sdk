import { Readable } from 'stream';
import { AccountAddress, BaseParams, CurrencyCode } from '../common';

/**
 * Request parameters for a watchTickers call
 *
 * @category Parameters
 */
export interface WatchTickersParams extends BaseParams {
  issuers: Record<CurrencyCode, AccountAddress>;
  /** Max number of Orders to look through before calculating ticker data */
  searchLimit?: number;
}

/**
 * Expected response from a watchTickers call
 *
 * @category Responses
 */
export type WatchTickersResponse = Readable;

import { OfferCreateFlagsInterface } from 'xrpl';
import { Memo } from 'xrpl/dist/npm/models/common';
import { Order } from '../ccxt';

/**
 * Request parameters for a createLimitSellOrder call
 *
 * @category Parameters
 */
export interface CreateLimitSellOrderParams {
  /** Time after which the Offer is no longer active, in seconds since the Ripple Epoch. (1/1/2000) */
  expiration?: number;
  /** Additional arbitrary information used to identify this transaction */
  memos?: Memo[];
  /** Order behavior (via XRPL OfferCreateFlags) */
  flags?: OfferCreateFlagsInterface;
}

/**
 * Expected response from a createLimitSellOrder call
 *
 * @category Responses
 */
export type CreateLimitSellOrderResponse = Order | undefined;

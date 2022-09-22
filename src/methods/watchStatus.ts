import { BadRequest } from 'ccxt';
import _ from 'lodash';
import { Readable } from 'stream';
import { WatchBalanceParams, SDKContext } from '../models';

/**
 * Streams information regarding {@link ExchangeStatus} from either the info
 * hardcoded in the exchange instance or the API, if available. Returns an
 * {@link WatchStatusResponse}.
 *
 * @category Methods
 */
async function watchStatus(
  this: SDKContext,
  /** Parameters specific to the exchange API endpoint */
  params: WatchBalanceParams
): Promise<Readable> {
  if (!params.account) throw new BadRequest('Must include account address in params');

  const statusStream = new Readable({ read: () => this });

  return statusStream;
}

export default watchStatus;

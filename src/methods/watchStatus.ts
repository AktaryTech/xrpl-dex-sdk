import _ from 'lodash';
import { Readable } from 'stream';
import { LedgerStream, SubscribeRequest } from 'xrpl';
import { SDKContext } from '../models';
import { WatchStatusResponse } from '../models';

/**
 * Streams information regarding {@link ExchangeStatus} from either the info
 * hardcoded in the exchange instance or the API, if available. Returns a
 * {@link WatchStatusResponse} object.
 *
 * @category Methods
 */
async function watchStatus(this: SDKContext): Promise<WatchStatusResponse> {
  const statusStream = new Readable({ read: () => this });

  await this.client.request({
    command: 'subscribe',
    streams: ['ledger'],
  } as SubscribeRequest);

  this.client.on('ledgerClosed', async (ledger: LedgerStream) => {
    const newStatus = await this.fetchStatus();
    if (newStatus) statusStream.emit('update', newStatus);
  });

  return statusStream;
}

export default watchStatus;

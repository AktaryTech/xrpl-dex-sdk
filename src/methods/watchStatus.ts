import _ from 'lodash';
import { Readable } from 'stream';
import { LedgerStream, SubscribeRequest } from 'xrpl';
import { SDKContext } from '../models';

/**
 * Streams information regarding {@link ExchangeStatus} from either the info
 * hardcoded in the exchange instance or the API, if available. Returns a
 * {@link Readable} stream.
 *
 * @category Methods
 */
async function watchStatus(this: SDKContext): Promise<Readable> {
  const statusStream = new Readable({ read: () => this });

  let isProcessing = false;

  await this.client.request({
    command: 'subscribe',
    streams: ['ledger'],
  } as SubscribeRequest);

  this.client.on('ledgerClosed', async (ledger: LedgerStream) => {
    if (isProcessing) return;
    isProcessing = true;
    const newStatus = await this.fetchStatus();
    if (newStatus) statusStream.push(JSON.stringify(newStatus));
    isProcessing = false;
  });

  return statusStream;
}

export default watchStatus;

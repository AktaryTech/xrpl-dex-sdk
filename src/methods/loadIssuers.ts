import _ from 'lodash';
import { LoadIssuersResponse, SDKContext } from '../models';

/**
 * Retrieves and caches a list of issuers whose currencies are being traded on the dEX.
 * Returns a {@link LoadIssuersResponse}.
 *
 * @category Methods
 *
 * @param reload (Optional) Whether to refresh the cache
 */
async function loadIssuers(this: SDKContext, reload = false): Promise<LoadIssuersResponse> {
  if (!this.issuers || reload) {
    const issuers = await this.fetchIssuers();
    this.issuers = issuers;
  }
  return this.issuers;
}

export default loadIssuers;

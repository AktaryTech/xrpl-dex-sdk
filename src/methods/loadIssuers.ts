import _ from 'lodash';
import { LoadIssuersResponse, SDKContext } from '../models';

/**
 * Retrieves and caches a list of {@link Issuers} whose {@link Currencies} are being traded on the dEX.
 *
 * @category Methods
 *
 * @param reload (Optional) Whether to refresh the cache
 * @returns A Promise that returns a {@link LoadIssuersResponse} object
 */
async function loadIssuers(this: SDKContext, reload = false): Promise<LoadIssuersResponse> {
  if (!this.issuers || reload) {
    const issuers = await this.fetchIssuers();
    this.issuers = issuers;
  }
  return this.issuers;
}

export default loadIssuers;

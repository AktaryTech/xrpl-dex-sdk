import _ from 'lodash';
import { AccountInfoRequest, transferRateToDecimal } from 'xrpl';
import { FetchTransferRateResponse, IssuerAddress, SDKContext } from '../models';
import { BN } from '../utils';

/**
 * Retrieves an Issuer's transfer rate (if any)
 * a {@link FetchTransferRateResponse}.
 *
 * @category Methods
 */
async function fetchTransferRate(this: SDKContext, issuer: IssuerAddress): Promise<FetchTransferRateResponse> {
  if (this.transferRates && this.transferRates[issuer]) return this.transferRates[issuer];
  const accountInfoResponse = await this.client.request({
    command: 'account_info',
    account: issuer,
  } as AccountInfoRequest);
  if (accountInfoResponse.result.account_data.TransferRate) {
    const transferRate = BN(transferRateToDecimal(accountInfoResponse.result.account_data.TransferRate));
    if (!this.transferRates) this.transferRates = {};
    this.transferRates[issuer] = transferRate;
    return transferRate;
  }
  return BN('0');
}

export default fetchTransferRate;

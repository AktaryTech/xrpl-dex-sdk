import { SDKContext, CurrencyCode, FetchTransactionFeesResponse } from '../models';

/**
 * Returns information about fees incurred for performing transactions with a
 * list of currencies. Returns a {@link FetchTransactionFeesResponse}.
 *
 * @category Methods
 *
 * @param codes Array of currency codes to get fees for
 * @returns A FetchTransactionFeesResponse object
 */
async function fetchTransactionFees(this: SDKContext, codes: CurrencyCode[]): Promise<FetchTransactionFeesResponse> {
  const response: FetchTransactionFeesResponse = [];

  for (let c = 0, cl = codes.length; c < cl; c += 1) {
    const fees = await this.fetchTransactionFee(codes[c]);
    if (!fees) continue;
    response.push(fees);
  }

  return response;
}

export default fetchTransactionFees;

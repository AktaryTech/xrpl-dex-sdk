import { FeeRequest } from 'xrpl';
import { SDKContext, CurrencyCode, FetchTransactionFeeResponse, ArgumentsRequired } from '../models';

/**
 * Returns information about fees incurred for performing transactions with a given
 * currency. Returns a {@link FetchTransactionFeeResponse}.
 *
 * @category Methods
 */
async function fetchTransactionFee(
  this: SDKContext,
  /** Currency code to get fees for */
  code: CurrencyCode
): Promise<FetchTransactionFeeResponse> {
  if (!code) throw new ArgumentsRequired('Missing required arguments for fetchTransactionFee call');

  const { result: feesResult } = await this.client.request({ command: 'fee' } as FeeRequest);

  const currencies = await this.fetchCurrencies();

  const currency = currencies[code];

  if (!currency) return;

  const response: FetchTransactionFeeResponse = {
    code,
    current: feesResult.drops.open_ledger_fee,
    transfer: currency.fee || '0',
    info: { feesResult, currency },
  };

  return response;
}

export default fetchTransactionFee;

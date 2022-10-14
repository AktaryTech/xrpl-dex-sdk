import { TransactionFee } from '../ccxt';

/**
 * Expected response from a fetchTransactionFee call
 *
 * @category Responses
 */
export type FetchTransactionFeeResponse = TransactionFee | undefined;

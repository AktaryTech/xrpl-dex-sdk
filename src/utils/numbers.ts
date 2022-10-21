import BigNumber from 'bignumber.js';
import { Amount } from 'xrpl/dist/npm/models/common';
// import { parseAmountValue } from 'xrpl/dist/npm/models/transactions/common';
import { BigNumberish } from '../models';

export const BN = (amount: BigNumberish) => new BigNumber(amount);

export const parseAmountValue = (amount: Amount): BigNumber => BN(typeof amount === 'string' ? amount : amount.value);

export const parseCurrencyAmount = (amount: Amount, subtractor?: Amount): BigNumber => {
  const amountValue = typeof amount === 'object' ? BN(amount.value) : BN(amount);
  if (!subtractor) {
    return amountValue;
  } else {
    const subtractorValue = typeof subtractor === 'object' ? BN(subtractor.value) : BN(subtractor);
    return amountValue.minus(subtractorValue);
  }
};

export const subtractAmounts = (amount: Amount, subtractor: Amount): Amount => {
  const amountValue = BN(parseAmountValue(amount));
  const subtractorValue = BN(parseAmountValue(subtractor));
  const resultValue = amountValue.minus(subtractorValue);

  return typeof amount === 'string'
    ? resultValue.toString()
    : {
        ...amount,
        value: resultValue.toString(),
      };
};

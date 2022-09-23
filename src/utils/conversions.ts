import { OfferCreate, OfferCreateFlags, setTransactionFlagsToNumber } from 'xrpl';
import { Amount } from 'xrpl/dist/npm/models/common';
import { TakerAmount } from 'xrpl/dist/npm/models/methods/bookOffers';
import { AccountAddress, BigNumberish, CurrencyCode, IssuerAddress, MarketSymbol, OrderTimeInForce } from '../models';

/**
 * Market Symbols
 */
export const parseMarketSymbol = (symbol: MarketSymbol): [base: CurrencyCode, quote: CurrencyCode] => {
  const [base, quote] = symbol.split('/');
  return [base, quote];
};

export const getMarketSymbol = (base: Amount, quote: Amount): MarketSymbol => {
  const symbol: CurrencyCode[] = [];

  symbol.push(typeof base === 'string' ? 'XRP' : `${base.currency}+${base.issuer}`);
  symbol.push(typeof quote === 'string' ? 'XRP' : `${quote.currency}+${quote.issuer}`);

  return symbol.join('/') as MarketSymbol;
};

/**
 * Currencies
 */
export const parseCurrencyCode = (currencyCode: CurrencyCode): { currency: string; issuer?: IssuerAddress } => {
  const [currency, issuer] = currencyCode.split('+');
  if (issuer) {
    return { currency, issuer };
  } else {
    return { currency };
  }
};

export const getAmountIssuer = (amount: Amount): AccountAddress | undefined =>
  typeof amount === 'object' ? amount.issuer : undefined;

export const getAmountCurrencyCode = (amount: Amount): CurrencyCode =>
  typeof amount === 'object' ? amount.currency : 'XRP';

export const getAmount = (code: CurrencyCode, value: BigNumberish): Amount => {
  const { currency, issuer } = parseCurrencyCode(code);
  return issuer ? { currency, issuer, value: value.toString() } : value.toString();
};

export const getTakerAmount = (code: CurrencyCode): TakerAmount => {
  const { currency, issuer } = parseCurrencyCode(code);
  return issuer ? { currency, issuer } : { currency };
};

/**
 * Offers
 */
export const offerCreateFlagsToTimeInForce = (tx: OfferCreate): OrderTimeInForce | undefined => {
  setTransactionFlagsToNumber(tx);
  const flags = tx.Flags as number;
  if (flags === 0 && !tx.Expiration) {
    return 'GTC';
  } else if ((flags & OfferCreateFlags.tfFillOrKill) === OfferCreateFlags.tfFillOrKill) {
    return 'FOK';
  } else if ((flags & OfferCreateFlags.tfImmediateOrCancel) === OfferCreateFlags.tfImmediateOrCancel) {
    return 'IOC';
  } else if ((flags & OfferCreateFlags.tfPassive) === OfferCreateFlags.tfPassive) {
    return 'PO';
  }
};

export const stringToInt = (input?: string): number | undefined => {
  try {
    return input ? parseInt(input) : 0;
  } catch (err) {
    return;
  }
};

export const stringToFloat = (input?: string): number | undefined => {
  try {
    return input ? parseFloat(input) : 0;
  } catch (err) {
    return;
  }
};

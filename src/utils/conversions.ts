import { xrpToDrops } from 'xrpl';
import { Amount } from 'xrpl/dist/npm/models/common';
import { TakerAmount } from 'xrpl/dist/npm/models/methods/bookOffers';
import { AccountAddress, BigNumberish, CurrencyCode, IssuerAddress, MarketSymbol, BadSymbol } from '../models';
import { getBaseAmountKey, getOrderSideFromFlags, getQuoteAmountKey } from './orders';

/**
 * Given a MarketSymbol string, returns its Base and Quote currencies.
 * @param symbol MarketSymbol to parse
 * @returns
 */
export const parseMarketSymbol = (symbol: MarketSymbol): [base: CurrencyCode, quote: CurrencyCode] => {
  const [base, quote] = symbol.split('/');
  return [base, quote];
};

/**
 * Gets a MarketSymbol from an Offer or Transaction.
 * @param source The Offer or Transaction object to parse
 * @returns
 */
export const getMarketSymbol = (source: Record<string, any>) => {
  const side = getOrderSideFromFlags(source.Flags);
  return getMarketSymbolFromAmount(source[getBaseAmountKey(side)], source[getQuoteAmountKey(side)]);
};

/**
 * Gets a MarketSymbol from Base and Quote XRPL Amounts.
 * @param base Base currency as Amount object
 * @param quote Quote currency as Amount object
 * @returns
 */
export const getMarketSymbolFromAmount = (base: Amount, quote: Amount): MarketSymbol => {
  const symbol: CurrencyCode[] = [];

  symbol.push(typeof base === 'string' ? 'XRP' : `${base.currency}+${base.issuer}`);
  symbol.push(typeof quote === 'string' ? 'XRP' : `${quote.currency}+${quote.issuer}`);

  return symbol.join('/') as MarketSymbol;
};

/**
 * Validates a MarketSymbol string. Throws an error if invalid, otherwise returns nothing.
 * @param symbol MarketSymbol to evaluate
 */
export const validateMarketSymbol = (symbol: MarketSymbol) => {
  if (!symbol.includes('/'))
    throw new BadSymbol(
      `Invalid market symbol: "${symbol}". Market symbols must be in the form [BaseCurrency]/[QuoteCurrency]`
    );
  const [base, quote] = symbol.split('/');
  const [baseCurrency, baseIssuer] = base.split('+');
  const [quoteCurrency, quoteIssuer] = quote.split('+');
  if (baseCurrency !== 'XRP' && !baseIssuer) {
    throw new BadSymbol(
      `Invalid currency code: "${base}". Non-XRP codes must be in the form [CurrencyCode]+[IssuerAddress]`
    );
  }
  if (quoteCurrency !== 'XRP' && !quoteIssuer) {
    throw new BadSymbol(
      `Invalid currency code: "${quote}". Non-XRP codes must be in the form [CurrencyCode]+[IssuerAddress]`
    );
  }
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

export const getCurrencyCode = (code: string, issuer?: IssuerAddress): CurrencyCode =>
  code === 'XRP' ? code : `${code}+${issuer}`;

export const getAmountIssuer = (amount: Amount): AccountAddress | undefined =>
  typeof amount === 'object' ? amount.issuer : undefined;

export const getAmountCurrencyCode = (amount: Amount): CurrencyCode =>
  typeof amount === 'object' ? amount.currency : 'XRP';

export const getAmount = (code: CurrencyCode, value: BigNumberish): Amount => {
  const { currency, issuer } = parseCurrencyCode(code);
  return issuer ? { currency, issuer, value: value.toString() } : xrpToDrops(value);
};

export const getTakerAmount = (code: CurrencyCode): TakerAmount => {
  const { currency, issuer } = parseCurrencyCode(code);
  return issuer ? { currency, issuer } : { currency };
};

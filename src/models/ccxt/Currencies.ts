import { CurrencyCode, PercentDecimal } from '../common';

export interface Currency {
  code: CurrencyCode;
  fee?: PercentDecimal;
  name?: string;
  issuerName?: string;
  logo?: string;
  precision?: number;
}

export type Currencies = Record<CurrencyCode, Currency>;

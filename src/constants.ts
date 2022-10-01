export const DEFAULT_LIMIT = process.env.XRPL_DEFAULT_LIMIT ? parseInt(process.env.XRPL_DEFAULT_LIMIT) : 20;
export const DEFAULT_SEARCH_LIMIT = process.env.XRPL_DEFAULT_SEARCH_LIMIT
  ? parseInt(process.env.XRPL_DEFAULT_SEARCH_LIMIT)
  : 100;
export const DEFAULT_TICKER_SEARCH_LIMIT = process.env.XRPL_DEFAULT_TICKER_SEARCH_LIMIT
  ? parseInt(process.env.XRPL_DEFAULT_TICKER_SEARCH_LIMIT)
  : 50;

export const CURRENCY_PRECISION = 15;

export const FEE_CURRENCY = 'XRP';
export const REFERENCE_TX_COST = '10';
export const ACCOUNT_DELETE_TX_COST = '2000000';

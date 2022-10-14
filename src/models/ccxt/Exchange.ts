export class Exchange {
  constructor(config?: { [key in keyof Exchange]?: Exchange[key] });
  // allow dynamic keys
  [key: string]: any;
  // properties
  version: string;
  apiKey: string;
  secret: string;
  password: string;
  uid: string;
  requiredCredentials: {
    apiKey: boolean;
    secret: boolean;
    uid: boolean;
    login: boolean;
    password: boolean;
    twofa: boolean;
    privateKey: boolean;
    walletAddress: boolean;
    token: boolean;
  };
  options: {
    [key: string]: any;
  };
  urls: {
    logo: string;
    api: string | Dictionary<string>;
    test: string | Dictionary<string>;
    www: string;
    doc: string[];
    api_management?: string;
    fees: string;
    referral: string;
  };
  precisionMode: number;
  hash: any;
  hmac: any;
  jwt: any;
  binaryConcat: any;
  stringToBinary: any;
  stringToBase64: any;
  base64ToBinary: any;
  base64ToString: any;
  binaryToString: any;
  utf16ToBase64: any;
  urlencode: any;
  pluck: any;
  unique: any;
  extend: any;
  deepExtend: any;
  flatten: any;
  groupBy: any;
  indexBy: any;
  sortBy: any;
  keysort: any;
  decimal: any;
  safeFloat: any;
  safeString: any;
  safeInteger: any;
  safeValue: any;
  capitalize: any;
  json: JSON['stringify'];
  sum: any;
  ordered: any;
  aggregate: any;
  truncate: any;
  name: string;
  // nodeVersion: string;
  fees: object;
  enableRateLimit: boolean;
  countries: string[];
  // set by loadMarkets
  markets: Dictionary<Market>;
  markets_by_id: Dictionary<Market>;
  currencies: Dictionary<Currency>;
  ids: string[];
  symbols: string[];
  id: string;
  proxy: string;
  parse8601: typeof Date.parse;
  milliseconds: typeof Date.now;
  rateLimit: number; // milliseconds = seconds * 1000
  timeout: number; // milliseconds
  verbose: boolean;
  twofa: boolean; // two-factor authentication
  substituteCommonCurrencyCodes: boolean;
  timeframes: Dictionary<number | string>;
  has: Dictionary<boolean | 'emulated'>; // https://github.com/ccxt/ccxt/pull/1984
  balance: object;
  orderbooks: object;
  orders: object;
  trades: object;
  userAgent: { 'User-Agent': string } | false;
  limits: { amount: MinMax; price: MinMax; cost: MinMax };
  hasCancelAllOrders: boolean;
  hasCancelOrder: boolean;
  hasCancelOrders: boolean;
  hasCORS: boolean;
  hasCreateDepositAddress: boolean;
  hasCreateLimitOrder: boolean;
  hasCreateMarketOrder: boolean;
  hasCreateOrder: boolean;
  hasDeposit: boolean;
  hasEditOrder: boolean;
  hasFetchBalance: boolean;
  hasFetchBidsAsks: boolean;
  hasFetchClosedOrders: boolean;
  hasFetchCurrencies: boolean;
  hasFetchDepositAddress: boolean;
  hasFetchDeposits: boolean;
  hasFetchFundingFees: boolean;
  hasFetchL2OrderBook: boolean;
  hasFetchLedger: boolean;
  hasFetchMarkets: boolean;
  hasFetchMyTrades: boolean;
  hasFetchOHLCV: boolean;
  hasFetchOpenOrders: boolean;
  hasFetchOrder: boolean;
  hasFetchOrderBook: boolean;
  hasFetchOrderBooks: boolean;
  hasFetchOrders: boolean;
  hasFetchStatus: boolean;
  hasFetchTicker: boolean;
  hasFetchTickers: boolean;
  hasFetchTime: boolean;
  hasFetchTrades: boolean;
  hasFetchTradingFee: boolean;
  hasFetchTradingFees: boolean;
  hasFetchTradingLimits: boolean;
  hasFetchTransactions: boolean;
  hasFetchWithdrawals: boolean;
  hasPrivateAPI: boolean;
  hasPublicAPI: boolean;
  hasWithdraw: boolean;

  // methods
  account(): Balance;
  cancelAllOrders(...args: any): Promise<any>; // TODO: add function signatures
  cancelOrder(id: string, symbol?: string, params?: Params): Promise<Order>;
  cancelOrders(...args: any): Promise<any>; // TODO: add function signatures
  checkRequiredCredentials(): void;
  commonCurrencyCode(currency: string): string;
  createDepositAddress(currency: string, params?: Params): Promise<DepositAddressResponse>;
  createLimitOrder(symbol: string, side: Order['side'], amount: number, price: number, params?: Params): Promise<Order>;
  createLimitBuyOrder(symbol: string, amount: number, price: number, params?: Params): Promise<Order>;
  createLimitSellOrder(symbol: string, amount: number, price: number, params?: Params): Promise<Order>;
  createMarketOrder(
    symbol: string,
    side: Order['side'],
    amount: number,
    price?: number,
    params?: Params
  ): Promise<Order>;
  createMarketBuyOrder(symbol: string, amount: number, params?: Params): Promise<Order>;
  createMarketSellOrder(symbol: string, amount: number, params?: Params): Promise<Order>;
  createOrder(
    symbol: string,
    type: Order['type'],
    side: Order['side'],
    amount: number,
    price?: number,
    params?: Params
  ): Promise<Order>;
  decode(str: string): string;
  defaults(): any;
  defineRestApi(api: any, methodName: any, options?: Dictionary<any>): void;
  deposit(...args: any): Promise<any>; // TODO: add function signatures
  describe(): any;
  editOrder(
    id: string,
    symbol: string,
    type: Order['type'],
    side: Order['side'],
    amount: number,
    price?: number,
    params?: Params
  ): Promise<Order>;
  encode(str: string): string;
  encodeURIComponent(...args: any[]): string;
  extractParams(str: string): string[];
  fetch(url: string, method?: string, headers?: any, body?: any): Promise<any>;
  fetch2(path: any, api?: string, method?: string, params?: Params, headers?: any, body?: any): Promise<any>;
  fetchBalance(params?: Params): Promise<Balances>;
  fetchBidsAsks(symbols?: string[], params?: Params): Promise<any>;
  fetchClosedOrders(symbol?: string, since?: number, limit?: number, params?: Params): Promise<Order[]>;
  fetchCurrencies(params?: Params): Promise<Dictionary<Currency>>;
  fetchDepositAddress(currency: string, params?: Params): Promise<DepositAddressResponse>;
  fetchDeposits(currency?: string, since?: number, limit?: number, params?: Params): Promise<Transaction[]>;
  fetchFreeBalance(params?: Params): Promise<PartialBalances>;
  fetchFundingFees(...args: any): Promise<any>; // TODO: add function signatures
  fetchL2OrderBook(...args: any): Promise<any>; // TODO: add function signatures
  fetchLedger(...args: any): Promise<any>; // TODO: add function signatures
  fetchMarkets(): Promise<Market[]>;
  fetchMyTrades(symbol?: string, since?: any, limit?: any, params?: Params): Promise<Trade[]>;
  fetchOHLCV(symbol: string, timeframe?: string, since?: number, limit?: number, params?: Params): Promise<OHLCV[]>;
  fetchOpenOrders(symbol?: string, since?: number, limit?: number, params?: Params): Promise<Order[]>;
  fetchOrder(id: string, symbol: string, params?: Params): Promise<Order>;
  fetchOrderBook(symbol: string, limit?: number, params?: Params): Promise<OrderBook>;
  fetchOrderBooks(...args: any): Promise<any>; // TODO: add function signatures
  fetchOrders(symbol?: string, since?: number, limit?: number, params?: Params): Promise<Order[]>;
  fetchOrderStatus(id: string, market: string): Promise<string>;
  fetchPosition(symbol: string, params?: Params): Promise<any>; // TODO: add function signatures
  fetchPositions(symbols?: string[], params?: Params): Promise<any>; // TODO: add function signatures
  fetchPositionsRisk(symbols?: string[], params?: Params): Promise<any>; // TODO: add function signatures
  fetchStatus(...args: any): Promise<any>; // TODO: add function signatures
  fetchTicker(symbol: string, params?: Params): Promise<Ticker>;
  fetchTickers(symbols?: string[], params?: Params): Promise<Dictionary<Ticker>>;
  fetchTime(params?: Params): Promise<number>;
  fetchTotalBalance(params?: Params): Promise<PartialBalances>;
  fetchTrades(symbol: string, since?: number, limit?: number, params?: Params): Promise<Trade[]>;
  fetchTradingFee(...args: any): Promise<any>; // TODO: add function signatures
  fetchTradingFees(...args: any): Promise<any>; // TODO: add function signatures
  fetchTradingLimits(...args: any): Promise<any>; // TODO: add function signatures
  fetchTransactions(currency?: string, since?: number, limit?: number, params?: Params): Promise<Transaction[]>;
  fetchUsedBalance(params?: Params): Promise<PartialBalances>;
  fetchWithdrawals(currency?: string, since?: number, limit?: number, params?: Params): Promise<Transaction[]>;
  getMarket(symbol: string): Market;
  initRestRateLimiter(): void;
  iso8601(timestamp: number | string): string;
  loadMarkets(reload?: boolean): Promise<Dictionary<Market>>;
  market(symbol: string): Market;
  marketId(symbol: string): string;
  marketIds(symbols: string[]): string[];
  microseconds(): number;
  nonce(): number;
  parseTimeframe(timeframe: string): number;
  purgeCachedOrders(timestamp: number): void;
  request(path: string, api?: string, method?: string, params?: Params, headers?: any, body?: any): Promise<any>;
  seconds(): number;
  setMarkets(markets: Market[], currencies?: Currency[]): Dictionary<Market>;
  symbol(symbol: string): string;
  withdraw(
    currency: string,
    amount: number,
    address: string,
    tag?: string,
    params?: Params
  ): Promise<WithdrawalResponse>;
  YmdHMS(timestamp: string, infix: string): string;
}

import _ from 'lodash';
import {
  MarketSymbol,
  FetchTickersParams,
  Ticker,
  FetchTickersResponse,
  SDKContext,
  ArgumentsRequired,
} from '../models';
import { validateMarketSymbol } from '../utils';

/**
 * Retrieves price ticker data for multiple market pairs. Returns a {@link FetchTickersResponse}.
 *
 * @category Methods
 *
 * @param symbols Array of market symbol to get price ticker data for
 * @param params (Optional) Additional request parameters
 * @returns A FetchTickersResponse object
 */
async function fetchTickers(
  this: SDKContext,
  symbols: MarketSymbol[],
  params: FetchTickersParams = {}
): Promise<FetchTickersResponse> {
  if (!symbols) throw new ArgumentsRequired('Missing required arguments for fetchTickers call');
  const tickers: Ticker[] = [];

  for (const symbol of symbols) {
    validateMarketSymbol(symbol);
    const ticker = await this.fetchTicker(symbol, params);
    if (ticker) tickers.push(ticker);
  }

  return tickers;
}

export default fetchTickers;

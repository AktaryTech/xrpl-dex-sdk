import { SDKContext, FetchTradingFeeResponse, MarketSymbol, ArgumentsRequired } from '../models';
import { validateMarketSymbol } from '../utils';

/**
 * Returns information about the fees incurred while trading on given market.
 * Returns a {@link FetchTradingFeeResponse}.
 *
 * @category Methods
 *
 * @param symbol (Optional) Market symbol to get trading fees for
 * @returns A FetchTradingFeeResponse object
 *
 */
async function fetchTradingFee(
  this: SDKContext,
  /** Unified Market Symbol to look up */
  symbol: MarketSymbol
): Promise<FetchTradingFeeResponse> {
  if (!symbol) throw new ArgumentsRequired('Missing required arguments for fetchTradingFee call');
  validateMarketSymbol(symbol);

  const market = await this.fetchMarket(symbol);

  // TODO: put proper error handling here
  if (!market) return;

  const { baseFee, quoteFee } = market;

  return {
    symbol,
    base: baseFee || '0',
    quote: quoteFee || '0',
    percentage: true,
    info: { market },
  };
}

export default fetchTradingFee;

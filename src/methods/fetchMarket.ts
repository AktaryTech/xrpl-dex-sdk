import _ from 'lodash';
import { markets } from '../data';
import { FetchMarketResponse, MarketSymbol, SDKContext, XrplNetwork } from '../models';
import { validateMarketSymbol } from '../utils';

/**
 * Retrieves info about a single market being traded on the dEX.
 * Returns a {@link FetchMarketResponse}.
 *
 * @category Methods
 */
async function fetchMarket(this: SDKContext, symbol: MarketSymbol): Promise<FetchMarketResponse> {
  validateMarketSymbol(symbol);

  const market = markets[this.params.network || XrplNetwork.Mainnet][symbol];

  if (!market) return;

  const response = market;

  if (market.base !== 'XRP') {
    const baseIssuer = market.base.split('+')[1];
    const baseRate = await this.fetchTransferRate(baseIssuer);
    if (!baseRate.isZero()) response.baseFee = baseRate.toString();
  }

  if (market.quote !== 'XRP') {
    const quoteIssuer = market.quote.split('+')[1];
    const quoteRate = await this.fetchTransferRate(quoteIssuer);
    if (!quoteRate.isZero()) response.quoteFee = quoteRate.toString();
  }

  return response;
}

export default fetchMarket;

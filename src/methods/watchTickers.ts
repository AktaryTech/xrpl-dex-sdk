import _ from 'lodash';
import { Readable } from 'stream';
import { SubscribeRequest } from 'xrpl';
import { MarketSymbol, WatchTickersParams, SDKContext } from '../models';

/**
 * Retrieves order book data for a single market pair. Returns an
 * {@link WatchTickerResponse}.
 *
 * @category Methods
 */
async function watchTickers(
  this: SDKContext,
  /** Array of token pairs (called Unified Market Symbols in CCXT) */
  symbols: MarketSymbol[],
  /** Parameters specific to the exchange API endpoint */
  params: WatchTickersParams
): Promise<Readable> {
  const tickersStream = new Readable({ read: () => this });

  await this.client.request({
    command: 'subscribe',
    streams: ['transactions'],
  } as SubscribeRequest);

  for (const symbol of symbols) {
    const stream = await this.watchTicker(symbol, params);
    stream.on('data', (data) => tickersStream.push(data));
  }

  return tickersStream;
}

export default watchTickers;

import _ from 'lodash';
import { Readable } from 'stream';
import { SubscribeRequest, TransactionStream } from 'xrpl';
import { MarketSymbol, WatchTickerParams, SDKContext, Ticker, TickerStream } from '../models';

/**
 * Retrieves order book data for a single market pair. Returns an
 * {@link WatchTickerResponse}.
 *
 * @category Methods
 */
async function watchTicker(
  this: SDKContext,
  /** Token pair (called Unified Market Symbol in CCXT) */
  symbol: MarketSymbol,
  /** Parameters specific to the exchange API endpoint */
  params: WatchTickerParams
): Promise<TickerStream> {
  const tickerStream = new Readable({ read: () => this });

  let isProcessing = false;
  let ticker: Ticker | undefined;

  await this.client.request({
    command: 'subscribe',
    streams: ['transactions'],
  } as SubscribeRequest);

  this.client.on('transaction', async (tx: TransactionStream) => {
    if (isProcessing) return;

    if (!tx.validated || tx.transaction.TransactionType !== 'OfferCreate') return;

    isProcessing = true;

    const newTicker = await this.fetchTicker(symbol, params);

    const omittedFields = ['datetime', 'timestamp', 'info'];

    if (ticker && newTicker) {
      const diffs = _.difference(
        Object.values(_.omit(ticker, omittedFields)),
        Object.values(_.omit(newTicker, omittedFields))
      );
      if (!diffs.length) {
        isProcessing = false;
        return;
      }
    }

    ticker = newTicker;

    // TODO: calculate this transaction's impact on the ticker and add it to the existing value

    tickerStream.push(JSON.stringify(ticker));

    isProcessing = false;
  });

  return tickerStream;
}

export default watchTicker;

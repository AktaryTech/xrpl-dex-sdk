import _ from 'lodash';
import { Readable } from 'stream';
import { SubscribeRequest, TransactionStream } from 'xrpl';
import { Offer } from 'xrpl/dist/npm/models/ledger';
import { MarketSymbol, SDKContext, AffectedNode, TradeStream } from '../models';
import { getMarketSymbol, getTradeFromData, validateMarketSymbol } from '../utils';

/**
 * Listens for new Trades from the SDK user for a given market symbol. Returns a
 * {@link WatchMyTradesResponse}.
 *
 * @category Methods
 */
async function watchMyTrades(
  this: SDKContext,
  /** Filter Trades by market symbol */
  symbol: MarketSymbol
): Promise<TradeStream> {
  validateMarketSymbol(symbol);

  const tradeStream = new Readable({ read: () => this });

  await this.client.request({
    command: 'subscribe',
    streams: ['transactions'],
    accounts: [this.wallet.classicAddress],
  } as SubscribeRequest);

  this.client.on('transaction', async (tx: TransactionStream) => {
    const transaction = tx.transaction;
    if (
      typeof transaction !== 'object' ||
      transaction.TransactionType !== 'OfferCreate' ||
      typeof tx.meta !== 'object' ||
      !transaction.Sequence ||
      transaction.Account !== this.wallet.classicAddress
    )
      return;

    if (getMarketSymbol(transaction) !== symbol) return;

    for (const affectedNode of tx.meta.AffectedNodes) {
      const { LedgerEntryType, FinalFields } = Object.values(affectedNode)[0] as AffectedNode;

      if (LedgerEntryType !== 'Offer' || !FinalFields) continue;

      const offer = FinalFields as unknown as Offer;

      const trade = await getTradeFromData.call(
        this,
        {
          date: transaction.date || 0,
          Flags: transaction.Flags as number,
          OrderAccount: offer.Account,
          OrderSequence: offer.Sequence,
          Account: transaction.Account,
          Sequence: transaction.Sequence,
          TakerPays: offer.TakerPays,
          TakerGets: offer.TakerGets,
        },
        { transaction }
      );

      if (trade) tradeStream.emit('update', trade);
    }
  });

  return tradeStream;
}

export default watchMyTrades;

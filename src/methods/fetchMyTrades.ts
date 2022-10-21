import _ from 'lodash';
import { rippleTimeToUnixTime } from 'xrpl';
import { Offer } from 'xrpl/dist/npm/models/ledger';
import { DEFAULT_LIMIT, DEFAULT_SEARCH_LIMIT } from '../constants';
import {
  FetchMyTradesParams,
  FetchMyTradesResponse,
  MarketSymbol,
  UnixTimestamp,
  SDKContext,
  Trade,
  AffectedNode,
  ArgumentsRequired,
} from '../models';
import { fetchAccountTxns, getMarketSymbol, getTradeFromData, validateMarketSymbol } from '../utils';

/**
 * Fetch Trades for a given market symbol. Returns a {@link FetchMyTradesResponse}.
 *
 * @category Methods
 */
async function fetchMyTrades(
  this: SDKContext,
  /** Filter Trades by market symbol */
  symbol: MarketSymbol,
  /** Only return Trades since this date */
  since?: UnixTimestamp,
  /** Total number of Trades to return */
  limit: number = DEFAULT_LIMIT,
  /** eslint-disable-next-line */
  params: FetchMyTradesParams = {
    searchLimit: DEFAULT_SEARCH_LIMIT,
  }
): Promise<FetchMyTradesResponse> {
  if (!symbol) throw new ArgumentsRequired('Missing required arguments for fetchMyTrades call');
  validateMarketSymbol(symbol);

  const trades: Trade[] = [];

  let txCount = 0;
  const requestLimit = DEFAULT_LIMIT;
  let marker: unknown;
  let hasNextPage = trades.length <= limit;

  while (hasNextPage) {
    const accountTxResponse = await fetchAccountTxns(this.client, this.wallet.classicAddress, requestLimit, marker);
    if (!accountTxResponse) break;

    // console.log('[fetchMyTrades] accountTxResponse \n%s\n', JSON.stringify(accountTxResponse));

    marker = accountTxResponse.result.marker;

    const transactions = accountTxResponse.result.transactions;

    // console.log('[fetchMyTrades] transactions \n%s\n', JSON.stringify(transactions));

    if (!transactions) continue;

    for (const transaction of transactions) {
      txCount += 1;
      if (trades.length >= limit || txCount >= params.searchLimit) break;

      if (
        !transaction.tx?.Sequence ||
        typeof transaction.meta !== 'object' ||
        transaction.tx.TransactionType !== 'OfferCreate' ||
        !transaction.tx.date ||
        getMarketSymbol(transaction.tx) !== symbol
      )
        continue;

      // if (getMarketSymbol(transaction.tx) !== symbol) continue;

      /** Filter by date if `since` is defined */
      if (since && rippleTimeToUnixTime(transaction.tx.date) < since) {
        continue;
      }

      for (const affectedNode of transaction.meta.AffectedNodes) {
        const { LedgerEntryType, FinalFields } = Object.values(affectedNode)[0] as AffectedNode;

        if (LedgerEntryType !== 'Offer' || !FinalFields) continue;

        const offer = FinalFields as unknown as Offer;

        const trade = await getTradeFromData.call(
          this,
          {
            date: transaction.tx.date,
            Flags: offer.Flags as number,
            OrderAccount: offer.Account,
            OrderSequence: offer.Sequence,
            Account: transaction.tx.Account,
            Sequence: transaction.tx.Sequence,
            TakerPays: offer.TakerPays,
            TakerGets: offer.TakerGets,
          },
          { transaction }
        );

        if (trade) {
          trades.push(trade);
        }
      }
    }

    hasNextPage = trades.length < limit && txCount < params.searchLimit;
  }

  // Sort oldest-to-newest
  if (trades.length) trades.sort((a, b) => a.timestamp - b.timestamp);

  return trades;
}

export default fetchMyTrades;

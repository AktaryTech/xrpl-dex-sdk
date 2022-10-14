import _ from 'lodash';
import { LedgerRequest, rippleTimeToUnixTime } from 'xrpl';
import { Offer } from 'xrpl/dist/npm/models/ledger';
import { DEFAULT_LIMIT, DEFAULT_SEARCH_LIMIT } from '../constants';
import {
  FetchTradesParams,
  FetchTradesResponse,
  MarketSymbol,
  UnixTimestamp,
  SDKContext,
  Trade,
  AffectedNode,
  ArgumentsRequired,
} from '../models';
import { getMarketSymbol, getTradeFromData, validateMarketSymbol } from '../utils';

/**
 * Fetch Trades for a given market symbol. Returns a {@link FetchTradesResponse}.
 *
 * @category Methods
 */
async function fetchTrades(
  this: SDKContext,
  /** Filter Trades by market symbol */
  symbol: MarketSymbol,
  /** Only return Trades since this date */
  since?: UnixTimestamp,
  /** Total number of Trades to return */
  limit: number = DEFAULT_LIMIT,
  /** eslint-disable-next-line */
  params: FetchTradesParams = {
    searchLimit: DEFAULT_SEARCH_LIMIT,
  }
): Promise<FetchTradesResponse> {
  if (!symbol) throw new ArgumentsRequired('Missing required arguments for fetchTrades call');
  validateMarketSymbol(symbol);

  const trades: Trade[] = [];

  let txCount = 0;
  let hasNextPage = trades.length <= limit;
  let previousLedgerHash: string | undefined;

  while (hasNextPage) {
    const ledgerRequest: LedgerRequest = {
      command: 'ledger',
      transactions: true,
      expand: true,
    };
    if (previousLedgerHash) ledgerRequest.ledger_hash = previousLedgerHash;
    else ledgerRequest.ledger_index = 'validated';

    const ledgerResponse = await this.client.request(ledgerRequest);

    /** Filter by date if `since` is defined */
    if (since && rippleTimeToUnixTime(ledgerResponse.result.ledger.close_time) < since) {
      hasNextPage = false;
      continue;
    }

    previousLedgerHash = ledgerResponse.result.ledger.parent_hash;

    const transactions = ledgerResponse.result.ledger.transactions;

    if (!transactions) continue;

    for (const transaction of transactions) {
      if (typeof transaction !== 'object' || !transaction.Sequence || !transaction.metaData) continue;

      if (transaction.TransactionType === 'OfferCreate') {
        if (getMarketSymbol(transaction) !== symbol) continue;

        for (const affectedNode of transaction.metaData.AffectedNodes) {
          const { LedgerEntryType, FinalFields } = Object.values(affectedNode)[0] as AffectedNode;

          if (LedgerEntryType !== 'Offer' || !FinalFields) continue;

          const offer = FinalFields as unknown as Offer;

          const trade = await getTradeFromData.call(
            this,
            {
              date: ledgerResponse.result.ledger.close_time,
              Flags: offer.Flags as number,
              OrderAccount: offer.Account,
              OrderSequence: offer.Sequence,
              Account: transaction.Account,
              Sequence: transaction.Sequence,
              TakerPays: offer.TakerPays,
              TakerGets: offer.TakerGets,
            },
            { transaction }
          );

          if (trade) {
            trades.push(trade);
            if (trades.length >= limit) break;
          }
        }
      }
      txCount += 1;
      if (txCount >= params.searchLimit) break;
    }

    hasNextPage = trades.length < limit && txCount < params.searchLimit;
  }

  // Sort oldest-to-newest
  if (trades.length) trades.sort((a, b) => a.timestamp - b.timestamp);

  return trades;
}

export default fetchTrades;

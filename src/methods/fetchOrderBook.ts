import _ from 'lodash';
import { BookOffersRequest, dropsToXrp } from 'xrpl';
import { parseAmountValue } from 'xrpl/dist/npm/models/transactions/common';
import { DEFAULT_SEARCH_LIMIT } from '../constants';
import {
  OrderBookAsk,
  MarketSymbol,
  FetchOrderBookParams,
  FetchOrderBookResponse,
  SDKContext,
  OrderBookBid,
  OrderBook,
} from '../models';
import { getBaseAmountKey, getOrderSideFromOffer, getTakerAmount, parseMarketSymbol } from '../utils';

/**
 * Retrieves order book data for a single market pair. Returns an
 * {@link FetchOrderBookResponse}.
 *
 * @category Methods
 */
async function fetchOrderBook(
  this: SDKContext,
  /** Token pair (called Unified Market Symbol in CCXT) */
  symbol: MarketSymbol,
  /** Number of results to return */
  limit: number = DEFAULT_SEARCH_LIMIT,
  /** Parameters specific to the exchange API endpoint */
  params: FetchOrderBookParams = {}
): Promise<FetchOrderBookResponse> {
  const [baseCurrency, quoteCurrency] = parseMarketSymbol(symbol);

  const baseAmount = getTakerAmount(baseCurrency);
  const quoteAmount = getTakerAmount(quoteCurrency);

  const orderBookRequest: BookOffersRequest = {
    id: symbol,
    command: 'book_offers',
    taker_pays: baseAmount,
    taker_gets: quoteAmount,
    limit,
    both: true,
  };

  if (params.ledgerHash) orderBookRequest.ledger_hash = params.ledgerHash;
  if (params.ledgerIndex) orderBookRequest.ledger_index = params.ledgerIndex;

  const orderBookResponse = await this.client.request(orderBookRequest);
  const offers = orderBookResponse.result.offers;

  const bids: OrderBookBid[] = [];
  const asks: OrderBookAsk[] = [];

  for (const offer of offers) {
    if (!offer.quality) return;
    const side = getOrderSideFromOffer(offer);
    const baseAmount = offer[getBaseAmountKey(side)];
    const baseValue =
      baseCurrency === 'XRP' ? dropsToXrp(parseAmountValue(baseAmount)) : parseAmountValue(baseAmount).toString();

    const orderBookEntry = [offer.quality, baseValue];

    bids.push(side === 'buy' ? (orderBookEntry as OrderBookBid) : (orderBookEntry as OrderBookAsk));
  }
  const nonce = offers[offers.length - 1].Sequence;

  const response: OrderBook = {
    symbol,
    nonce,
    bids,
    asks,
  };

  return response;
}

export default fetchOrderBook;

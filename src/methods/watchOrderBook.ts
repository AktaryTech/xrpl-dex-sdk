import { BadRequest } from 'ccxt';
import _ from 'lodash';
import { Readable } from 'stream';
// import {
//   BookOffersRequest,
//   OfferCreate,
//   OfferCreateFlags,
//   // SubscribeRequest,
//   TransactionStream,
// } from 'xrpl';
import { DEFAULT_LIMIT } from '../constants';
import { MarketSymbol, WatchOrderBookParams, WatchOrderBookResponse, SDKContext } from '../models';
import { OrderBookStream } from '../models/ccxt/OrderBook';
// import {
//   // getAmount,
//   getBaseAmountKey,
//   getMarketSymbol,
//   getQuoteAmountKey,
//   parseMarketSymbol,
// } from '../utils';

/**
 * Retrieves order book data for a single market pair. Returns an
 * {@link WatchOrderBookResponse}.
 *
 * @category Methods
 */
async function watchOrderBook(
  this: SDKContext,
  /** Token pair (called Unified Market Symbol in CCXT) */
  symbol: MarketSymbol,
  /** Number of results to return in book */
  limit: number = DEFAULT_LIMIT,
  /** Parameters specific to the exchange API endpoint */
  params: WatchOrderBookParams
): Promise<OrderBookStream> {
  const orderStream = new Readable({ read: () => this });

  if (!params) throw new BadRequest('Must provide a params object');

  // const { issuers } = params;

  console.log(symbol as MarketSymbol);

  // const [baseCurrency, quoteCurrency] = parseMarketSymbol(symbol);

  // if ((baseCurrency !== 'XRP' && !issuers[baseCurrency]) || (quoteCurrency !== 'XRP' && !issuers[quoteCurrency]))
  //   throw new BadRequest('Must specify an issuer for non-XRP currencies');

  // const orderBookRequest: BookOffersRequest = {
  //   command: 'book_offers',
  //   taker_pays: { currency: baseCurrency },
  //   taker_gets: { currency: quoteCurrency },
  //   limit,
  //   both: true,
  // };

  // if (baseCurrency !== 'XRP') orderBookRequest.taker_pays.issuer = issuers[baseCurrency];
  // if (quoteCurrency !== 'XRP') orderBookRequest.taker_gets.issuer = issuers[quoteCurrency];

  // //   const baseIssuer = params.issuers[baseCurrency];
  // //   if (baseCurrency !== 'XRP' && !baseIssuer)
  // //     throw new BadRequest(`Must specify an issuer for currency ${baseCurrency}`);

  // //   const quoteIssuer = params.issuers[quoteCurrency];
  // //   if (quoteCurrency !== 'XRP' && !quoteIssuer)
  // //     throw new BadRequest(`Must specify an issuer for currency ${quoteCurrency}`);

  // let isProcessing = false;

  //   //   const baseAmount = getAmount(baseCurrency, 0, baseIssuer);
  //   //   const quoteAmount = getAmount(quoteCurrency, 0, quoteIssuer);

  //   await this.client.request({
  //     command: 'subscribe',
  //     books: [
  //       {
  //         taker: this.wallet.classicAddress,
  //         taker_pays: {
  //           currency: baseCurrency,
  //           issuer: baseIssuer,
  //         },
  //         taker_gets: {
  //           currency: quoteCurrency,
  //           issuer: quoteIssuer,
  //         },
  //       },
  //       //   {
  //       //     taker: this.wallet.classicAddress,
  //       //     taker_pays: quoteAmount,
  //       //     taker_gets: baseAmount,
  //       //   },
  //     ],
  //   } as SubscribeRequest);

  //   console.log({
  //     taker: this.wallet.classicAddress,
  //     taker_pays: {
  //       currency: baseCurrency,
  //       issuer: baseIssuer,
  //     },
  //     taker_gets: {
  //       currency: quoteCurrency,
  //       issuer: quoteIssuer,
  //     },
  //   });

  //   const orderBook = await this.fetchOrderBook(symbol, limit, {
  //     taker_gets_issuer: quoteIssuer,
  //     taker_pays_issuer: baseIssuer,
  //   });

  //   console.log(orderBook);

  // this.client.on('transaction', async (tx: TransactionStream) => {
  //   if (isProcessing) return;

  //   console.log(tx);

  //   if (
  //     (tx.transaction.TransactionType !== 'OfferCreate' && tx.transaction.TransactionType !== 'OfferCancel') ||
  //     !tx.meta
  //   )
  //     return;

  //   isProcessing = true;

  //   const side =
  //     typeof tx.transaction.Flags === 'number' && !(tx.transaction.Flags & OfferCreateFlags.tfSell) ? 'buy' : 'sell';

  //   const orderBookSymbol = getMarketSymbol(
  //     (tx.transaction as OfferCreate)[getBaseAmountKey(side)],
  //     (tx.transaction as OfferCreate)[getQuoteAmountKey(side)]
  //   );

  //   const orderBook = await this.fetchOrderBook(orderBookSymbol, limit, params);

  //   console.log(orderBookSymbol);
  //   console.log(orderBook);

  //   isProcessing = false;

  //   //   const [base, quote] = parseMarketSymbol(symbol);

  //   //   const { taker, taker_gets_issuer, taker_pays_issuer, ledger_hash, ledger_index } = params;

  //   //   // TODO: fetch the issuer info from the cache produced by `loadMarkets` (if present)

  //   //   const takerPays: TakerAmount = {
  //   //     currency: quote,
  //   //     issuer: taker_pays_issuer,
  //   //   };

  //   //   const takerGets: TakerAmount = {
  //   //     currency: base,
  //   //     issuer: taker_gets_issuer,
  //   //   };

  //   //   const bookOffersRequest: BookOffersRequest = {
  //   //     command: 'book_offers',
  //   //     taker_pays: takerPays,
  //   //     taker_gets: takerGets,
  //   //     limit,
  //   //     ledger_index,
  //   //     ledger_hash,
  //   //     taker,
  //   //   };

  //   //   const bookOffersResponse = await this.client.requestAll(bookOffersRequest);

  //   //   // Format XRPL response
  //   //   const orders = _.flatMap(bookOffersResponse, (offersResult) => offersResult.result.offers);

  //   //   // Create bids/asks arrays
  //   //   const bids: OrderBookBid[] = [];
  //   //   const asks: OrderBookAsk[] = [];
  //   //   _.forEach(orders, (order) => {
  //   //     if (!order.quality) return;
  //   //     // L2 Order book
  //   //     if ((order.Flags & OfferFlags.lsfSell) === 0) {
  //   //       bids.push([order.quality, parseCurrencyAmount(order.TakerGets).toString()]);
  //   //     } else {
  //   //       asks.push([order.quality, parseCurrencyAmount(order.TakerGets).toString()]);
  //   //     }
  // });

  //   const lastOffers = bookOffersResponse[bookOffersResponse.length - 1].result.offers;

  //   const nonce = lastOffers[lastOffers.length - 1].Sequence;

  //   const response: OrderBook = {
  //     symbol,
  //     nonce,
  //     bids,
  //     asks,
  //   };

  return orderStream;
  //   return response;
}

export default watchOrderBook;

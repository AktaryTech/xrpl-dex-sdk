import _ from 'lodash';
import { OfferCreate } from 'xrpl';
import { DEFAULT_SEARCH_LIMIT } from '../constants';
import {
  FetchOrderParams,
  FetchOrderResponse,
  MarketSymbol,
  OrderId,
  TransactionData,
  Order,
  Trade,
  SDKContext,
  ArgumentsRequired,
} from '../models';
import {
  BN,
  fetchTxn,
  getMostRecentTx,
  getOrderFromData,
  getTradeFromData,
  parseOrderId,
  parseTransaction,
  validateMarketSymbol,
  validateOrderId,
} from '../utils';

async function fetchOrder(
  this: SDKContext,
  /** The Order's Account and Sequence number, separated by a colon */
  id: OrderId,
  /** Symbol field is not used */
  /* eslint-disable-next-line */
  symbol?: MarketSymbol,
  params: FetchOrderParams = {
    searchLimit: DEFAULT_SEARCH_LIMIT,
  }
): Promise<FetchOrderResponse> {
  if (!id) throw new ArgumentsRequired('Missing required arguments for fetchOrder call');
  validateOrderId(id);
  if (symbol) validateMarketSymbol(symbol);

  try {
    /**
     * Set things up
     */
    const { account, sequence } = parseOrderId(id);

    const transactions: TransactionData<OfferCreate>[] = [];

    const previousTxn = await getMostRecentTx(this.client, id, params.searchLimit);
    let orderStatus = previousTxn?.orderStatus ?? 'open';
    let previousTxnId = previousTxn?.previousTxnId;
    let previousTxnData = previousTxn?.previousTxnData;
    if (previousTxnData) transactions.push(previousTxnData);

    /**
     * Build a Transaction history for this Order
     */
    while (previousTxnId) {
      const previousTxnResponse = await fetchTxn(this.client, previousTxnId);
      if (previousTxnResponse) {
        previousTxnData = parseTransaction(id, previousTxnResponse);
        if (previousTxnData) {
          transactions.push(previousTxnData);
          previousTxnId = previousTxnData.previousTxnId;
        }
      }
    }

    /**
     * Parse the Transaction history for Trade and Order objects
     */
    const trades: Trade[] = [];
    let order: Order | undefined;
    let filled = BN(0);
    let fillPrice = BN(0);
    let totalFillPrice = fillPrice;

    // Newest to oldest
    transactions.sort((a, b) => b.date - a.date);

    for (const transactionData of transactions) {
      const { transaction, offers, date } = transactionData;

      for (const offer of offers) {
        if (!offer.Sequence) continue;

        const trade = await getTradeFromData.call(
          this,
          {
            date,
            Flags: offer.Flags as number,
            OrderAccount: offer.Account,
            OrderSequence: offer.Sequence,
            Account: account,
            Sequence: sequence,
            TakerPays: offer.TakerPays,
            TakerGets: offer.TakerGets,
          },
          { offer }
        );

        if (trade) {
          trades.push(trade);
          filled = filled.plus(trade.amount);
          fillPrice = BN(trade.price);
          totalFillPrice = totalFillPrice.plus(fillPrice);
        }
      }

      if (transaction.Account === account && transaction.Sequence === sequence) {
        if (!transaction.Sequence) return;

        order = await getOrderFromData.call(
          this,
          {
            status: orderStatus,
            date,
            filled,
            fillPrice,
            totalFillPrice,
            trades,
            Flags: transaction.Flags as number,
            Account: transaction.Account,
            Sequence: transaction.Sequence,
            TakerPays: transaction.TakerPays,
            TakerGets: transaction.TakerGets,
          },
          { transactionData }
        );
      }
    }

    return order;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default fetchOrder;

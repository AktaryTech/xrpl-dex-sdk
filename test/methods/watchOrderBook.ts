import { assert } from 'chai';
import _ from 'lodash';
import 'mocha';

import { OrderBook, OrderBookStream, OrderId, XrplNetwork } from '../../src/models';
import { requests, responses } from '../fixtures';
import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';

const TIMEOUT = 25000;
const NETWORK = XrplNetwork.Testnet;

describe('watchOrderBook', function () {
  this.timeout(TIMEOUT);

  beforeEach(function (done) {
    setupRemoteSDK.call(this, NETWORK, undefined, done);
  });

  afterEach(teardownRemoteSDK);

  it('should subscribe to Order Book updates', function (done) {
    const orderId = requests.v2.orders.USD.buy.open as OrderId;
    const {
      symbol,
      // side,
      // type,
      amount,
      // price,
    } = responses.v2.orders.byId[orderId];
    // const symbol = 'USD+rVnYNK9yuxBz4uP8zC8LEFokM2nqH3poc/XRP';

    this.sdk
      .fetchOrderBook(symbol)
      .then((initialOrderBook: OrderBook) => {
        console.log('\ninitialOrderBook');
        console.log(initialOrderBook);

        this.sdk
          .watchOrderBook(symbol)
          .then(async (orderBookStream: OrderBookStream) => {
            orderBookStream.on('update', (orderBook: OrderBook) => {
              console.log('\norderBook');
              console.log(orderBook);
              assert(typeof orderBook !== 'undefined');
              const newBid = orderBook.bids.find((bid) => bid[1] === amount);
              console.log('\nnewBid?');
              console.log(newBid);
              done();
              orderBookStream.removeAllListeners();
            });

            orderBookStream.on('error', (error) => {
              console.error(error);
              done(error);
              orderBookStream.removeAllListeners();
            });

            // await this.sdk.createOrder(symbol, 'sell', type, amount, price);
            // this.sdk.client.emit('transaction', rippled.v2.subscribe.offerCreate[id as OrderId]);
          })
          .catch((err: Error) => {
            console.error(err);
            done(err);
          });
      })
      .catch((err: Error) => {
        console.error(err);
        done(err);
      });
  });
});

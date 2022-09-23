import _ from 'lodash';
import { assert } from 'chai';
import 'mocha';
import { Readable } from 'stream';
import { XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';

import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';

const TIMEOUT = 25000;
const NETWORK = XrplNetwork.Testnet;

describe('watchOrders', function () {
  this.timeout(TIMEOUT);

  before(_.partial(setupRemoteSDK, NETWORK, addresses.AKT_BUYER_SECRET));
  after(teardownRemoteSDK);

  it('should subscribe to Order data', function (done) {
    this.sdk
      .watchOrders()
      .then((orderStream: Readable) => {
        orderStream.on('data', (rawOrder) => {
          const order = JSON.parse(rawOrder);
          assert(typeof order !== 'undefined');
          done();
        });
      })
      .catch((err: Error) => {
        console.error(err);
        done(err);
      });
  });

  it('should subscribe to Order data for a given market symbol', function (done) {
    const symbol = 'USD/XRP';
    this.sdk
      .watchOrders(symbol, { baseIssuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' })
      .then((orderStream: Readable) => {
        orderStream.on('data', (rawOrder) => {
          const order = JSON.parse(rawOrder);
          assert(typeof order !== 'undefined');
          assert(order.symbol === symbol);
          done();
        });
      })
      .catch((err: Error) => {
        console.error(err);
        done(err);
      });
  });
});

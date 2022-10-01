import _ from 'lodash';
import { assert } from 'chai';
import 'mocha';
import { Readable } from 'stream';

import { Trade, XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';
import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';

const TIMEOUT = 20000;
const NETWORK = XrplNetwork.Testnet;

describe('watchTrades', function () {
  this.timeout(TIMEOUT);

  beforeEach(function (done) {
    setupRemoteSDK.call(this, NETWORK, addresses.AKT_BUYER_SECRET, done);
  });

  afterEach(teardownRemoteSDK);

  it('should subscribe to new Trades for a given market symbol', function (done) {
    const symbol = 'USD+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B/XRP';

    this.sdk
      .watchTrades(symbol)
      .then((tradeStream: Readable) => {
        tradeStream.on('update', (trade: Trade) => {
          assert(typeof trade !== 'undefined');
          done();
        });
      })
      .catch((err: Error) => {
        console.error(err);
        done(err);
      });
  });
});

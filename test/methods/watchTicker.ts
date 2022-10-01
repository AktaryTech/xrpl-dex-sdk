import _ from 'lodash';
import { assert } from 'chai';
import 'mocha';
import { Ticker, TickerStream, XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';

import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';

const TIMEOUT = 25000;
const NETWORK = XrplNetwork.Mainnet;

describe('watchTicker', function () {
  this.timeout(TIMEOUT);

  beforeEach(function (done) {
    setupRemoteSDK.call(this, NETWORK, addresses.AKT_BUYER_SECRET, done);
  });

  afterEach(teardownRemoteSDK);

  it('should subscribe to Ticker data for the given symbol', function (done) {
    this.sdk
      .watchTicker('USD+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B/XRP')
      .then((tickerStream: TickerStream) => {
        tickerStream.on('update', (ticker: Ticker) => {
          assert(typeof ticker !== 'undefined');
          done();
        });
      })
      .catch((err: Error) => {
        console.error(err);
        done(err);
      });
  });
});

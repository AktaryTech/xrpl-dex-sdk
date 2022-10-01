import _ from 'lodash';
import { assert } from 'chai';
import 'mocha';
import { Ticker, XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';

import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';
import { Readable } from 'stream';

const TIMEOUT = 25000;
const NETWORK = XrplNetwork.Mainnet;

describe('watchTickers', function () {
  this.timeout(TIMEOUT);

  beforeEach(function (done) {
    setupRemoteSDK.call(this, NETWORK, addresses.AKT_BUYER_SECRET, done);
  });

  afterEach(teardownRemoteSDK);

  it('should subscribe to Ticker data for a list of symbols', function (done) {
    const tickers = ['USD+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B/XRP', 'XRP/USD+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'];

    this.sdk
      .watchTickers(tickers)
      .then((tickersStream: Readable) => {
        tickersStream.on('update', (ticker: Ticker) => {
          assert(tickers.includes(ticker.symbol));
          done();
        });
      })
      .catch((err: Error) => {
        console.error(err);
        done(err);
      });
  });
});

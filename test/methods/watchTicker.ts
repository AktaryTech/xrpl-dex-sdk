import _ from 'lodash';
import { assert } from 'chai';
import 'mocha';
import { WatchTickerParams, XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';

import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';
import { Readable } from 'stream';

const TIMEOUT = 25000;
const NETWORK = XrplNetwork.Mainnet;

describe('watchTicker', function () {
  this.timeout(TIMEOUT);

  before(_.partial(setupRemoteSDK, NETWORK, addresses.AKT_BUYER_SECRET));
  after(teardownRemoteSDK);

  it('should subscribe to Ticker data for the given symbol', function (done) {
    this.sdk
      .watchTicker('USD/XRP', {
        issuers: { USD: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' },
      } as WatchTickerParams)
      .then((tickerStream: Readable) => {
        tickerStream.on('data', (rawTicker) => {
          const ticker = JSON.parse(rawTicker);
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

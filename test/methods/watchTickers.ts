import _ from 'lodash';
import { assert } from 'chai';
import 'mocha';
import { WatchTickersParams, XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';

import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';
import { Readable } from 'stream';

const TIMEOUT = 25000;
const NETWORK = XrplNetwork.Mainnet;

describe('watchTickers', function () {
  this.timeout(TIMEOUT);

  before(_.partial(setupRemoteSDK, NETWORK, addresses.AKT_BUYER_SECRET));
  after(teardownRemoteSDK);

  it('should subscribe to Ticker data for a list of symbols', function (done) {
    this.sdk
      .watchTickers(['USD/XRP', 'XRP/USD'], {
        issuers: { USD: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' },
      } as WatchTickersParams)
      .then((tickersStream: Readable) => {
        let isProcessing = false;
        tickersStream.on('data', (rawTicker) => {
          if (isProcessing) return;
          isProcessing = true;
          const ticker = JSON.parse(rawTicker);
          assert(['USD/XRP', 'XRP/USD'].includes(ticker.symbol));
          done();
        });
      });
  });
});

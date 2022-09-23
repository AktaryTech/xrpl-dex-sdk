import _ from 'lodash';
import { assert } from 'chai';
import 'mocha';
import { Readable } from 'stream';

import { XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';
import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';

const TIMEOUT = 20000;
const NETWORK = XrplNetwork.Mainnet;

describe('watchTrades', function () {
  this.timeout(TIMEOUT);

  before(_.partial(setupRemoteSDK, NETWORK, addresses.AKT_BUYER_SECRET));
  after(teardownRemoteSDK);

  it('should subscribe to new Trades for a given market symbol', function (done) {
    this.sdk
      .watchTrades('CNY/XRP')
      .then((tradeStream: Readable) => {
        tradeStream.on('data', (rawTrade) => {
          const trade = JSON.parse(rawTrade);
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

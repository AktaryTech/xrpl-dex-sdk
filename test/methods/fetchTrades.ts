import { assert } from 'chai';
import _ from 'lodash';
import 'mocha';
import { XrplNetwork } from '../../src/models';
import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';

const TIMEOUT = 25000;
const NETWORK = XrplNetwork.Mainnet;

describe('fetchTrades', function () {
  this.timeout(TIMEOUT);

  beforeEach(function (done) {
    setupRemoteSDK.call(this, NETWORK, 'ssYqQi5KF8YaNQyMvZKP28uA7GbWq', done);
  });

  afterEach(teardownRemoteSDK);

  it('return a list of Trades for a given symbol', async function () {
    const trades = await this.sdk.fetchTrades('XRP/USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', undefined, 3, {
      searchLimit: 500,
    });

    assert(trades.length === 3);
  });
});

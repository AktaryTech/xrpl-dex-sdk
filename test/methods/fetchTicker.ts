import { assert } from 'console';
import _ from 'lodash';
import 'mocha';
import { FetchTickerParams, XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';

import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';

const NETWORK = XrplNetwork.Testnet;

describe('fetchTicker', function () {
  beforeEach(_.partial(setupRemoteSDK, NETWORK, addresses.AKT_SELLER_SECRET));
  afterEach(teardownRemoteSDK);

  it('should return Ticker data for the given symbol', async function () {
    const ticker = await this.sdk.fetchTicker('TST/XRP', {
      issuers: { TST: 'rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd' },
    } as FetchTickerParams);
    assert(typeof ticker !== 'undefined');
  });
});

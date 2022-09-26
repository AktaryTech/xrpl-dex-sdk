import { assert } from 'chai';
import _ from 'lodash';
import 'mocha';
import { XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';

// import { responses, rippled } from '../fixtures';
import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';
// import { assertResultMatch } from '../testUtils';

const TIMEOUT = 25000;
const NETWORK = XrplNetwork.Testnet;

describe('fetchTrades', function () {
  this.timeout(TIMEOUT);

  beforeEach(_.partial(setupRemoteSDK, NETWORK, addresses.AKT_SELLER_SECRET));
  afterEach(teardownRemoteSDK);

  it('return a list of Trades for a given symbol', async function () {
    // this.mockRippled.addResponse('server_state', () => rippled.server_state.normal);

    const trades = await this.sdk.fetchTrades('XRP/USD+rVnYNK9yuxBz4uP8zC8LEFokM2nqH3poc', undefined, 1, {
      searchLimit: 500,
    });
    assert(trades.length);
  });
});

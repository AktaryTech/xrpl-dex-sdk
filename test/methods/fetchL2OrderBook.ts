import _ from 'lodash';
import 'mocha';

import {
  requests,
  // responses,
  rippled,
} from '../fixtures';
import { setupLocalSDK, teardownLocalSDK } from '../setupClient';
// import { assertResultMatch } from '../testUtils';

describe('fetchL2OrderBook', function () {
  beforeEach(setupLocalSDK);
  afterEach(teardownLocalSDK);

  it('should return an L2 OrderBook object', async function () {
    this.mockRippled.addResponse('book_offers', rippled.book_offers.usdBtc);

    const { symbol, limit, params } = requests.fetchOrderBook;

    const l2OrderBook = await this.sellerSdk.fetchL2OrderBook(symbol, limit, params);
    console.log(l2OrderBook);
    // assertResultMatch(l2OrderBook, responses.fetchL2OrderBook);
  });
});

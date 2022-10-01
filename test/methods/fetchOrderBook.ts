import _ from 'lodash';
import 'mocha';

import { requests, responses, rippled } from '../fixtures';
import { setupLocalSDK, teardownLocalSDK } from '../setupClient';
import { assertResultMatch } from '../testUtils';

const TIMEOUT = 15000;

describe('fetchOrderBook', function () {
  this.timeout(TIMEOUT);

  beforeEach(setupLocalSDK);
  afterEach(teardownLocalSDK);

  it('should return an OrderBook object', async function () {
    this.mockRippled.addResponse('book_offers', rippled.book_offers.usdBtc);

    const { symbol, limit, params } = requests.fetchOrderBook;
    const orderBook = await this.sellerSdk.fetchOrderBook(symbol, limit, params);
    assertResultMatch(_.omit(orderBook, ['nonce']), responses.fetchOrderBook);
  });
});

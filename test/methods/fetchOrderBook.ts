import _ from 'lodash';
import 'mocha';
import { XrplNetwork } from '../../src/models';

import {
  addresses,
  // requests,
  //  responses, rippled
} from '../fixtures';
import {
  //  setupLocalSDK,
  setupRemoteSDK,
  //  teardownLocalSDK,
  teardownRemoteSDK,
} from '../setupClient';
// import { assertResultMatch } from '../testUtils';

const TIMEOUT = 15000;
const NETWORK = XrplNetwork.Testnet;

describe('fetchOrderBook', function () {
  this.timeout(TIMEOUT);

  before(_.partial(setupRemoteSDK, NETWORK, addresses.AKT_SELLER_SECRET));
  after(teardownRemoteSDK);
  // beforeEach(setupLocalSDK);
  // afterEach(teardownLocalSDK);

  it('should return an OrderBook object', async function () {
    // this.mockRippled.addResponse('book_offers', rippled.book_offers.usdBtc);

    // const { symbol, limit, params } = requests.fetchOrderBook;

    const orderBook = await this.sellerSdk.fetchOrderBook('TST/XRP', undefined, {
      issuers: { TST: 'rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd' },
    });

    console.log(orderBook);

    // assertResultMatch(orderBook, responses.fetchOrderBook);
  });
});

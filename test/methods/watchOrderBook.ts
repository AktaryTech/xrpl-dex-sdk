import _ from 'lodash';
// import { assert } from 'chai';
import 'mocha';
// import { Readable } from 'stream';
import { XrplNetwork } from '../../src/models';
// import { requests } from '../fixtures';

import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';

const TIMEOUT = 25000;
const NETWORK = XrplNetwork.Testnet;

describe('watchOrderBook', function () {
  this.timeout(TIMEOUT);

  before(_.partial(setupRemoteSDK, NETWORK));
  after(teardownRemoteSDK);

  it('should subscribe to Order Book updates', function (done) {
    // const { symbol, side, type, amount, price, params } = requests.createOrder.buy;
    // this.sdk
    //   .watchOrderBook(symbol)
    //   .then(async (orderBookStream: Readable) => {
    //     orderBookStream.on('data', (rawOrderBook) => {
    //       const newOrderBook = JSON.parse(rawOrderBook);
    //       console.log('\nnewOrderBook');
    //       console.log(newOrderBook);
    //       assert(typeof newOrderBook !== 'undefined');
    //       done();
    //     });
    //     await this.sdk.createOrder(symbol, side, type, amount, price, params);
    //   })
    //   .catch((err: Error) => {
    //     console.error(err);
    //     done(err);
    //   });
  });
});

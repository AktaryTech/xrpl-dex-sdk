import _ from 'lodash';
import 'mocha';
import { XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';

import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';

const TIMEOUT = 10000;
const NETWORK = XrplNetwork.Testnet;

describe('watchBalance', function () {
  this.timeout(TIMEOUT);

  before(_.partial(setupRemoteSDK, NETWORK, addresses.AKT_SELLER_SECRET));
  after(teardownRemoteSDK);

  it('should subscribe to Balance data for an account', function (done) {
    // this.sdk.watchBalance({ account: addresses.AKT_SELLER } as WatchBalanceParams).then((balanceStream: Readable) => {
    //   balanceStream.on('data', (rawBalance) => {
    //     const balance = JSON.parse(rawBalance);
    //     console.log(balance);
    //     assert(typeof balance !== 'undefined');
    //     done();
    //   });
    // });
  });
});

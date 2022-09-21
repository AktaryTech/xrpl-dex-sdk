import _ from 'lodash';
import { assert } from 'chai';
import 'mocha';
import { Readable } from 'stream';
import { XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';

import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';

const TIMEOUT = 25000;
const NETWORK = XrplNetwork.Testnet;

describe('watchOrders', function () {
  this.timeout(TIMEOUT);

  before(_.partial(setupRemoteSDK, NETWORK, addresses.AKT_BUYER_SECRET));
  after(teardownRemoteSDK);

  it.only('should subscribe to Order data', function (done) {
    this.sdk
      .watchOrders('USD/XRP', { baseIssuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' })
      .then((orderStream: Readable) => {
        orderStream.on('data', (rawOrder) => {
          const order = JSON.parse(rawOrder);
          assert(typeof order !== 'undefined');
          done();
        });
      });
  });
});

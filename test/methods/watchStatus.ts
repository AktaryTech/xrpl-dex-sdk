import _ from 'lodash';
import { assert } from 'chai';
import 'mocha';
import { XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';

import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';
import { Readable } from 'stream';

const TIMEOUT = 25000;
const NETWORK = XrplNetwork.Mainnet;

describe('watchStatus', function () {
  this.timeout(TIMEOUT);

  before(_.partial(setupRemoteSDK, NETWORK, addresses.AKT_BUYER_SECRET));
  after(teardownRemoteSDK);

  it.only('should subscribe to Status data', function (done) {
    this.sdk.watchStatus().then((statusStream: Readable) => {
      statusStream.on('data', (rawStatus) => {
        const status = JSON.parse(rawStatus);
        console.log(status);
        assert(typeof status !== 'undefined');
        done();
      });
    });
  });
});

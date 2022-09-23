import _ from 'lodash';
import { assert } from 'chai';
import 'mocha';
import { Readable } from 'stream';

import { XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';
import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';

const TIMEOUT = 10000;
const NETWORK = XrplNetwork.Mainnet;

describe('watchStatus', function () {
  this.timeout(TIMEOUT);

  before(_.partial(setupRemoteSDK, NETWORK, addresses.AKT_BUYER_SECRET));
  after(teardownRemoteSDK);

  it('should subscribe to exchange status updates', function (done) {
    this.sdk
      .watchStatus()
      .then((statusStream: Readable) => {
        statusStream.on('data', (rawStatus) => {
          const status = JSON.parse(rawStatus);
          assert(typeof status !== 'undefined');
          done();
        });
      })
      .catch((err: Error) => {
        console.error(err);
        done(err);
      });
  });
});

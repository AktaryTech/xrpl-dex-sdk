import _ from 'lodash';
import { assert } from 'chai';
import 'mocha';
import { Readable } from 'stream';
import { XrplNetwork } from '../../src/models';
import { addresses } from '../fixtures';

import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';

const TIMEOUT = 25000;
const NETWORK = XrplNetwork.Testnet;

describe('watchOrderBook', function () {
  this.timeout(TIMEOUT);

  before(_.partial(setupRemoteSDK, NETWORK, addresses.AKT_BUYER_SECRET));
  after(teardownRemoteSDK);

  it('should subscribe to Order Book updates', function (done) {
    this.sdk
      .watchOrderBook('SGB/CSC', 5, {
        issuers: {
          CSC: 'rBZJzEisyXt2gvRWXLxHftFRkd1vJEpBQP',
          SGB: 'rBZJzEisyXt2gvRWXLxHftFRkd1vJEpBQP',
        },
      })
      .then((orderBookStream: Readable) => {
        orderBookStream.on('data', (rawOrderBook) => {
          const orderBook = JSON.parse(rawOrderBook);
          console.log(orderBook);
          assert(typeof orderBook !== 'undefined');
          done();
        });
      })
      .catch((err: Error) => {
        console.error(err);
        done(err);
      });
  });
});

import _ from 'lodash';
import 'mocha';

import { XrplNetwork } from '../../src/models';
import { setupRemoteSDK, teardownRemoteSDK } from '../setupClient';
import { assert } from 'chai';
import { addresses } from '../fixtures';

const NETWORK = XrplNetwork.Testnet;

const TIMEOUT = 25000;

describe('fetchOrders', function () {
  this.timeout(TIMEOUT);

  beforeEach(function (done) {
    setupRemoteSDK.call(this, NETWORK, undefined, done, addresses.seller.public, addresses.seller.private);
  });

  afterEach(teardownRemoteSDK);

  it('should retrieve a list of Orders', async function () {
    const orders = await this.sdk.fetchOrders(undefined, undefined, 5);
    assert(orders.length === 5);
  });

  // it('should retrieve a list of Orders for a given market symbol', async function () {
  //   const orders = await this.sdk.fetchOrders('XRP/AKT+rMZoAqwRn3BLbmFYL3exNVNVKrceYcNy6B', undefined, 1);
  //   assert(orders.length === 1);
  // });

  // it('should retrieve a list of Orders since a given date', async function () {
  //   const orders = await this.sdk.fetchOrders('TST+rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd/XRP', undefined, 2);
  //   assert(orders.length === 2);
  // });
});

import _ from 'lodash';
import 'mocha';

import { setupLocalSDK, teardownLocalSDK } from '../setupClient';
import { OrderId } from '../../src/models';
import { assertResultMatch } from '../testUtils';
import { requests, responses, rippled } from '../fixtures';

const TIMEOUT = 20000;

describe('fetchOrder', function () {
  this.timeout(TIMEOUT);
  beforeEach(setupLocalSDK);
  afterEach(teardownLocalSDK);

  /**
   * Buy Orders
   */
  it('should return an open Buy Order', async function () {
    // const sellOrder = await this.sdk.fetchOrder('r3xYuG3dNF4oHBLXwEdFmFKGm9TWzqGT7z:31617670');
    // console.log('\nsellOrder');
    // console.log(_.omit(sellOrder, ['info']));

    // const buyOrder = await this.sdk.fetchOrder('rLg33RykRFBxoJsTknkE5ekmoVDPmAPJwU:31617724');
    // console.log('\nbuyOrder');
    // console.log(_.omit(buyOrder, ['info']));

    // const balance = await this.sdk.fetchBalance();
    // console.log('\nXRP balance: %s (∆ %s)', balance.balances.XRP.total, balance.balances.XRP.total - 1000);
    // console.log('\nAKT balance: ', balance.balances['AKT+rMZoAqwRn3BLbmFYL3exNVNVKrceYcNy6B'].total);

    const orderId = requests.v2.orders.USD.buy.open as OrderId;
    this.mockRippled.addResponse('ledger_entry', rippled.v2.ledgerEntry.offers.open[orderId]);
    this.mockRippled.addResponse('tx', rippled.v2.tx.orderId.OfferCreate[orderId]);
    this.mockRippled.addResponse('account_info', rippled.v2.accountInfo.issuers.USD);

    const fetchOrderResponse = await this.sellerSdk.fetchOrder(orderId);
    assertResultMatch(fetchOrderResponse, responses.v2.orders.USD.buy.open);
  });

  // it('should return a closed Buy Order', async function () {});

  // it('should return a partially filled Buy Order with multiple Trades', async function () {});

  // it('should retrieve a completed Buy order with a Trade', async function () {});

  // it('should return a canceled Buy Order', async function () {});

  // it('should return a "Fill or Kill" Buy Order', async function () {});

  // it('should return an "Immediate or Cancel" Buy Order', async function () {});

  /**
   * Sell Orders
   */

  // it('should return a partially filled Sell Order with multiple Trades', async function () {});

  // it('should retrieve a completed Sell order with multiple Trades', async function () {});

  // it('should return a completed Sell Order', async function () {});

  // it('should return a canceled Sell Order', async function () {});

  // it('should return a "Fill or Kill" Sell Order', async function () {});

  // it('should return an "Immediate or Cancel" Sell Order', async function () {});
});

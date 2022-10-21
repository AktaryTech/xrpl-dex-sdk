import { assert } from 'chai';
import _ from 'lodash';
import 'mocha';
import { addresses, rippled } from '../fixtures';
import { setupLocalSDK, teardownLocalSDK } from '../setupClient';

const TIMEOUT = 25000;
// const NETWORK = XrplNetwork.Testnet;

// const keys = {
//   seller: {
//     public: 'ED8B9B26AE09C875052726030E10AFDD27DDCFA89BBFB57237A3AC1FE72F0911F1',
//     private: 'ED09BB3144BA3662646FFBDD7B26729AFE31DB3342A8ACA0ED6533C9D89A7AD1C1',
//   },
//   buyer: {
//     public: 'EDF2C353010B331C31EA4954E0E104A31C7CAB44A5691028AE7CCE543EF847D0BD',
//     private: 'ED220C912F13AEFEC7DDB253A1AF1CFE267F4C5B2259ED404A455C43955AA5F490',
//   },
// };

describe('fetchMyTrades', function () {
  this.timeout(TIMEOUT);

  beforeEach(_.partial(setupLocalSDK, { walletSecret: addresses.AKT_BUYER_SECRET }));

  afterEach(teardownLocalSDK);

  // beforeEach(function (done) {
  //   setupRemoteSDK.call(this, NETWORK, undefined, done, keys.seller.public, keys.seller.private);
  // });

  // afterEach(teardownRemoteSDK);

  it.only("return a list of an account's Trades for a given symbol", async function () {
    this.mockRippled.addResponse(
      'account_info',
      rippled.v2.accountInfo.issuers['USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq']
    );
    this.mockRippled.addResponse('account_tx', rippled.v2.accountTx['r3KC7iM1GPLmvg1MVTXbXmoC87yyyuFRf2']);

    const trades = await this.sdk.fetchMyTrades('USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/XRP', undefined, undefined, {
      searchLimit: 20,
    });

    console.log('trades');
    console.log(trades[0]);
    console.log({
      id: 'r3KC7iM1GPLmvg1MVTXbXmoC87yyyuFRf2:67956678',
      order: 'rpXhhWmCvDwkzNtRbm7mmD1vZqdfatQNEe:59349452',
      datetime: '2022-10-21T02:19:30.000Z',
      timestamp: 1666318770000,
      symbol: 'XRP/USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
      type: 'limit',
      side: 'sell',
      amount: 5254.779017,
      price: 0.4462306799635816,
      taker_or_maker: 'maker',
      cost: 2344.843613814271,
    });
    const differences = _.difference(
      Object.values(_.omit(trades[0], ['info'])),
      Object.values({
        id: 'r3KC7iM1GPLmvg1MVTXbXmoC87yyyuFRf2:67956678',
        order: 'rpXhhWmCvDwkzNtRbm7mmD1vZqdfatQNEe:59349452',
        datetime: '2022-10-21T02:19:30.000Z',
        timestamp: 1666318770000,
        symbol: 'XRP/USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
        type: 'limit',
        side: 'sell',
        amount: '5254.779017',
        price: '0.4462306799635816',
        taker_or_maker: 'maker',
        cost: '2344.843613814271',
      })
    );

    console.log('Actual results that differ from expected results:');
    console.log(differences);
    // console.log(JSON.stringify(trades[1]));

    assert(differences.length === 0);

    assert(trades.length, 'Trades array should not be empty');
  });
});

import _ from 'lodash';
import 'mocha';

import { responses, rippled } from '../fixtures';
import { setupLocalSDK, teardownLocalSDK } from '../setupClient';
import { assertResultMatch } from '../testUtils';

describe('fetchTransactionFees', function () {
  beforeEach(setupLocalSDK);
  afterEach(teardownLocalSDK);

  it('should return the transaction fees for multiple currencies', async function () {
    this.mockRippled.addResponse('fee', rippled.fee.normal);

    // TODO: figure out a cleaner way to do this
    for (let i = 0, il = 21; i < il; i += 1) {
      this.mockRippled.addResponse('account_info', rippled.account_info.issuer);
    }

    const transactionFees = await this.sellerSdk.fetchTransactionFees([
      'USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
      'GBP+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
    ]);
    assertResultMatch(transactionFees, responses.fetchTransactionFees);
  });
});

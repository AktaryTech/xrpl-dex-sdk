import _ from 'lodash';
import 'mocha';

import { responses, rippled } from '../fixtures';
import { setupLocalSDK, teardownLocalSDK } from '../setupClient';
import { assertResultMatch } from '../testUtils';

describe('fetchTransactionFee', function () {
  beforeEach(setupLocalSDK);
  afterEach(teardownLocalSDK);

  it('should return the transaction fee for a single currency', async function () {
    this.mockRippled.addResponse('fee', rippled.fee.normal);

    // TODO: figure out a cleaner way to do this
    for (let i = 0, il = 21; i < il; i += 1) {
      this.mockRippled.addResponse('account_info', rippled.account_info.issuer);
    }

    const transactionFee = await this.sellerSdk.fetchTransactionFee('USD+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq');
    assertResultMatch(transactionFee, responses.fetchTransactionFee);
  });
});

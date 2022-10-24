import _ from 'lodash';
import { OfferCancel } from 'xrpl';
import { OrderId, CancelOrderResponse, SDKContext, ArgumentsRequired } from '../models';
import { parseOrderId, validateOrderId } from '../utils';

/**
 * Cancels an Order on the Ripple dEX. Returns an {@link CancelOrderResponse}
 * with the canceled Order object.
 *
 * @category Methods
 *
 * @param id ID of the Order to cancel
 * @returns A CancelOrderResponse object
 */
async function cancelOrder(this: SDKContext, id: OrderId): Promise<CancelOrderResponse> {
  if (!id) throw new ArgumentsRequired('Missing required arguments for cancelOrder call');

  validateOrderId(id);

  const { sequence } = parseOrderId(id);

  const offerCancel: OfferCancel = {
    TransactionType: 'OfferCancel',
    Account: this.wallet.classicAddress,
    OfferSequence: sequence,
  };

  const offerCancelResult = await this.client.submitAndWait(offerCancel, { autofill: true, wallet: this.wallet });

  const response: CancelOrderResponse = {
    id,
    info: { OfferCancel: offerCancelResult },
  };

  return response;
}

export default cancelOrder;

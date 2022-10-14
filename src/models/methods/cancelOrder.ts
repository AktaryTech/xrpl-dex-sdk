import { OrderId } from '../ccxt';

/**
 * Expected response from a cancelOrder call
 *
 * @category Responses
 */
export type CancelOrderResponse = { id: OrderId; info: Record<string, any> } | undefined;

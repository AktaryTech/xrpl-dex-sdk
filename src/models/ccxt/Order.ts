import { MarketSymbol, UnixTimestamp } from '../common';
import { Fee, Trade } from '.';

export type OrderStatus = 'open' | 'closed' | 'canceled' | 'expired' | 'rejected';

export type OrderType = 'limit';

export type OrderTimeInForce = 'GTC' | 'IOC' | 'FOK' | 'PO';

export type OrderSide = 'buy' | 'sell';

export interface BaseOrder {
  datetime: string;
  timestamp: UnixTimestamp;
  symbol: MarketSymbol;
  type: OrderType;
  side: OrderSide;
  amount: string;
  price: string;
  cost: string;
  fee?: Fee;
}

export interface Order {
  /** The Offer's Sequence number (as a string) */
  id: string;
  clientOrderId?: string;
  datetime: string;
  timestamp: UnixTimestamp;
  lastTradeTimestamp: UnixTimestamp;
  status: OrderStatus;
  symbol: MarketSymbol;
  type: OrderType;
  timeInForce?: OrderTimeInForce;
  side: OrderSide;
  amount: string | number;
  price: string | number;
  average?: string | number;
  filled: string | number;
  remaining: string | number;
  cost: string | number;
  trades: Trade[];
  fee?: Fee;
  /** Raw XRPL responses as JSON strings */
  info: any;
}

import { Trade } from 'ccxt';
import { MarketSymbol } from '../common';
import Fee from './Fee';

export enum OrderStatus {
  Open = 'open',
  Closed = 'closed',
  Canceled = 'canceled',
  Expired = 'expired',
  Rejected = 'rejected',
}

export enum OrderType {
  Limit = 'limit',
  Market = 'market',
}

export enum OrderTimeInForce {
  GoodTillCanceled = 'gtc',
  ImmediateOrCancel = 'ioc',
  FillOrKill = 'fok',
  PostOnly = 'po',
}

export enum OrderSide {
  Buy = 'buy',
  Sell = 'sell',
}

export default interface Order {
  id: string;
  clientOrderId?: string;
  datetime: string;
  timestamp: number;
  lastTradeTimestamp?: number;
  status: OrderStatus;
  symbol: MarketSymbol;
  type: string;
  timeInForce?: string;
  side: OrderSide;
  price?: string | number; // May be empty for Market orders
  average?: string | number;
  amount: string | number;
  filled: string | number;
  remaining: string | number;
  cost: string | number;
  trades: Trade[];
  fee?: Fee;
  info: any;
}

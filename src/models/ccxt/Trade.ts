import { Readable } from 'stream';
import { Amount } from 'xrpl/dist/npm/models/common';
import { AccountAddress, MarketSymbol, XrplTimestamp } from '../common';
import { Fee } from './Fees';

export type TradeStream = Readable;

export interface Trade {
  id: string; // string trade id
  order?: string; // string order id or undefined/None/null
  datetime: string; // ISO8601 datetime with milliseconds;
  timestamp: number; // Unix timestamp in milliseconds
  symbol: MarketSymbol; // symbol in CCXT format
  type?: string; // order type, 'market', 'limit', ... or undefined/None/null
  side: 'buy' | 'sell'; // direction of the trade, 'buy' or 'sell'
  amount: string; // amount of base currency
  price: string; // float price in quote currency
  takerOrMaker: 'taker' | 'maker'; // string, 'taker' or 'maker'
  cost: string; // total cost (including fees), `price * amount`
  fee?: Fee;
  info: Record<string, any>; // the original decoded JSON as is
}

export interface TradeSourceData {
  date: XrplTimestamp;
  Flags: number;
  Account: AccountAddress;
  Sequence: number;
  OrderAccount: AccountAddress;
  OrderSequence: number;
  TakerPays: Amount;
  TakerGets: Amount;
}

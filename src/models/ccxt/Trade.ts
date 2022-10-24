/**
 * CCXT Trades
 *
 * https://docs.ccxt.com/en/latest/manual.html?#trade-structure
 */
import { Readable } from 'stream';
import { Amount } from 'xrpl/dist/npm/models/common';
import { AccountAddress, MarketSymbol, XrplTimestamp } from '../common';
import { Fee } from './Fees';

export type TradeStream = Readable;

export interface Trade {
  // trade id
  id: string;
  // order id or undefined/None/null
  order?: string;
  // ISO8601 datetime with milliseconds;
  datetime: string;
  // Unix timestamp in milliseconds
  timestamp: number;
  // symbol in CCXT format
  symbol: MarketSymbol;
  // order type, 'market', 'limit', ... or undefined/None/null
  type?: string;
  // direction of the trade, 'buy' or 'sell'
  side: 'buy' | 'sell';
  // amount of base currency
  amount: string;
  // float price in quote currency
  price: string;
  // 'taker' or 'maker'
  takerOrMaker: 'taker' | 'maker';
  // total cost (excluding fees), `price * amount`
  cost: string;
  fee?: Fee;
  // the original decoded JSON as is
  info: Record<string, any>;
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

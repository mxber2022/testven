export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d'

export interface TradingPair {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  openInterest: number
  maxLeverage: number
  category: string
}

export type OrderType = 'market' | 'limit'

export type PositionType = 'long' | 'short'

export interface Position {
  id: string
  symbol: string
  type: PositionType
  leverage: number
  size: number
  entryPrice: number
  markPrice: number
  liquidationPrice: number
  margin: number
  pnl: number
  pnlPercent: number
  createdAt: number
  updatedAt: number
}

export interface TradeFormValues {
  positionType: PositionType
  orderType: OrderType
  symbol: string
  price: number
  leverage: number
  collateral: number
  takeProfitPrice?: number
  stopLossPrice?: number
}

export interface MarketSentiment {
  longPercentage: number
  shortPercentage: number
}

export interface TradeHistory {
  pair: string
  type: 'long' | 'short'
  size: number
  price: number
  timestamp: number
  status: 'open' | 'closed'
  pnl?: number
}

export interface MarketInfo {
  symbol: string
  price: number
  change24h: number
  volume24h: number
  openInterest: number
  fundingRate: number
  nextFundingTime: number
}

export interface ChartData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
} 
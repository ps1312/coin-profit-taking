export interface Milestone {
  multiplier: number
  holdings: number
  profit: number
  profitPercent: number
  marketCap: number
}

export type FormatOptions = {
  decimals?: number
  currency?: boolean
}

export interface CoinPrediction {
  id: string
  name: string
  coinData: {
    price: string
    marketCap: string
  }
  holdingsData: {
    total: string
    avgPrice: string
  }
  customTargets: Milestone[]
}

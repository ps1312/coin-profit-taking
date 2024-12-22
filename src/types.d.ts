export interface Milestone {
    name: string
    marketCap: number
    price: number
    portfolioValue: number
    holdingPercentage: number
    action: string
    realizedProfit: number
    cumulativeRealizedProfit: number
    unrealizedProfit: number
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
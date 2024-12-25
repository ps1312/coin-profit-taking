export interface CoinDataFormFields {
  holdings: number
  marketCap: number
}

export interface Milestone {
  multiplier: number
  holdings: number
  profit: number
  profitPercent: number
  marketCap: number
}

export interface CoinPrediction {
  id: string
  name: string
  coinData: CoinDataFormFields
  milestones: Milestone[]
}

import { createContext, useState } from "react"
import { CoinDataFormFields, CoinPrediction } from "./types"
import { getStoredPredictions } from "./services"

interface PredictionsContextType {
  activePredictionId: string
  setActivePredictionId: (id: string) => void

  coinDataForm: CoinDataFormFields
  setCoinDataForm: React.Dispatch<React.SetStateAction<CoinDataFormFields>>

  predictions: CoinPrediction[]
  setPredictions: React.Dispatch<React.SetStateAction<CoinPrediction[]>>
}

export const PredictionsContext = createContext<PredictionsContextType>({
  activePredictionId: "1",
  setActivePredictionId: () => {},
  coinDataForm: { holdings: 0, marketCap: 0 },
  setCoinDataForm: () => {},
  predictions: [],
  setPredictions: () => {},
})

export const PredictionsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [activePredictionId, setActivePredictionId] = useState("1")

  const [coinDataForm, setCoinDataForm] = useState<CoinDataFormFields>({
    holdings: 0,
    marketCap: 0,
  })

  const [predictions, setPredictions] = useState<CoinPrediction[]>(
    getStoredPredictions()
  )

  return (
    <PredictionsContext.Provider
      value={{
        activePredictionId,
        setActivePredictionId,
        coinDataForm,
        setCoinDataForm,
        predictions,
        setPredictions,
      }}
    >
      {children}
    </PredictionsContext.Provider>
  )
}

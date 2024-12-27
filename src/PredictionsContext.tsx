import { createContext, useState, useEffect } from "react"
import { CoinDataFormFields, CoinPrediction, Milestone } from "./types"
import { getStoredPredictions } from "./services"

interface PredictionsContextType {
  activePredictionId: string
  setActivePredictionId: (id: string) => void

  coinDataForm: CoinDataFormFields
  setCoinDataForm: React.Dispatch<React.SetStateAction<CoinDataFormFields>>

  predictions: CoinPrediction[]
  setPredictions: React.Dispatch<React.SetStateAction<CoinPrediction[]>>

  handleRemovePrediction: (id: string) => void

  handleAddPrediction: () => void
  updateMilestones: (newMilestones: Milestone[]) => void
  updateCoinDataForm: (name: "holdings" | "marketCap", value: number) => void
  sortedTargets: Milestone[]
  prediction: CoinPrediction
}

export const PredictionsContext = createContext<PredictionsContextType>({
  activePredictionId: "1",
  setActivePredictionId: () => {},
  coinDataForm: { holdings: 0, marketCap: 0 },
  setCoinDataForm: () => {},
  predictions: [],
  setPredictions: () => {},
  handleRemovePrediction: () => {},
  handleAddPrediction: () => {},
  updateMilestones: () => {},
  updateCoinDataForm: () => {},
  sortedTargets: [],
  prediction: {
    id: "1",
    name: "",
    coinData: { holdings: 0, marketCap: 0 },
    milestones: [],
  },
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

  const prediction = predictions.find((p) => p.id === activePredictionId)!
  const sortedTargets = prediction.milestones.sort(
    (a, b) => a.marketCap - b.marketCap
  )

  useEffect(() => {
    localStorage.setItem("predictions", JSON.stringify(predictions))
  }, [predictions])

  const handleRemovePrediction = (id: string) => {
    setPredictions(predictions.filter((p) => p.id !== id))

    if (activePredictionId === id) {
      setActivePredictionId(predictions[0].id)
    }
  }

  const handleAddPrediction = () => {
    const newId = new Date().getTime().toString()
    setPredictions([
      ...predictions,
      {
        id: newId,
        name: `Prediction ${newId}`,
        coinData: { holdings: 0, marketCap: 0 },
        milestones: [
          {
            multiplier: 1,
            holdings: 0,
            profit: 0,
            profitPercent: 0,
            marketCap: 0,
          },
        ],
      },
    ])
    setActivePredictionId(newId)
  }

  const updateMilestones = (newMilestones: Milestone[]) => {
    setPredictions(
      predictions.map((p) =>
        p.id === prediction.id ? { ...p, milestones: newMilestones } : p
      )
    )
  }

  const updateCoinDataForm = (
    name: "holdings" | "marketCap",
    value: number
  ) => {
    setCoinDataForm((prev) => ({ ...prev, [name]: value }))
    const newMilestones = [...prediction.milestones]
    newMilestones[0][name] = value
    updateMilestones(newMilestones)
  }

  return (
    <PredictionsContext.Provider
      value={{
        activePredictionId,
        setActivePredictionId,
        coinDataForm,
        setCoinDataForm,
        predictions,
        setPredictions,
        handleRemovePrediction,
        handleAddPrediction,
        updateMilestones,
        updateCoinDataForm,
        sortedTargets,
        prediction,
      }}
    >
      {children}
    </PredictionsContext.Provider>
  )
}

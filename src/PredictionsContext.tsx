import { createContext, useState, useEffect } from "react"
import { CoinDataFormFields, CoinPrediction, Milestone } from "./types"
import { getStoredPredictions } from "./services"

interface PredictionsContextType {
  activePredictionId: string
  sortedTargets: Milestone[]
  prediction: CoinPrediction
  newTarget: { marketCap: number; profitPercent: number }
  coinDataForm: CoinDataFormFields
  predictions: CoinPrediction[]
  setCoinDataForm: React.Dispatch<React.SetStateAction<CoinDataFormFields>>
  setActivePredictionId: (id: string) => void
  setPredictions: React.Dispatch<React.SetStateAction<CoinPrediction[]>>
  handleRemovePrediction: (id: string) => void
  handleRemoveTarget: (index: number) => void
  handleAddPrediction: () => void
  updateMilestones: (newMilestones: Milestone[]) => void
  updateCoinDataForm: (name: "holdings" | "marketCap", value: number) => void
  setNewTarget: (target: { marketCap: number; profitPercent: number }) => void
  handleAddMilestone: (e: React.FormEvent) => void
  showInReais: boolean
  setShowInReais: (showInReais: boolean) => void
}

export const PredictionsContext = createContext<PredictionsContextType>({
  activePredictionId: "1",
  sortedTargets: [],
  prediction: {
    id: "1",
    name: "",
    coinData: { holdings: 0, marketCap: 0 },
    milestones: [],
  },
  newTarget: { marketCap: 0, profitPercent: 0 },
  coinDataForm: { holdings: 0, marketCap: 0 },
  predictions: [],
  setCoinDataForm: () => {},
  setActivePredictionId: () => {},
  setPredictions: () => {},
  handleRemovePrediction: () => {},
  handleRemoveTarget: () => {},
  handleAddPrediction: () => {},
  updateMilestones: () => {},
  updateCoinDataForm: () => {},
  setNewTarget: () => {},
  handleAddMilestone: () => {},
  showInReais: false,
  setShowInReais: () => {},
})

export const PredictionsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [activePredictionId, setActivePredictionId] = useState("1")
  const [newTarget, setNewTarget] = useState({ marketCap: 0, profitPercent: 0 })
  const [showInReais, setShowInReais] = useState(false)
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

  const handleAddPrediction = () => {
    const defaultMilestone = {
      multiplier: 1,
      holdings: 0,
      profit: 0,
      profitPercent: 0,
      marketCap: 0,
    }
    const newId = new Date().getTime().toString()

    setActivePredictionId(newId)
    setPredictions([
      ...predictions,
      {
        id: newId,
        name: `Prediction ${newId}`,
        coinData: { holdings: 0, marketCap: 0 },
        milestones: [defaultMilestone],
      },
    ])
  }

  const handleRemovePrediction = (id: string) => {
    setPredictions(predictions.filter((p) => p.id !== id))

    if (activePredictionId === id) {
      setActivePredictionId(predictions[0].id)
    }
  }

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault()

    const previousMilestone =
      prediction.milestones[prediction.milestones.length - 1]
    const multiplier = newTarget.marketCap / previousMilestone.marketCap
    const holdings = previousMilestone.holdings * multiplier
    const profit = holdings * (newTarget.profitPercent / 100)

    const newMilestone = {
      multiplier,
      holdings: holdings - profit,
      profit,
      profitPercent: newTarget.profitPercent,
      marketCap: newTarget.marketCap,
    }

    const newPredictions = [...predictions]
    const index = newPredictions.findIndex((p) => p.id === activePredictionId)

    newPredictions[index] = {
      ...prediction,
      coinData: coinDataForm,
      milestones: [...sortedTargets, newMilestone],
    }

    setPredictions(newPredictions)
    setNewTarget({ marketCap: 0, profitPercent: 0 })
  }

  const handleRemoveTarget = (index: number) => {
    const newMilestones = [...prediction.milestones]
    newMilestones.splice(index, 1)
    updateMilestones(newMilestones)
  }

  return (
    <PredictionsContext.Provider
      value={{
        newTarget,
        setNewTarget,
        handleAddMilestone,
        handleRemoveTarget,
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
        showInReais,
        setShowInReais,
      }}
    >
      {children}
    </PredictionsContext.Provider>
  )
}

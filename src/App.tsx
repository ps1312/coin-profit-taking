import { useContext, useEffect, useState } from "react"
import { PredictionCharts } from "./components/PredictionCharts"
import { MilestoneList } from "./components/MilestoneList"
import { AddTargetForm } from "./components/AddTargetForm"
import { CoinDataFormFields, CoinPrediction, Milestone } from "./types"
import { Sidebar } from "./components/Sidebar"
import { CoinDataForm } from "./components/CoinDataForm"
import { getStoredPredictions } from "./services"
import { PredictionsContext } from "./PredictionsContext"

const App = () => {
  const { activePredictionId, setActivePredictionId } = useContext(PredictionsContext)

  const [newTarget, setNewTarget] = useState({ marketCap: 0, profitPercent: 0 })

  const [predictions, setPredictions] = useState<CoinPrediction[]>(
    getStoredPredictions()
  )

  const prediction = predictions.find((p) => p.id === activePredictionId)!

  const [coinDataForm, setCoinDataForm] = useState<CoinDataFormFields>(
    prediction.coinData
  )

  const sortedTargets = prediction.milestones.sort(
    (a, b) => a.marketCap - b.marketCap
  )

  useEffect(() => {
    localStorage.setItem("predictions", JSON.stringify(predictions))
  }, [prediction, predictions])

  const handleAddPrediction = () => {
    const newId = (predictions.length + 1).toString()

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

  const handleRemovePrediction = (id: string) => {
    setPredictions(predictions.filter((p) => p.id !== id))

    if (activePredictionId === id) {
      setActivePredictionId(predictions[0].id)
    }
  }

  const handleAddTarget = (e: React.FormEvent) => {
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
  }

  const updateMilestones = (newMilestones: Milestone[]) => {
    const updatedPredictions = predictions.map((p) =>
      p.id === prediction.id
        ? {
          ...p,
          milestones: newMilestones,
        }
        : p
    )

    setPredictions(updatedPredictions)
  }

  const handleRemoveTarget = (index: number) => {
    const newMilestones = [...prediction.milestones]
    newMilestones.splice(index, 1)
    updateMilestones(newMilestones)
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

  const onUpdatePredictions = (newPredictions: CoinPrediction[]) => {
    setPredictions(newPredictions)
    localStorage.setItem("predictions", JSON.stringify(newPredictions))
  }

  return (
    <div className="py-4 bg-gray-900 text-gray-100 min-h-screen">
      <div className="flex">
        <Sidebar
          predictions={predictions}
          activePredictionId={activePredictionId}
          onAddPrediction={handleAddPrediction}
          onRemovePrediction={handleRemovePrediction}
          onSelectPrediction={setActivePredictionId}
          onUpdatePredictions={onUpdatePredictions}
        />

        <div className="max-w-3xl mx-auto flex-1">
          <CoinDataForm prediction={prediction} onChange={updateCoinDataForm} />

          <div className="flex gap-8">
            <div className="w-1/2 space-y-2">
              <h3 className="text-xl font-bold mb-2 text-gray-100">
                Profit-Taking Strategy:
              </h3>

              <MilestoneList
                milestones={sortedTargets}
                onRemoveTarget={handleRemoveTarget}
              />

              <AddTargetForm
                onSubmit={handleAddTarget}
                onMarketCapChange={(value) => {
                  setNewTarget({ ...newTarget, marketCap: value })
                }}
                profitPercent={newTarget.profitPercent}
                onProfitPercentChange={(value) =>
                  setNewTarget({ ...newTarget, profitPercent: value })
                }
              />
            </div>

            <PredictionCharts data={sortedTargets.slice(1)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

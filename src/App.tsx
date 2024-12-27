import { useContext, useState } from "react"
import { PredictionCharts } from "./components/PredictionCharts"
import { MilestoneList } from "./components/MilestoneList"
import { AddTargetForm } from "./components/AddTargetForm"
import { Sidebar } from "./components/Sidebar/Sidebar"
import { CoinDataForm } from "./components/CoinDataForm"
import { PredictionsContext } from "./PredictionsContext"

const App = () => {
  const {
    prediction,
    sortedTargets,
    activePredictionId,
    predictions,
    coinDataForm,
    updateCoinDataForm,
    updateMilestones,
    setPredictions,
  } = useContext(PredictionsContext)

  const [newTarget, setNewTarget] = useState({ marketCap: 0, profitPercent: 0 })

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

  const handleRemoveTarget = (index: number) => {
    const newMilestones = [...prediction.milestones]
    newMilestones.splice(index, 1)
    updateMilestones(newMilestones)
  }

  return (
    <div className="py-4 bg-gray-900 text-gray-100 min-h-screen">
      <div className="flex">
        <Sidebar />

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

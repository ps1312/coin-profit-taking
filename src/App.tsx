import { useEffect, useState } from "react"
import { PredictionCharts } from "./components/PredictionCharts"
import { MilestoneList } from "./components/MilestoneList"
import { AddTargetForm } from "./components/AddTargetForm"
import { CoinPrediction, Milestone } from "./types"
import { Sidebar } from "./components/Sidebar"
import { CoinDataForm } from "./components/CoinDataForm"

export interface CoinDataFormFields {
  holdings: number
  marketCap: number
}

const App = () => {
  const [predictions, setPredictions] = useState<CoinPrediction[]>([
    {
      id: "1",
      name: "Prediction 1",
      coinData: { price: "", marketCap: "" },
      holdingsData: { total: "", avgPrice: "" },
      customTargets: [],
    },
  ])

  const [activePredictionId, setActivePredictionId] = useState("1")

  const getStoredCoinDataForm = () => {
    const initialCoinDataForm = {
      holdings: 0,
      marketCap: 0,
    }

    const storedCoinDataForm = localStorage.getItem("coinDataForm")
    return storedCoinDataForm
      ? JSON.parse(storedCoinDataForm)
      : initialCoinDataForm
  }

  const [coinDataForm, setCoinDataForm] = useState<CoinDataFormFields>(
    getStoredCoinDataForm()
  )

  const [newTarget, setNewTarget] = useState({
    marketCap: 0,
    profitPercent: 0,
  })

  const getStoredMilestones = () => {
    const initialMilestone = [
      {
        multiplier: 1,
        holdings: 0,
        profit: 0,
        profitPercent: 0,
        marketCap: 0,
      },
    ]
    const storedMilestones = localStorage.getItem("milestones")
    return storedMilestones ? JSON.parse(storedMilestones) : initialMilestone
  }

  const [milestones, setMilestones] = useState<Milestone[]>(
    getStoredMilestones()
  )

  useEffect(() => {
    localStorage.setItem("coinDataForm", JSON.stringify(coinDataForm))
    localStorage.setItem("milestones", JSON.stringify(milestones))
  }, [milestones])

  useEffect(() => {
    // ask if its ok to reset the milestones state
    if (milestones.length > 1) {
      const reset = window.confirm(
        "Changing the coin data will reset the profit-taking strategy. Do you want to proceed?"
      )

      if (reset) {
        setMilestones([
          {
            multiplier: 1,
            holdings: coinDataForm.holdings,
            profit: 0,
            profitPercent: 0,
            marketCap: coinDataForm.marketCap,
          },
        ])
      }
    }
  }, [coinDataForm])

  const sortedTargets = milestones.sort((a, b) => a.marketCap - b.marketCap)

  const handleAddPrediction = () => {
    const newId = (predictions.length + 1).toString()

    setPredictions([
      ...predictions,
      {
        id: newId,
        name: `Prediction ${newId}`,
        coinData: { price: "", marketCap: "" },
        holdingsData: { total: "", avgPrice: "" },
        customTargets: [],
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

    const previousMilestone = milestones[milestones.length - 1]
    let multiplier = newTarget.marketCap / previousMilestone.marketCap
    let holdings = previousMilestone.holdings * multiplier
    let profit = holdings * (newTarget.profitPercent / 100)

    const newMilestone: Milestone = {
      multiplier,
      holdings: holdings - profit,
      profit,
      profitPercent: newTarget.profitPercent,
      marketCap: newTarget.marketCap,
    }

    setMilestones([...milestones, newMilestone])
  }

  const handleRemoveTarget = (index: number) => {
    const newMilestones = [...milestones]
    newMilestones.splice(index, 1)
    setMilestones(newMilestones)
  }

  const updateCoinDataForm = (
    name: "holdings" | "marketCap",
    value: number
  ) => {
    setCoinDataForm((prev) => ({ ...prev, [name]: value }))

    const newMilestones = [...milestones]
    newMilestones[0][name] = value
    setMilestones(newMilestones)
  }

  const prediction = predictions.find((p) => p.id === activePredictionId)!

  return (
    <div className="w-screen p-4 bg-gray-900 text-gray-100 min-h-screen">
      <div className="flex">
        <Sidebar
          predictions={predictions}
          activePredictionId={activePredictionId}
          onAddPrediction={handleAddPrediction}
          onRemovePrediction={handleRemovePrediction}
          onSelectPrediction={setActivePredictionId}
        />

        <div className="max-w-3xl mx-auto flex-1">
          <CoinDataForm
            initialValue={coinDataForm}
            prediction={prediction}
            onChange={updateCoinDataForm}
          />

          <div className="flex gap-8">
            <PredictionCharts data={sortedTargets} />

            <div className="w-1/2 space-y-2">
              <h3 className="text-xl font-bold mb-4 text-gray-100">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

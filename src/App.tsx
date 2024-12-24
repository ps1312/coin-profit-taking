import { useEffect, useState } from "react"
import { PredictionForm } from "./components/PredictionForm"
import { PredictionCharts } from "./components/PredictionCharts"
import { MilestoneList } from "./components/MilestoneList"
import { AddTargetForm } from "./components/AddTargetForm"
import { CoinPrediction, Milestone } from "./types"
import { Sidebar } from "./components/Sidebar"

interface CoinDataForm {
  holdings: string
  currentMarketCap: number
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

  const [coinDataForm, setCoinDataForm] = useState<CoinDataForm>({
    holdings: "",
    currentMarketCap: 0,
  })

  const [coinData, setCoinData] = useState({
    price: "",
    marketCap: "",
  })

  const [holdingsData, setHoldingsData] = useState({
    total: "",
    avgPrice: "",
  })

  const [newTarget, setNewTarget] = useState({
    marketCap: 0,
    profitPercent: "",
  })

  const initialCoins = Math.round(
    parseFloat(holdingsData.total) / parseFloat(holdingsData.avgPrice)
  )

  const [customTargets, setCustomTargets] = useState<Milestone[]>([
    {
      name: "Today",
      marketCap: coinDataForm.currentMarketCap,
      price: 0,
      portfolioValue: 0,
      cumulativeRealizedProfit: 0,
      unrealizedProfit: 0,
      realizedProfit: 0,
      action: "Hold",
      holdingPercentage: 100,
    },
  ])

  // Update data when changing sidebar item
  useEffect(() => {
    const prediction = predictions.find((p) => p.id === activePredictionId)

    if (prediction) {
      setCoinData({ ...prediction.coinData })
      setHoldingsData({ ...prediction.holdingsData })
    }
  }, [activePredictionId])

  const sortedTargets = customTargets.sort((a, b) => a.marketCap - b.marketCap)

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

  const getPreviousTarget = (marketCap: number) =>
    sortedTargets.filter((t) => t.marketCap < marketCap).pop()

  const calculateCoinPrice = (targetMarketCap: number) =>
    parseFloat(coinData.price) *
    (targetMarketCap / parseFloat(coinData.marketCap))

  const calculateRealizedProfit = (
    portfolioValue: number,
    profitPercent: number
  ) => {
    return portfolioValue * (profitPercent / 100)
  }

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault()

    const targetMarketCap = newTarget.marketCap
    const profitPercent = parseFloat(newTarget.profitPercent)

    const previousTarget = getPreviousTarget(targetMarketCap)
    const previousHolding = previousTarget?.holdingPercentage ?? 100

    const coinPrice = calculateCoinPrice(targetMarketCap)
    const remainingCoins = initialCoins * (previousHolding / 100)
    const initialPortfolioValue = Math.round(remainingCoins * coinPrice)

    const realizedProfit = calculateRealizedProfit(
      initialPortfolioValue,
      profitPercent
    )
    const holdingPercentage = Math.max(previousHolding - profitPercent, 0)
    const cumulativeRealizedProfit =
      previousTarget?.cumulativeRealizedProfit ?? 0 + realizedProfit
    const unrealizedProfit = initialPortfolioValue - realizedProfit

    const newMilestone: Milestone = {
      name: `${targetMarketCap}`,
      marketCap: targetMarketCap,
      price: coinPrice,
      portfolioValue: initialPortfolioValue,
      holdingPercentage,
      action: `Sell ${profitPercent}%`,
      realizedProfit,
      cumulativeRealizedProfit,
      unrealizedProfit,
    }

    setCustomTargets([...customTargets, newMilestone])
  }

  const handleRemoveTarget = (marketCap: number) => {
    setCustomTargets(
      customTargets.filter((target) => target.marketCap !== marketCap)
    )
  }

  const currentValue = initialCoins * parseFloat(coinData.price || "0")

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
          <PredictionForm
            prediction={prediction}
            initialCoins={initialCoins}
            currentValue={currentValue}
            onChange={() => {}}
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
                onMarketCapChange={(_, value) => {
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

import { useEffect, useState } from "react"
import { ChangeHandler } from "./components/MoneyInput"
import { PredictionForm } from "./components/PredictionForm"
import { PredictionCharts } from "./components/PredictionCharts"
import { MilestoneList } from "./components/MilestoneList"
import { AddTargetForm } from "./components/AddTargetForm"
import { CoinPrediction, Milestone } from "./types"
import { Sidebar } from "./components/Sidebar"

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

  const [customTargets, setCustomTargets] = useState<Milestone[]>([])

  useEffect(() => {
    const prediction = predictions.find((p) => p.id === activePredictionId)

    if (prediction) {
      setCoinData({ ...prediction.coinData })
      setHoldingsData({ ...prediction.holdingsData })
    }
  }, [activePredictionId])

  const initialCoins = Math.round(
    parseFloat(holdingsData.total) / parseFloat(holdingsData.avgPrice)
  )

  const baseTargets: Milestone[] =
    coinData.price && coinData.marketCap
      ? [
          {
            name: "Current",
            marketCap: parseFloat(coinData.marketCap),
            price: parseFloat(coinData.price),
            portfolioValue: Math.round(
              initialCoins * parseFloat(coinData.price)
            ),
            cumulativeRealizedProfit: 0,
            unrealizedProfit: 0,
            realizedProfit: 0,
            action: "Hold",
            holdingPercentage: 100,
          },
        ]
      : []

  const sortedTargets = [...baseTargets, ...customTargets].sort(
    (a, b) => a.marketCap - b.marketCap
  )

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

  const multiplierFromInitialMarketCap = (targetMarketCap: number) =>
    parseFloat(coinData.marketCap) > 0
      ? targetMarketCap / parseFloat(coinData.marketCap)
      : 0

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault()

    const marketCap = newTarget.marketCap
    const profitPercent = parseFloat(newTarget.profitPercent)

    const previousTarget = sortedTargets
      .filter((t) => t.marketCap < marketCap)
      .pop()
    const previousHolding = previousTarget?.holdingPercentage ?? 100

    const coinPrice =
      parseFloat(coinData.price) * multiplierFromInitialMarketCap(marketCap)

    const remainingCoins = initialCoins * (previousHolding / 100)

    const initialPortfolioValue = Math.round(remainingCoins * coinPrice)

    let portfolioValue = initialPortfolioValue

    const realizedProfit = portfolioValue * (profitPercent / 100)
    const holdingPercentage = Math.max(previousHolding - profitPercent, 0)
    const previousCumulativeProfit =
      previousTarget?.cumulativeRealizedProfit ?? 0
    const cumulativeRealizedProfit = previousCumulativeProfit + realizedProfit
    const unrealizedProfit = initialPortfolioValue - realizedProfit

    const newMilestone: Milestone = {
      name: `${marketCap}`,
      marketCap,
      price: coinPrice,
      portfolioValue,
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

  const handleHoldingsDataChange: ChangeHandler = (name, value) => {
    setHoldingsData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setPredictions(
      predictions.map((p) => {
        if (p.id === activePredictionId) {
          return {
            ...p,
            holdingsData: {
              ...p.holdingsData,
              [name]: value.toString(),
            },
          }
        }

        return p
      })
    )
  }

  const handleCoinDataChange: ChangeHandler = (name, value) => {
    setCoinData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setPredictions(
      predictions.map((p) => {
        if (p.id === activePredictionId) {
          return {
            ...p,
            coinData: {
              ...p.coinData,
              [name]: value.toString(),
            },
          }
        }

        return p
      })
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
            onCoinDataChange={handleCoinDataChange}
            onHoldingsDataChange={handleHoldingsDataChange}
          />

          {currentValue > 0 && (
            <div className="flex gap-8">
              <PredictionCharts data={sortedTargets} />

              <div className="w-1/2">
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
          )}
        </div>
      </div>
    </div>
  )
}

export default App

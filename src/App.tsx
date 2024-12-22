import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import MoneyInput, { ChangeHandler } from "./MoneyInput"
import { CRTTerminal } from "./CRTTerminal"

interface Milestone {
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

type FormatOptions = {
  decimals?: number
  currency?: boolean
}

const App = () => {
  const [coinData, setCoinData] = useState({
    price: "",
    marketCap: "",
  })

  const [holdingsData, setHoldingsData] = useState({
    total: "",
    avgPrice: "",
  })

  const initialCoins = Math.round(
    parseFloat(holdingsData.total || "0") /
      parseFloat(holdingsData.avgPrice || "1")
  )

  const multiplierFromInitialMarketCap = (targetMarketCap: number) =>
    parseFloat(coinData.marketCap) > 0
      ? targetMarketCap / parseFloat(coinData.marketCap)
      : 0

  const [newTarget, setNewTarget] = useState({
    marketCap: 0,
    profitPercent: "",
  })
  const [customTargets, setCustomTargets] = useState<Milestone[]>([])

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
  }

  const handleCoinDataChange: ChangeHandler = (name, value) => {
    setCoinData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const formatLargeNumber = (
    num: number,
    options: FormatOptions = {}
  ): string => {
    const { decimals = 1, currency = false } = options
    const prefix = currency ? "$" : ""
    const absNum = Math.abs(num)
    const sign = num < 0 ? "-" : ""

    if (absNum >= 1_000_000_000) {
      const value = (absNum / 1_000_000_000).toFixed(decimals)
      return `${sign}${prefix}${value}B`
    }

    if (absNum >= 1_000_000) {
      const value = (absNum / 1_000_000).toFixed(decimals)
      return `${sign}${prefix}${value}M`
    }

    return `${sign}${prefix}${absNum.toLocaleString()}`
  }

  const currentValue = initialCoins * parseFloat(coinData.price || "0")

  return (
    <div className="w-screen p-4 bg-gray-900 text-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-100">
            Coin Profit-Taking Strategy
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Coin Price ($)
              </label>
              <MoneyInput name="price" onChange={handleCoinDataChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Coin Market Cap ($)
              </label>
              <MoneyInput name="marketCap" onChange={handleCoinDataChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Investment ($)
              </label>
              <MoneyInput name="total" onChange={handleHoldingsDataChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Average Coin Price ($)
              </label>
              <MoneyInput name="avgPrice" onChange={handleHoldingsDataChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Total Coins
              </label>
              <div className="mt-1 block w-full p-2 bg-gray-800 rounded-md border border-gray-700">
                {initialCoins > 0 ? initialCoins.toLocaleString() : "-"}
              </div>
            </div>
          </div>

          {currentValue > 0 && (
            <p className="text-green-400">
              Current Value: $ {Math.round(currentValue).toLocaleString()}
            </p>
          )}
        </div>

        {currentValue > 0 && (
          <div className="flex gap-8">
            <div className="w-1/2 space-y-8">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedTargets}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        color: "#F3F4F6",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="portfolioValue"
                      fill="#34D399"
                      name="Portfolio Value ($)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sortedTargets}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        color: "#F3F4F6",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="holdingPercentage"
                      stroke="#60A5FA"
                      name="Holdings Remaining (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-1/2">
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Profit-Taking Strategy:
              </h3>

              <div className="space-y-2">
                {sortedTargets.map((milestone, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-700 rounded bg-gray-800"
                  >
                    {index > 0 && (
                      <p className="font-bold text-2xl text-gray-100">
                        {milestone.marketCap /
                          sortedTargets[index - 1].marketCap}
                        x
                      </p>
                    )}

                    <p className="font-medium text-gray-200">
                      At ${formatLargeNumber(milestone.marketCap)} Market Cap ($
                      {milestone.price.toFixed(4)} per coin):
                    </p>
                    <p className="text-gray-300">
                      Holdings Value: $
                      {milestone.portfolioValue.toLocaleString()}
                    </p>
                    <p className="text-gray-300">Action: {milestone.action}</p>
                    <p className="text-gray-300">
                      Remaining Holdings: {milestone.holdingPercentage}%
                    </p>

                    {milestone.realizedProfit > 0 && (
                      <>
                        <p>
                          Profit from this sale:{" "}
                          <span className="text-green-400 font-bold">
                            ${milestone.realizedProfit.toLocaleString()}
                          </span>
                        </p>
                        <p className="flex items-center gap-1 text-gray-300">
                          Total Realized Profit:
                          <CRTTerminal>
                            $
                            {milestone.cumulativeRealizedProfit.toLocaleString()}
                          </CRTTerminal>
                        </p>
                      </>
                    )}

                    <p className="text-gray-300">
                      Unrealized Profit: $
                      {milestone.unrealizedProfit.toLocaleString()}
                    </p>

                    {index > 0 && (
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            handleRemoveTarget(milestone.marketCap)
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-gray-100">
                    Add Profit Target
                  </h3>

                  <form
                    onSubmit={handleAddTarget}
                    className="flex flex-wrap gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Market Cap ($)
                      </label>
                      <MoneyInput
                        name="newMarketCap"
                        onChange={(_, value) => {
                          setNewTarget({ ...newTarget, marketCap: value })
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Profit % to Take
                      </label>
                      <input
                        type="number"
                        step="1"
                        className="mt-1 block w-48 rounded-md border border-gray-700 bg-gray-700 p-2 text-gray-100"
                        placeholder="e.g. 20"
                        value={newTarget.profitPercent}
                        onChange={(e) =>
                          setNewTarget({
                            ...newTarget,
                            profitPercent: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Add Target
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

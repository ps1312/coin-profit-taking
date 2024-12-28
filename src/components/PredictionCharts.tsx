import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { CRTTerminal } from "./CRTTerminal"
import { useContext } from "react"
import { PredictionsContext } from "../PredictionsContext"
import { formatCurrency, getCurrencyMultiplier } from "../utils"

export const PredictionCharts = () => {
  const { prediction, showInReais } = useContext(PredictionsContext)

  const formattedData = prediction.milestones.map((milestone) => ({
    ...milestone,
    profit: (milestone.profit * getCurrencyMultiplier(showInReais)).toFixed(2),
  }))

  const profitSum = prediction.milestones.reduce(
    (acc, milestone) => acc + milestone.profit,
    0
  )

  const profitPerHolding = profitSum / prediction.coinData.holdings

  return (
    <div className="w-1/2 space-y-8">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
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
            <Bar dataKey="profit" fill="#34D399" name="Profit" />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex justify-center mt-2">
          <CRTTerminal>
            {`Total profit: ${formatCurrency(profitSum, showInReais)}`} (
            {formatCurrency(profitPerHolding, showInReais)} per holding)
          </CRTTerminal>
        </div>
      </div>
    </div>
  )
}

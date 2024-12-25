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
import { Milestone } from "../types"
import { CRTTerminal } from "./CRTTerminal"

interface PredictionChartsProps {
  data: Milestone[]
}

export const PredictionCharts = ({ data }: PredictionChartsProps) => {
  const formattedData = data.map((milestone) => ({
    ...milestone,
    profit: milestone.profit.toFixed(2),
  }))

  const profitSum = data.reduce((acc, milestone) => acc + milestone.profit, 0)

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
          <CRTTerminal>{`Total profit: $${profitSum.toFixed(2)}`}</CRTTerminal>
        </div>
      </div>
    </div>
  )
}

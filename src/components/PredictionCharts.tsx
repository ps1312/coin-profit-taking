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
import { Milestone } from "../types"

interface PredictionChartsProps {
  data: Milestone[]
}

export const PredictionCharts = ({ data }: PredictionChartsProps) => {
  return (
    <div className="w-1/2 space-y-8">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
          <LineChart data={data}>
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
  )
}

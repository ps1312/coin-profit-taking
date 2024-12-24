import { useState } from "react"
import { CoinPrediction } from "../types"
import { ChangeHandler } from "./MoneyInput"
import { convertToFloat, formatStringToValue } from "../utils"

interface PredictionFormProps {
  prediction: CoinPrediction
  initialCoins: number
  currentValue: number
  onChange: ChangeHandler
}

export const PredictionForm = ({
  prediction,
  onChange,
}: PredictionFormProps) => {
  const [predictionForm, setPredictionForm] = useState({
    portfolioValue: "",
    marketCap: "",
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, convertToFloat(e.target.value))
    setPredictionForm((prev) => ({
      ...prev,
      [e.target.name]: `$ ${formatStringToValue(e.target.value)}`,
    }))
  }

  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-2xl font-bold text-gray-100">
        {prediction.name} - Profit-Taking Strategy
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Holdings
          </label>

          <input
            name="portfolioValue"
            type="text"
            value={predictionForm.portfolioValue}
            className="mt-1 block w-full rounded-md border bg-gray-800 border-gray-300 p-2"
            onChange={handleFormChange}
            placeholder="$ 0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Coin Market Cap ($)
          </label>

          <input
            name="marketCap"
            type="text"
            value={predictionForm.marketCap}
            className="mt-1 block w-full rounded-md border bg-gray-800 border-gray-300 p-2"
            onChange={handleFormChange}
            placeholder="$ 0.00"
          />
        </div>
      </div>
    </div>
  )
}

import { useContext } from "react"
import {
  formatCurrency,
  formatLargeNumber,
  getCurrencyMultiplier,
  getCurrencySymbol,
} from "../utils"
import { PredictionsContext } from "../PredictionsContext"

export const MilestoneList = () => {
  const { prediction, handleRemoveTarget, showInReais, setShowInReais } =
    useContext(PredictionsContext)

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={showInReais}
          onChange={() => setShowInReais(!showInReais)}
          className="form-checkbox"
        />
        <span className="text-sm text-gray-300">Show in R$</span>
      </label>

      {prediction.milestones.map((milestone, index) => (
        <div
          key={index}
          className="p-2 border border-gray-700 rounded bg-gray-800"
        >
          <p className="text-lg font-medium text-gray-300">
            At{" "}
            <span className="underline">
              {getCurrencySymbol(showInReais)}
              {formatLargeNumber(
                milestone.marketCap * getCurrencyMultiplier(showInReais)
              )}
            </span>{" "}
            Market Cap
            {index > 0 && " (" + milestone.multiplier.toFixed(2) + "x)"}
          </p>

          <p className="text-gray-300">
            Holdings:{" "}
            {formatCurrency(milestone.holdings + milestone.profit, showInReais)}
          </p>

          {milestone.profit > 0 && (
            <p className="flex items-center gap-1 text-gray-300">
              Take profits ({milestone.profitPercent}%):{" "}
              <span className="text-green-400 font-medium">
                {formatCurrency(milestone.profit, showInReais)} 💰
              </span>
            </p>
          )}

          {index > 0 && (
            <p className="text-gray-300">
              New holdings: {formatCurrency(milestone.holdings, showInReais)}
            </p>
          )}

          {index > 0 && (
            <div className="flex justify-end">
              <button
                onClick={() => handleRemoveTarget(index)}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

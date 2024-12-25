import { useState } from "react"
import { Milestone } from "../types"
import { formatLargeNumber } from "../utils"

interface MilestoneListProps {
  initialMarketCap: number
  milestones: Milestone[]
  onRemoveTarget: (index: number) => void
}

export const MilestoneList = ({
  initialMarketCap,
  milestones,
  onRemoveTarget,
}: MilestoneListProps) => {
  const [showInReais, setShowInReais] = useState(false)

  const multiplier = showInReais ? 6.1 : 1
  const currencySymbol = showInReais ? "R$" : "$"

  const formatCurrency = (value: number) => {
    return (value * multiplier).toLocaleString(
      showInReais ? "pt-BR" : "en-US",
      {
        style: "currency",
        currency: showInReais ? "BRL" : "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    )
  }

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

      {milestones.map((milestone, index) => (
        <div
          key={index}
          className="p-2 border border-gray-700 rounded bg-gray-800"
        >
          <p className="text-lg font-medium text-gray-300">
            At{" "}
            <span className="underline">
              {currencySymbol}
              {formatLargeNumber(milestone.marketCap * multiplier)}
            </span>{" "}
            Market Cap
            {index > 0 && " (" + milestone.multiplier.toFixed(2) + "x)"}
          </p>

          <p className="text-gray-300">
            Holdings: {formatCurrency(milestone.holdings + milestone.profit)}
          </p>

          {milestone.profit > 0 && (
            <p className="flex items-center gap-1 text-gray-300">
              Take profits ({milestone.profitPercent}%):{" "}
              <span className="text-green-400 font-medium">
                {formatCurrency(milestone.profit)} 💰
              </span>
            </p>
          )}

          {index > 0 && (
            <p className="text-gray-300">
              New holdings: {formatCurrency(milestone.holdings)}
            </p>
          )}

          {index > 0 && (
            <div className="flex justify-end">
              <button
                onClick={() => onRemoveTarget(index)}
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

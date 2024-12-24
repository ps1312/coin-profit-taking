import { CoinDataForm } from "../App"
import { Milestone } from "../types"
import { formatLargeNumber } from "../utils"
import { CRTTerminal } from "./CRTTerminal"

interface MilestoneListProps {
  coinData: CoinDataForm
  milestones: Milestone[]
  onRemoveTarget: (marketCap: number) => void
}

export const MilestoneList = ({
  coinData,
  milestones,
  onRemoveTarget,
}: MilestoneListProps) => {
  return (
    <div className="space-y-2">
      {milestones.map((milestone, index) => {
        const newHoldings = Math.max(0, milestone.holdings - milestone.profit)

        return (
          <div
            key={index}
            className="p-2 border border-gray-700 rounded bg-gray-800"
          >
            <p className="text-lg font-medium text-gray-300">
              At{" "}
              <span className="underline">
                ${formatLargeNumber(milestone.marketCap)}
              </span>{" "}
              Market Cap
              {index > 0 && " (" + milestone.multiplier.toFixed(2) + "x)"}
            </p>

            <p className="text-gray-300">
              Holdings Value: ${milestone.holdings.toLocaleString()}
            </p>

            <p className="text-gray-300">
              Profit taken: {milestone.profitPercent}%
            </p>

            {milestone.profit > 0 && (
              <p className="flex items-center gap-1 text-gray-300">
                Profit from this sale:{" "}
                <span className="text-green-400 font-medium">
                  ${milestone.profit.toLocaleString()}
                </span>
              </p>
            )}

            <p className="text-gray-300">
              New holdings: ${newHoldings.toLocaleString()}
            </p>

            {index > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={() => onRemoveTarget(milestone.marketCap)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

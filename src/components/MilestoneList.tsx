import { Milestone } from "../types"
import { formatLargeNumber } from "../utils"

interface MilestoneListProps {
  milestones: Milestone[]
  onRemoveTarget: (index: number) => void
}

export const MilestoneList = ({
  milestones,
  onRemoveTarget,
}: MilestoneListProps) => {
  return (
    <div className="space-y-2">
      {milestones.map((milestone, index) => (
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
            Holdings: $
            {(milestone.holdings + milestone.profit).toLocaleString()}
          </p>

          {milestone.profit > 0 && (
            <p className="flex items-center gap-1 text-gray-300">
              Take profits ({milestone.profitPercent}%):{" "}
              <span className="text-green-400 font-medium">
                ${milestone.profit.toLocaleString()} 💰
              </span>
            </p>
          )}

          {index > 0 && (
            <p className="text-gray-300">
              New holdings: ${milestone.holdings.toLocaleString()}
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

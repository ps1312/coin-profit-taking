import { Milestone } from "../types"
import { formatLargeNumber } from "../utils"
import { CRTTerminal } from "./CRTTerminal"

interface MilestoneListProps {
  milestones: Milestone[]
  onRemoveTarget: (marketCap: number) => void
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
          className="p-4 border border-gray-700 rounded bg-gray-800"
        >
          {index > 0 && (
            <p className="font-bold text-2xl text-gray-100">
              {milestone.marketCap / milestones[index - 1].marketCap}x
            </p>
          )}

          <p className="font-medium text-gray-200">
            At ${formatLargeNumber(milestone.marketCap)} Market Cap ($
            {milestone.price.toFixed(4)} per coin):
          </p>
          <p className="text-gray-300">
            Holdings Value: ${milestone.portfolioValue.toLocaleString()}
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
                  ${milestone.cumulativeRealizedProfit.toLocaleString()}
                </CRTTerminal>
              </p>
            </>
          )}

          <p className="text-gray-300">
            Unrealized Profit: ${milestone.unrealizedProfit.toLocaleString()}
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
      ))}
    </div>
  )
}

import MoneyInput from "./MoneyInput"
import { ChangeHandler } from "./MoneyInput"

interface PredictionFormProps {
  predictionName: string
  initialCoins: number
  currentValue: number
  onCoinDataChange: ChangeHandler
  onHoldingsDataChange: ChangeHandler
}

export const PredictionForm = ({
  predictionName,
  initialCoins,
  currentValue,
  onCoinDataChange,
  onHoldingsDataChange,
}: PredictionFormProps) => {
  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-2xl font-bold text-gray-100">
        {predictionName} - Profit-Taking Strategy
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Coin Price ($)
          </label>
          <MoneyInput name="price" onChange={onCoinDataChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Coin Market Cap ($)
          </label>
          <MoneyInput name="marketCap" onChange={onCoinDataChange} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Investment ($)
          </label>
          <MoneyInput name="total" onChange={onHoldingsDataChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Average Coin Price ($)
          </label>
          <MoneyInput name="avgPrice" onChange={onHoldingsDataChange} />
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
          Current Value: ${Math.round(currentValue).toLocaleString()}
        </p>
      )}
    </div>
  )
}

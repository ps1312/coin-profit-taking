import { useState } from "react"
import { convertToFloat, formatStringToValue } from "../utils"

interface AddTargetFormProps {
  onSubmit: (e: React.FormEvent) => void
  onMarketCapChange: (name: string, value: number) => void
  profitPercent: string
  onProfitPercentChange: (value: string) => void
}

export const AddTargetForm = ({
  onSubmit,
  onMarketCapChange,
  profitPercent,
  onProfitPercentChange,
}: AddTargetFormProps) => {
  const [targetMarketCap, setNewTargetMarketCap] = useState("")

  const handleMarketCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMarketCapChange(e.target.name, convertToFloat(e.target.value))
    setNewTargetMarketCap(`$ ${formatStringToValue(e.target.value)}`)
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">
        Add Profit Target
      </h3>

      <form onSubmit={onSubmit} className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Market Cap ($)
          </label>

          <input
            name="newMarketCap"
            type="text"
            value={targetMarketCap}
            className="mt-1 block w-full rounded-md border bg-gray-800 border-gray-300 p-2"
            onChange={handleMarketCapChange}
            placeholder="$ 0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Profit % to Take
          </label>
          <input
            type="number"
            step="1"
            className="mt-1 block w-48 rounded-md border border-gray-700 bg-gray-700 p-2 text-gray-100"
            placeholder="e.g. 20"
            value={profitPercent}
            onChange={(e) => onProfitPercentChange(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Target
          </button>
        </div>
      </form>
    </div>
  )
}

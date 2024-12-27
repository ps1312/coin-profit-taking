import { useContext, useEffect, useState } from "react"
import { convertToFloat, formatStringToValue } from "../utils"
import { PredictionsContext } from "../PredictionsContext"

export const AddTargetForm = () => {
  const { newTarget, setNewTarget, handleAddMilestone } =
    useContext(PredictionsContext)

  const [addTargetForm, setAddTargetForm] = useState({
    targetMarketCap: "",
    profitPercent: "",
  })

  const updateForm = () => {
    setAddTargetForm({
      targetMarketCap: `$ ${formatStringToValue(
        newTarget.marketCap.toString()
      )}`,
      profitPercent: newTarget.profitPercent.toString(),
    })
  }

  useEffect(updateForm, [newTarget])

  const handleMarketCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTarget({ ...newTarget, marketCap: convertToFloat(e.target.value) })
    updateForm()
  }

  const handleProfitPercentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTarget({ ...newTarget, profitPercent: parseInt(e.target.value) })
    updateForm()
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">
        Add Profit Target
      </h3>

      <form onSubmit={handleAddMilestone} className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Market Cap ($)
          </label>

          <input
            autoComplete="off"
            name="targetMarketCap"
            type="text"
            value={addTargetForm.targetMarketCap}
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
            className="mt-1 block w-48 rounded-md border border-gray-300 bg-gray-800 p-2 text-gray-100"
            placeholder="[0, 100]"
            min={0}
            max={100}
            value={addTargetForm.profitPercent}
            onChange={handleProfitPercentChange}
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

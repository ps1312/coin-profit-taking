import { CoinPrediction } from "../types"

interface SidebarProps {
  predictions: CoinPrediction[]
  activePredictionId: string
  onAddPrediction: () => void
  onRemovePrediction: (id: string) => void
  onSelectPrediction: (id: string) => void
  onPredictionNameUpdated: (newPredictions: CoinPrediction[]) => void
}

export const Sidebar = ({
  predictions,
  activePredictionId,
  onAddPrediction,
  onRemovePrediction,
  onSelectPrediction,
  onPredictionNameUpdated,
}: SidebarProps) => {
  const updatePredictionName = (id: string, name: string) => {
    const updatedPredictions = predictions.map((prediction) => {
      if (prediction.id === id) {
        return { ...prediction, name }
      }
      return prediction
    })

    onPredictionNameUpdated(updatedPredictions)
  }

  return (
    <div className="w-64 bg-gray-800 ml-2 p-4 rounded border border-gray-700 absolute left-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Predictions</h2>
        <button
          onClick={onAddPrediction}
          className="p-1 hover:text-blue-400"
          title="Add Prediction"
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className={`flex justify-between items-center p-2 rounded cursor-pointer ${
              prediction.id === activePredictionId
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
            onClick={() => onSelectPrediction(prediction.id)}
          >
            <input
              name={prediction.id}
              className="w-full bg-gray-900"
              type="text"
              defaultValue={prediction.name}
              onChange={(e) =>
                updatePredictionName(prediction.id, e.target.value)
              }
            />

            {predictions.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemovePrediction(prediction.id)
                }}
                className="p-1"
              >
                delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

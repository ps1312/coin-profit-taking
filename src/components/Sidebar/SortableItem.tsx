import { useContext } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash } from "lucide-react"
import { CoinPrediction } from "../../types"
import { PredictionsContext } from "../../PredictionsContext"

export default function SortableItem({
  showTrash,
  prediction,
}: {
  showTrash: boolean
  prediction: CoinPrediction
}) {
  const {
    activePredictionId,
    setActivePredictionId,
    handleRemovePrediction,
    predictions,
    setPredictions,
  } = useContext(PredictionsContext)

  const isActive = activePredictionId === prediction.id

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: prediction.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setActivePredictionId(prediction.id)
  }

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    handleRemovePrediction(prediction.id)
  }

  const handleNameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPredictions = predictions.map((p) => {
      if (p.id === prediction.id) {
        return { ...p, name: e.target.value }
      }
      return p
    })
    setPredictions(updatedPredictions)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-2 rounded ${
        isActive ? "bg-blue-600" : "hover:bg-gray-700"
      }`}
      onClick={handleSelect}
    >
      <div className="cursor-grab" {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>
      <div className="flex-1 flex justify-between items-center ml-2">
        <input
          name={prediction.id}
          className="w-full bg-gray-900"
          type="text"
          defaultValue={prediction.name}
          onChange={handleNameUpdate}
          onClick={handleSelect}
        />
        {showTrash && (
          <button onClick={handleRemove} className="p-1">
            <Trash className="ml-2 w-4 h-4 hover:text-red-500" />
          </button>
        )}
      </div>
    </div>
  )
}

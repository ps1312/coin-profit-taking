import { CoinPrediction } from "../types"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface SidebarProps {
  predictions: CoinPrediction[]
  activePredictionId: string
  onAddPrediction: () => void
  onRemovePrediction: (id: string) => void
  onSelectPrediction: (id: string) => void
  onUpdatePredictions: (newPredictions: CoinPrediction[]) => void
}

const SortableItem = ({
  prediction,
  isActive,
  onRemove,
  onSelect,
  onNameUpdate,
}: {
  prediction: CoinPrediction
  isActive: boolean
  onRemove: () => void
  onSelect: () => void
  onNameUpdate: (name: string) => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: prediction.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex justify-between items-center p-2 rounded cursor-pointer ${
        isActive ? "bg-blue-600" : "hover:bg-gray-700"
      }`}
      onClick={onSelect}
    >
      <input
        name={prediction.id}
        className="w-full bg-gray-900"
        type="text"
        defaultValue={prediction.name}
        onChange={(e) => onNameUpdate(e.target.value)}
      />
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="p-1"
      >
        delete
      </button>
    </div>
  )
}

export const Sidebar = ({
  predictions,
  activePredictionId,
  onAddPrediction,
  onRemovePrediction,
  onSelectPrediction,
  onUpdatePredictions,
}: SidebarProps) => {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = predictions.findIndex((p) => p.id === active.id)
    const newIndex = predictions.findIndex((p) => p.id === over.id)

    onUpdatePredictions(arrayMove(predictions, oldIndex, newIndex))
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={predictions.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {predictions.map((prediction) => (
              <SortableItem
                key={prediction.id}
                prediction={prediction}
                isActive={prediction.id === activePredictionId}
                onRemove={() => onRemovePrediction(prediction.id)}
                onSelect={() => onSelectPrediction(prediction.id)}
                onNameUpdate={(name) => {
                  const updatedPredictions = predictions.map((p) => {
                    if (p.id === prediction.id) {
                      return { ...p, name }
                    }
                    return p
                  })
                  onUpdatePredictions(updatedPredictions)
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

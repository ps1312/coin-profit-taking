import { useContext } from "react"
import { Clipboard, ClipboardPaste, Plus } from "lucide-react"
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import SortableItem from "./SortableItem"
import { PredictionsContext } from "../../PredictionsContext"

export const Sidebar = () => {
  const { predictions, setPredictions, handleAddPrediction } =
    useContext(PredictionsContext)

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = predictions.findIndex((p) => p.id === active.id)
    const newIndex = predictions.findIndex((p) => p.id === over.id)

    setPredictions(arrayMove(predictions, oldIndex, newIndex))
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(predictions))
    alert("Predictions copied to clipboard")
  }

  const handlePasteFromClipboard = () => {
    navigator.clipboard.readText().then((text) => {
      try {
        setPredictions(JSON.parse(text))
      } catch (error) {
        console.error("Invalid JSON")
      }
    })
  }

  return (
    <div className="w-64 bg-gray-800 ml-2 p-4 rounded border border-gray-700 xl:absolute left-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Predictions</h2>
        <div className="flex justify-center items-center gap-2">
          <button className="p-1 hover:text-blue-400" title="Copy">
            <Clipboard
              className="w-4 h-4 hover:text-blue-400"
              onClick={handleCopyToClipboard}
            />
          </button>

          <button className="p-1 hover:text-blue-400" title="Paste">
            <ClipboardPaste
              className="w-4 h-4 hover:text-blue-400"
              onClick={handlePasteFromClipboard}
            />
          </button>

          <button
            onClick={handleAddPrediction}
            className="p-1 hover:text-blue-400"
            title="Add"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
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
                showTrash={predictions.length > 1}
                prediction={prediction}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

import { PredictionCharts } from "./components/PredictionCharts"
import { MilestoneList } from "./components/MilestoneList"
import { AddTargetForm } from "./components/AddTargetForm"
import { Sidebar } from "./components/Sidebar/Sidebar"
import { CoinDataForm } from "./components/CoinDataForm"
import { RunesDisplay } from "./components/RunesDisplay"

const App = () => {
  const isRunesPath = window.location.pathname.includes("/runes")

  return (
    <div className="py-4 bg-gray-900 text-gray-100 min-h-screen">
      {isRunesPath ? (
        <RunesDisplay />
      ) : (
        <div className="flex">
          <Sidebar />

          <div className="max-w-3xl mx-auto flex-1">
            <CoinDataForm />

            <div className="flex gap-8">
              <div className="w-1/2 space-y-2">
                <h3 className="text-xl font-bold mb-2 text-gray-100">
                  Profit-Taking Strategy:
                </h3>

                <MilestoneList />

                <AddTargetForm />
              </div>

              <PredictionCharts />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

import { createContext, useState } from "react"

interface PredictionsContextType {
  activePredictionId: string
  setActivePredictionId: (id: string) => void
}

export const PredictionsContext = createContext<PredictionsContextType>({
  activePredictionId: "1",
  setActivePredictionId: () => { },
})

export const PredictionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [activePredictionId, setActivePredictionId] = useState("1")

  return <PredictionsContext.Provider value={{ activePredictionId, setActivePredictionId }}>{children}</PredictionsContext.Provider>
}

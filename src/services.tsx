export const getStoredPredictions = () => {
  const initialPredictions = [
    {
      id: "1",
      name: "Prediction 1",
      coinData: { holdings: 0, marketCap: 0 },
      milestones: [
        {
          multiplier: 1,
          holdings: 0,
          profit: 0,
          profitPercent: 0,
          marketCap: 0,
        },
      ],
    },
  ]

  const storedPredictions = localStorage.getItem("predictions")
  return storedPredictions ? JSON.parse(storedPredictions) : initialPredictions
}

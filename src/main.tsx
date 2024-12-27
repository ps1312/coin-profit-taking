import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PredictionsProvider } from './PredictionsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PredictionsProvider>
      <App />
    </PredictionsProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './components/LandingPage'
import { LoadingProvider } from './contexts/LoadingContext'
import LoadingOverlay from './components/LoadingOverlay'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <LoadingOverlay />
      <LandingPage />
    </LoadingProvider>
  </StrictMode>,
)

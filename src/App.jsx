import { StrictMode } from 'react'
import './index.css'
import LandingPage from './components/LandingPage'
import { LoadingProvider } from './contexts/LoadingContext'
import LoadingOverlay from './components/LoadingOverlay'

function App() {
  return (
    <StrictMode>
      <LoadingProvider>
        <LoadingOverlay />
        <LandingPage />
      </LoadingProvider>
    </StrictMode>
  )
}

export default App

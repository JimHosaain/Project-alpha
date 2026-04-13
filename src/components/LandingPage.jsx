import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import StackMarquee from './StackMarquee'
import SignUpPage from './SignUpPage'
import ChatbotPanel from './ChatbotPanel'
import BuildFlowStep from './BuildFlowStep'
import ManualBuilderPage from './ManualBuilderPage'
import HomeShowcaseSections from './HomeShowcaseSections'
import RevealOnView from './ui/RevealOnView'
import NotFoundPage from './ui/NotFoundPage'
import { useLoading } from '../contexts/LoadingContext'

const viewByPath = {
  '/': 'home',
  '/builder': 'builder',
  '/manual-builder': 'manualBuilder',
  '/signup': 'signup',
}

function getBasePath() {
  if (typeof window === 'undefined') {
    return '/'
  }

  const base = import.meta.env.BASE_URL || '/'
  return base.endsWith('/') ? base.slice(0, -1) || '/' : base
}

function normalizePathname(pathname) {
  const base = getBasePath()

  if (base !== '/' && pathname.startsWith(base)) {
    const trimmed = pathname.slice(base.length)
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  }

  return pathname
}

function toAppHref(path) {
  const base = getBasePath()
  const cleanPath = path === '/' ? '' : path

  if (base === '/') {
    return cleanPath || '/'
  }

  return `${base}${cleanPath}`
}

function getInitialView() {
  if (typeof window === 'undefined') {
    return 'home'
  }

  const appPath = normalizePathname(window.location.pathname)
  return viewByPath[appPath] ?? 'notFound'
}

function LandingPage() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const [view, setView] = useState(getInitialView)
  const [manualBuildContext, setManualBuildContext] = useState({
    presetId: 'manual',
    budget: 85000,
  })
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const { stopLoading } = useLoading()

  useEffect(() => {
    stopLoading()
  }, [view, stopLoading])

  useEffect(() => {
    const handlePopState = () => {
      const appPath = normalizePathname(window.location.pathname)
      setView(viewByPath[appPath] ?? 'notFound')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  const openSignUp = () => {
    window.history.pushState({}, '', toAppHref('/signup'))
    setView('signup')
  }

  const openBuilder = () => {
    window.history.pushState({}, '', toAppHref('/builder'))
    setView('builder')
  }

  const openManualBuilder = ({ presetId = 'manual', budget = 85000 } = {}) => {
    setManualBuildContext({ presetId, budget })
    window.history.pushState({}, '', toAppHref('/manual-builder'))
    setView('manualBuilder')
  }

  const goHome = () => {
    window.history.pushState({}, '', toAppHref('/'))
    setView('home')
  }

  const openChatbot = () => {
    setIsChatbotOpen(true)
  }

  const closeChatbot = () => {
    setIsChatbotOpen(false)
  }

  return (
    <main className="landing-page" data-theme={theme}>
      <div className="grid-overlay" aria-hidden="true" />

      <div className="content-shell">
        <RevealOnView>
          <Navbar
            theme={theme}
            onToggleTheme={toggleTheme}
            onLoginClick={openSignUp}
            onChatbotClick={openChatbot}
            onHomeClick={goHome}
            onBuildClick={openBuilder}
            activeView={view}
          />
        </RevealOnView>

        {view === 'home' ? (
          <>
            <RevealOnView delay={0.02} variant="hero">
              <HeroSection theme={theme} onBuildClick={openBuilder} />
            </RevealOnView>
            <RevealOnView delay={0.04} variant="soft">
              <StackMarquee />
            </RevealOnView>
            <RevealOnView delay={0.06} variant="lift">
              <HomeShowcaseSections onBenchmarkCompare={openBuilder} />
            </RevealOnView>
          </>
        ) : view === 'builder' ? (
          <RevealOnView>
            <BuildFlowStep onBack={goHome} onOpenManualBuilder={openManualBuilder} />
          </RevealOnView>
        ) : view === 'manualBuilder' ? (
          <RevealOnView>
            <ManualBuilderPage
              onBack={openBuilder}
              presetId={manualBuildContext.presetId}
              budget={manualBuildContext.budget}
            />
          </RevealOnView>
        ) : view === 'signup' ? (
          <RevealOnView>
            <SignUpPage
              onBack={goHome}
            />
          </RevealOnView>
        ) : (
          <RevealOnView>
            <NotFoundPage
              onBackClick={() => window.history.back()}
              onHomeClick={goHome}
            />
          </RevealOnView>
        )}
      </div>

      <ChatbotPanel open={isChatbotOpen} onClose={closeChatbot} />
    </main>
  )
}

export default LandingPage

import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import StackMarquee from './StackMarquee'
import SignUpPage from './SignUpPage'
import ChatbotPanel from './ChatbotPanel'
import BuildFlowStep from './BuildFlowStep'
import ManualBuilderPage from './ManualBuilderPage'
import ComponentSelector from './ComponentSelector'
import MyBuildsPage from './MyBuildsPage'
import PartsAdminPage from './PartsAdminPage'
import HomeShowcaseSections from './HomeShowcaseSections'
import RevealOnView from './ui/RevealOnView'
import NotFoundPage from './ui/NotFoundPage'
import { useLoading } from '../contexts/LoadingContext'

const viewByPath = {
  '/': 'home',
  '/builder': 'builder',
  '/manual-builder': 'manualBuilder',
  '/my-builds': 'myBuilds',
  '/parts': 'partsAdmin',
  '/signup': 'signup',
}

function getBasePath() {
  if (typeof window === 'undefined') return '/'
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
  return base === '/' ? cleanPath || '/' : `${base}${cleanPath}`
}

function getAppStateFromPath(pathname) {
  const appPath = normalizePathname(pathname)
  if (appPath.startsWith('/build/')) {
    return { view: 'buildStep', selectorStep: appPath.split('/build/')[1] || 'cpu' }
  }

  return { view: viewByPath[appPath] ?? 'notFound', selectorStep: null }
}

function getInitialAppState() {
  if (typeof window === 'undefined') return { view: 'home', selectorStep: null }
  return getAppStateFromPath(window.location.pathname)
}

function LandingPage() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const initialState = getInitialAppState()
  const [view, setView] = useState(initialState.view)
  const [selectorStep, setSelectorStep] = useState(initialState.selectorStep)
  const [manualBuildContext, setManualBuildContext] = useState({
    presetId: 'manual',
    budget: 85000,
    build: null,
  })
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [selectorContext, setSelectorContext] = useState(null)
  const { stopLoading } = useLoading()

  useEffect(() => {
    stopLoading()
  }, [view, stopLoading])

  useEffect(() => {
    const handlePopState = () => {
      const state = getAppStateFromPath(window.location.pathname)
      setView(state.view)
      setSelectorStep(state.selectorStep)
      if (state.view !== 'buildStep') setSelectorContext(null)
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
    setSelectorStep(null)
  }

  const openBuilder = () => {
    window.history.pushState({}, '', toAppHref('/builder'))
    setView('builder')
    setSelectorStep(null)
    setSelectorContext(null)
  }

  const openManualBuilder = ({ presetId = 'manual', budget = 85000, build = null } = {}) => {
    setManualBuildContext({ presetId, budget, build })
    window.history.pushState({}, '', toAppHref('/manual-builder'))
    setView('manualBuilder')
    setSelectorStep(null)
    setSelectorContext(null)
  }

  const openPartsAdmin = () => {
    window.history.pushState({}, '', toAppHref('/parts'))
    setView('partsAdmin')
    setSelectorStep(null)
    setSelectorContext(null)
  }

  const goHome = () => {
    window.history.pushState({}, '', toAppHref('/'))
    setView('home')
    setSelectorStep(null)
    setSelectorContext(null)
  }

  const openChatbot = () => setIsChatbotOpen(true)
  const closeChatbot = () => setIsChatbotOpen(false)

  const openMyBuilds = () => {
    window.history.pushState({}, '', toAppHref('/my-builds'))
    setView('myBuilds')
    setSelectorStep(null)
    setSelectorContext(null)
  }

  const requestOpenSelector = (step, { currentSelections = {}, onSelect } = {}) => {
    setSelectorContext({ step, currentSelections, onSelect })
    setSelectorStep(step)
    window.history.pushState({}, '', toAppHref(`/build/${step}`))
    setView('buildStep')
  }

  const closeSelector = () => {
    setSelectorContext(null)
    setSelectorStep(null)
    window.history.pushState({}, '', toAppHref('/manual-builder'))
    setView('manualBuilder')
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
            onPartsClick={openPartsAdmin}
            onMyBuildsClick={openMyBuilds}
            activeView={view}
          />
        </RevealOnView>

        {view === 'home' ? (
          <>
            <RevealOnView variant="hero">
              <HeroSection theme={theme} onBuildClick={openBuilder} />
            </RevealOnView>
            <RevealOnView variant="soft">
              <StackMarquee />
            </RevealOnView>
            <RevealOnView variant="lift">
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
              presetBuild={manualBuildContext.build}
              requestOpenSelector={requestOpenSelector}
            />
          </RevealOnView>
        ) : view === 'buildStep' ? (
          <ComponentSelector
            mode="page"
            step={selectorStep || 'cpu'}
            currentSelections={selectorContext?.currentSelections || {}}
            onBack={closeSelector}
            onSelect={(part) => {
              try {
                selectorContext?.onSelect && selectorContext.onSelect(part)
              } finally {
                closeSelector()
              }
            }}
          />
        ) : view === 'myBuilds' ? (
          <RevealOnView>
            <MyBuildsPage onBack={goHome} onLoadBuild={(build) => openManualBuilder({ presetId: 'manual', budget: 85000, build })} />
          </RevealOnView>
        ) : view === 'partsAdmin' ? (
          <RevealOnView>
            <PartsAdminPage onBack={goHome} />
          </RevealOnView>
        ) : view === 'signup' ? (
          <RevealOnView>
            <SignUpPage onBack={goHome} />
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

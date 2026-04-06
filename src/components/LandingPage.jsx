import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import StackMarquee from './StackMarquee'
import SignUpPage from './SignUpPage'
import ChatbotPanel from './ChatbotPanel'
import BuildFlowStep from './BuildFlowStep'
import HomeShowcaseSections from './HomeShowcaseSections'
import RevealOnView from './ui/RevealOnView'
import NotFoundPage from './ui/NotFoundPage'

const viewByPath = {
  '/': 'home',
  '/builder': 'builder',
  '/signup': 'signup',
}

function getInitialView() {
  if (typeof window === 'undefined') {
    return 'home'
  }

  return viewByPath[window.location.pathname] ?? 'notFound'
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
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  useEffect(() => {
    const handlePopState = () => {
      setView(viewByPath[window.location.pathname] ?? 'notFound')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  const openSignUp = () => {
    window.history.pushState({}, '', '/signup')
    setView('signup')
  }

  const openBuilder = () => {
    window.history.pushState({}, '', '/builder')
    setView('builder')
  }

  const goHome = () => {
    window.history.pushState({}, '', '/')
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
        {view === 'home' ? (
          <>
            <RevealOnView>
              <Navbar
                theme={theme}
                onToggleTheme={toggleTheme}
                onLoginClick={openSignUp}
                onChatbotClick={openChatbot}
                activeView={view}
              />
            </RevealOnView>
            <RevealOnView delay={0.05}>
              <HeroSection theme={theme} onBuildClick={openBuilder} />
            </RevealOnView>
            <RevealOnView delay={0.08}>
              <StackMarquee />
            </RevealOnView>
            <RevealOnView delay={0.1}>
              <HomeShowcaseSections onBenchmarkCompare={openBuilder} />
            </RevealOnView>
          </>
        ) : view === 'builder' ? (
          <RevealOnView>
            <BuildFlowStep onBack={goHome} />
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

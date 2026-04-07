import { useRef } from 'react'
import StarButton from './ui/StarButton'
import ThemeSwitchButton from './ui/ThemeSwitchButton'

function SignUpPage({
  onBack,
  onHomeClick,
  onBuildClick,
  onToggleTheme,
  onChatbotClick,
  theme,
}) {
  const emailInputRef = useRef(null)

  const focusSignUpForm = () => {
    if (emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }

  return (
    <section className="signup-page">
      <header className="nav-wrap signup-nav-wrap">
        <nav className="nav-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <span />
            </span>
            <p>
              PCB <span>by alpha</span>
            </p>
          </div>

          <ul className="nav-links">
            <li onClick={onHomeClick}>Home</li>
            <li onClick={onBuildClick}>Builds</li>
            <li>Forrum</li>
            <li>News</li>
          </ul>

          <div className="nav-actions">
            <ThemeSwitchButton theme={theme} onToggleTheme={onToggleTheme} />

            <StarButton className="chatbot-btn" onClick={onChatbotClick}>
              Chatbot
            </StarButton>

            <button type="button" className="plain-pill-btn" onClick={onBack}>
              Back
            </button>
            <button type="button" className="login-btn glow-pill-btn" onClick={focusSignUpForm}>
              Sign up
            </button>
          </div>
        </nav>
      </header>

      <div className="signup-body">
        <div className="signup-card">
          <p className="signup-kicker">WELCOME DEVELOPER</p>
          <h2>Create your account</h2>
          <p className="signup-muted">Start building and saving your PC configurations.</p>

          <button type="button" className="social-auth-btn">
            <span className="social-dot" aria-hidden="true">G</span>
            Continue with Google
          </button>

          <div className="signup-divider" aria-hidden="true">
            <span />
            <p>or</p>
            <span />
          </div>

          <form className="signup-form" onSubmit={(event) => event.preventDefault()}>
            <input ref={emailInputRef} type="email" placeholder="Email address" required />
            <input type="password" placeholder="Create password" required />
            <button type="submit" className="glow-pill-btn full-width">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SignUpPage

import { useRef } from 'react'

function SignUpPage({ onBack }) {
  const emailInputRef = useRef(null)

  const focusSignUpForm = () => {
    if (emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }

  return (
    <section className="signup-page">
      <div className="signup-body">
        <div className="signup-intro">
          <p className="chip signup-chip">Created for PC builders</p>
          <h1>Create your account.</h1>
          <p className="signup-lead">
            Save your custom builds, keep component notes in one place, and move between budget
            ideas without losing the visual language of the home page.
          </p>

          <div className="signup-points">
            <article>
              <strong>Build history</strong>
              <span>Save and revisit PC plans anytime.</span>
            </article>
            <article>
              <strong>Part tracking</strong>
              <span>Keep your chosen components organized.</span>
            </article>
            <article>
              <strong>Shared workflow</strong>
              <span>Start on home, continue inside the builder.</span>
            </article>
            <article>
              <strong>Theme aware</strong>
              <span>Matches the same dark and light modes.</span>
            </article>
          </div>

          <div className="signup-intro-actions">
            <button type="button" className="plain-pill-btn" onClick={onBack}>
              Back
            </button>
            <button type="button" className="login-btn glow-pill-btn" onClick={focusSignUpForm}>
              Sign up
            </button>
          </div>
        </div>

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

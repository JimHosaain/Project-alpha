import { useMemo, useRef, useState } from 'react'
import { loginUser, signUpUser } from '../api'

function SignUpPage({ onBack }) {
  const emailInputRef = useRef(null)
  const [mode, setMode] = useState('signup')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    preferences: '',
  })

  const isLogin = mode === 'login'

  const focusSignUpForm = () => {
    if (emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }

  const submitLabel = useMemo(() => (isLogin ? 'Log in' : 'Create Account'), [isLogin])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : {
            user_name: form.name,
            email: form.email,
            password: form.password,
            preferences: form.preferences,
          }

      const result = isLogin ? await loginUser(payload) : await signUpUser(payload)
      const user = result.user

      if (user) {
        localStorage.setItem('pcb_current_user', JSON.stringify(user))
      }

      setMessage(isLogin ? 'Login successful. Opening the app...' : 'Account created successfully.')
      window.setTimeout(() => {
        onBack()
      }, 500)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
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
              {isLogin ? 'Log in' : 'Sign up'}
            </button>
          </div>
        </div>

        <div className="signup-card">
          <div className="signup-mode-switch">
            <button
              type="button"
              className={isLogin ? 'signup-mode-btn' : 'signup-mode-btn is-active'}
              onClick={() => setMode('signup')}
            >
              Sign up
            </button>
            <button
              type="button"
              className={isLogin ? 'signup-mode-btn is-active' : 'signup-mode-btn'}
              onClick={() => setMode('login')}
            >
              Log in
            </button>
          </div>

          <p className="signup-kicker">WELCOME DEVELOPER</p>
          <h2>{isLogin ? 'Log in to your account' : 'Create your account'}</h2>
          <p className="signup-muted">
            {isLogin
              ? 'Use the same email and password you saved earlier to come back in.'
              : 'Start building and saving your PC configurations.'}
          </p>

          <button type="button" className="social-auth-btn">
            <span className="social-dot" aria-hidden="true">G</span>
            Continue with Google
          </button>

          <div className="signup-divider" aria-hidden="true">
            <span />
            <p>or</p>
            <span />
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            {!isLogin ? (
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                required={!isLogin}
              />
            ) : null}
            <input
              ref={emailInputRef}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              autoComplete="email"
              required
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder={isLogin ? 'Password' : 'Create password'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              required
            />
            {!isLogin ? (
              <input
                name="preferences"
                type="text"
                value={form.preferences}
                onChange={handleChange}
                placeholder="Build preference, optional"
                autoComplete="off"
              />
            ) : null}
            <button type="submit" className="glow-pill-btn full-width" disabled={loading}>
              {loading ? 'Saving...' : submitLabel}
            </button>
            {error ? <p className="signup-feedback is-error">{error}</p> : null}
            {message ? <p className="signup-feedback is-success">{message}</p> : null}
          </form>
        </div>
      </div>
    </section>
  )
}

export default SignUpPage

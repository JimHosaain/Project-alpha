function SignUpPage({ onBack }) {
  return (
    <section className="signup-page">
      <header className="signup-mini-nav">
        <div className="mini-brand">
          <span className="mini-brand-mark" aria-hidden="true">
            <span />
          </span>
          <p>PCB Auth</p>
        </div>

        <nav className="mini-links" aria-label="Sign up navigation">
          <a href="#">Manifesto</a>
          <a href="#">Careers</a>
          <a href="#">Discover</a>
        </nav>

        <div className="mini-actions">
          <button type="button" className="plain-pill-btn" onClick={onBack}>
            Back
          </button>
          <button type="button" className="glow-pill-btn">
            Sign up
          </button>
        </div>
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
            <input type="email" placeholder="Email address" required />
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

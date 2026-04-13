import StarButton from './ui/StarButton'
import ThemeSwitchButton from './ui/ThemeSwitchButton'

function Navbar({
  theme,
  onToggleTheme,
  onLoginClick,
  onChatbotClick,
  onHomeClick,
  onBuildClick,
  activeView = 'home',
}) {
  return (
    <header className="nav-wrap">
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
          <li className={activeView === 'home' ? 'is-active' : ''} onClick={onHomeClick}>Home</li>
          <li className={activeView === 'builder' || activeView === 'manualBuilder' ? 'is-active' : ''} onClick={onBuildClick}>Builds</li>
          <li className={activeView === 'signup' ? 'is-active' : ''} onClick={onLoginClick}>Account</li>
          <li>Forrum</li>
          <li>News</li>
        </ul>

        <div className="nav-actions">
          <ThemeSwitchButton theme={theme} onToggleTheme={onToggleTheme} />

          <StarButton className="chatbot-btn" onClick={onChatbotClick}>
            Chatbot
          </StarButton>

          <button type="button" className="login-btn glow-pill-btn" onClick={onLoginClick}>
            Log in
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar

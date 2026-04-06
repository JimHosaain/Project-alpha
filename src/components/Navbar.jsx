import StarButton from './ui/StarButton'
import ThemeSwitchButton from './ui/ThemeSwitchButton'

function Navbar({ theme, onToggleTheme, onLoginClick, onChatbotClick, activeView = 'home' }) {
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
          <li className={activeView === 'home' ? 'is-active' : ''}>Home</li>
          <li>Builds</li>
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

import { Moon, Sun } from 'lucide-react'

function ThemeSwitchButton({ theme = 'dark', onToggleTheme, className = '' }) {
  return (
    <button
      type="button"
      onClick={onToggleTheme}
      className={`theme-switch-btn ${className}`.trim()}
      aria-label="Toggle light and dark theme"
      aria-pressed={theme === 'light'}
    >
      <Sun className={`theme-switch-icon ${theme === 'light' ? 'is-visible' : ''}`} size={18} />
      <Moon className={`theme-switch-icon ${theme === 'dark' ? 'is-visible' : ''}`} size={18} />
    </button>
  )
}

export default ThemeSwitchButton

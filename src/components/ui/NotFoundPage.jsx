import { ArrowLeft, ArrowRight, Cpu, Home, MessageCircle, UserPlus } from 'lucide-react'

const defaultLinks = [
  {
    title: 'Go Home',
    subtitle: 'Return to the main landing page and continue exploring.',
    icon: Home,
    href: '/',
  },
  {
    title: 'Build Your PC',
    subtitle: 'Jump back into the builder flow and compare parts.',
    icon: Cpu,
    href: '/builder',
  },
  {
    title: 'Create Account',
    subtitle: 'Sign up to save builds and keep your selections.',
    icon: UserPlus,
    href: '/signup',
  },
  {
    title: 'Contact Support',
    subtitle: 'Need help finding a page? Reach out to the team.',
    icon: MessageCircle,
    href: '#',
  },
]

function NotFoundPage({
  errorCode = '404 error',
  title = "We can't find this page",
  description = "The page you are looking for doesn't exist or has been moved.",
  links = defaultLinks,
  onBackClick,
  onHomeClick,
  backButtonText = 'Go back',
  homeButtonText = 'Go Home',
  showBackground = true,
  className = '',
  children,
}) {
  const handleLinkClick = (href, event) => {
    if (!href || href.startsWith('#')) {
      event.preventDefault()
      return
    }

    if (href.startsWith('/')) {
      event.preventDefault()
      window.history.pushState({}, '', href)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  return (
    <main className={`not-found-page ${className}`.trim()}>
      {showBackground && <div className="not-found-grid" aria-hidden="true" />}

      <section className="not-found-shell">
        {children || (
          <>
            <div className="not-found-header">
              <p className="not-found-badge">{errorCode}</p>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>

            <div className="not-found-actions">
              <button type="button" className="primary-btn" onClick={onBackClick}>
                <ArrowLeft size={16} />
                {backButtonText}
              </button>
              <button type="button" className="ghost-btn" onClick={onHomeClick}>
                {homeButtonText}
              </button>
            </div>

            {links.length > 0 && (
              <div className="not-found-links">
                {links.map((link) => {
                  const Icon = link.icon
                  return (
                    <a
                      href={link.href}
                      className="not-found-link"
                      key={link.title}
                      onClick={(event) => handleLinkClick(link.href, event)}
                    >
                      <div className="not-found-link-icon">
                        <Icon size={18} />
                      </div>
                      <div className="not-found-link-copy">
                        <strong>{link.title}</strong>
                        <span>{link.subtitle}</span>
                      </div>
                      <ArrowRight size={16} className="not-found-link-arrow" />
                    </a>
                  )
                })}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default NotFoundPage

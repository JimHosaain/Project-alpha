import { Suspense, lazy } from 'react'
import { ArrowRight } from 'lucide-react'
import MagneticButton from './ui/MagneticButton'

const DottedSurface = lazy(() => import('./ui/DottedSurface'))

function HeroSection({ theme, onBuildClick }) {
  return (
    <section className="hero-section">
      <Suspense fallback={null}>
        <DottedSurface theme={theme} className="hero-dotted-surface" />
      </Suspense>
      <div className="hero-surface-glow" aria-hidden="true" />

      <div className="hero-copy">
        <p className="chip">Created by Team Alpha</p>

        <h1>
          Build your 
          <br />
          perfect 
          <br />
          PC.
        </h1>

        <p className="hero-subtext">
            Discover the ultimate PC building experience with our intuitive platform.
        </p>

        <div className="hero-actions">
          <MagneticButton type="button" className="primary-btn hero-primary-cta" onClick={onBuildClick}>
            <span className="hero-primary-fill" aria-hidden="true" />
            <span className="hero-primary-icon" aria-hidden="true">
              <ArrowRight size={17} />
            </span>
            <span className="hero-primary-label">Build Your PC</span>
          </MagneticButton>
          <MagneticButton type="button" className="ghost-btn">
            Explore Builds
          </MagneticButton>
        </div>
      </div>

      <div className="hero-video-panel hero-outline-panel" aria-hidden="true">
        <div className="hero-outline-box" />
      </div>
    </section>
  )
}

export default HeroSection

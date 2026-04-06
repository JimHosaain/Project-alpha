import { Suspense, lazy } from 'react'
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
          <MagneticButton type="button" className="primary-btn" onClick={onBuildClick}>
            Build Your PC
          </MagneticButton>
          <MagneticButton type="button" className="ghost-btn">
            Explore Builds
          </MagneticButton>
        </div>
      </div>

      <div className="hero-preview" aria-hidden="true">
        <div className="preview-header">
          <span />
          <span />
          <span />
        </div>
        <div className="preview-content">
          <div className="line w-90" />
          <div className="line w-70" />
          <div className="line w-80" />
          <div className="line w-60" />
          <div className="line w-85" />
        </div>
      </div>
    </section>
  )
}

export default HeroSection

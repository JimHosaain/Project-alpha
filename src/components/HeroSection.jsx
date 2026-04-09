import { Suspense, lazy } from 'react'
import MagneticButton from './ui/MagneticButton'
import StarButton from './ui/StarButton'
import { useLoading } from '../contexts/LoadingContext'
import heroImage from '../assets/Cyberpunk-Inspired Gaming Rig.jpg'

const DottedSurface = lazy(() => import('./ui/DottedSurface'))

function HeroSection({ theme, onBuildClick }) {
  const { startLoading } = useLoading()

  const handleBuildClick = () => {
    startLoading('Cooking', 700)
    setTimeout(() => {
      onBuildClick()
    }, 180)
  }

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
          <StarButton className="chatbot-btn" onClick={handleBuildClick}>
            Build Your PC
          </StarButton>
          <MagneticButton type="button" className="ghost-btn">
            Explore Builds
          </MagneticButton>
        </div>
      </div>

      <div className="hero-video-panel" aria-hidden="true">
        <div className="hero-image-container">
          <div className="hero-image-wrapper">
            <div className="hero-image-frame">
              <img
                src={heroImage}
                alt="Gaming PC Build"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

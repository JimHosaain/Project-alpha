import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import FooterSection from './FooterSection'
import MagneticButton from './MagneticButton'

const STYLES = `
.cinematic-footer-wrapper {
  --cf-bg-1: color-mix(in srgb, var(--ghost-bg), #ffffff 4%);
  --cf-bg-2: color-mix(in srgb, var(--ghost-bg), #000000 8%);
  --cf-border: color-mix(in srgb, var(--line-color), transparent 15%);
  --cf-glass: color-mix(in srgb, var(--text-color), transparent 94%);
  --cf-glass-hover: color-mix(in srgb, var(--text-color), transparent 90%);
  --cf-muted: var(--muted-color);
  --cf-text: var(--text-color);
  --cf-shadow: rgba(0, 0, 0, 0.3);

  position: relative;
  height: auto;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(180deg, var(--cf-bg-1), var(--cf-bg-2));
  color: var(--cf-text);
  font-family: 'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  z-index: 0;
}

.cinematic-reveal-shell {
  position: relative;
  width: 100%;
  overflow: hidden;
  clip-path: polygon(0% 0, 100% 0, 100% 100%, 0% 100%);
}

.cinematic-bg-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-size: 54px 54px;
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--cf-text), transparent 94%) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--cf-text), transparent 94%) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}

.cinematic-aurora {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(860px, 88vw);
  height: 56vh;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
  filter: blur(76px);
  background: radial-gradient(circle at center,
    color-mix(in srgb, var(--cf-text), transparent 88%) 0%,
    color-mix(in srgb, var(--cf-text), transparent 95%) 42%,
    transparent 72%);
  animation: cinematic-breathe 8s ease-in-out infinite alternate;
}

.cinematic-giant-text {
  position: absolute;
  left: 50%;
  bottom: -6vh;
  transform: translateX(-50%);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  font-size: clamp(6rem, 25vw, 24rem);
  line-height: 0.8;
  letter-spacing: -0.06em;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in srgb, var(--cf-text), transparent 92%);
  background: linear-gradient(180deg, color-mix(in srgb, var(--cf-text), transparent 88%) 0%, transparent 68%);
  -webkit-background-clip: text;
  background-clip: text;
}

.cinematic-content {
  position: relative;
  z-index: 2;
  width: min(980px, 100% - 36px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 92px 0 62px;
}

.cinematic-heading {
  margin: 0 0 22px;
  text-align: center;
  font-size: clamp(2.35rem, 8.2vw, 6rem);
  letter-spacing: -0.04em;
  font-weight: 900;
  color: var(--cf-text);
  text-shadow: 0 0 24px color-mix(in srgb, var(--cf-text), transparent 85%);
}

.cinematic-link-groups {
  width: 100%;
  display: grid;
  gap: 14px;
}

.cinematic-legacy-footer {
  width: min(900px, 100%);
  margin: 22px auto 16px;
}

.cinematic-legacy-footer-card {
  width: 100%;
  margin: 0;
  border: 1px solid var(--cf-border);
  border-radius: 14px;
  padding: 14px 14px 12px;
  background: color-mix(in srgb, var(--cf-bg-1), transparent 14%);
  box-shadow: 0 12px 34px -26px var(--cf-shadow);
}

.cinematic-legacy-footer-card .footer-modern-glow {
  display: none;
}

.cinematic-legacy-footer-card .footer-modern-grid {
  gap: 12px;
  grid-template-columns: 1fr 1.7fr;
}

.cinematic-legacy-footer-card .footer-modern-links-grid {
  gap: 8px;
}

.cinematic-legacy-footer-card .footer-brand-col {
  gap: 8px;
}

.cinematic-legacy-footer-card .footer-logo {
  width: 22px;
  height: 22px;
}

.cinematic-legacy-footer-card .footer-copy {
  font-size: 0.76rem;
  line-height: 1.4;
}

.cinematic-legacy-footer-card .footer-link-col h4 {
  font-size: 0.68rem;
}

.cinematic-legacy-footer-card .footer-link-col ul {
  margin-top: 8px;
  gap: 6px;
}

.cinematic-legacy-footer-card .footer-link-col a {
  font-size: 0.75rem;
}

.cinematic-pill-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.cinematic-pill {
  border: 1px solid var(--cf-border);
  background: linear-gradient(145deg, var(--cf-glass), color-mix(in srgb, var(--cf-glass), transparent 12%));
  color: color-mix(in srgb, var(--cf-text), transparent 7%);
  box-shadow:
    0 10px 26px -12px var(--cf-shadow),
    inset 0 1px 1px color-mix(in srgb, var(--cf-text), transparent 90%);
  border-radius: 999px;
  transition: all 220ms ease;
  text-decoration: none;
}

.cinematic-pill:hover {
  background: linear-gradient(145deg, var(--cf-glass-hover), color-mix(in srgb, var(--cf-glass-hover), transparent 10%));
  transform: translateY(-1px);
}

.cinematic-pill-main {
  padding: 14px 24px;
  font-size: 0.9rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.cinematic-pill-motion {
  position: relative;
  overflow: hidden;
  min-width: 208px;
  justify-content: center;
}

.cinematic-btn-fill {
  position: absolute;
  left: 6px;
  top: 50%;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--cf-text), transparent 2%);
  transform: translateY(-50%);
  transition: width 500ms ease;
  z-index: 0;
}

.cinematic-btn-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: color-mix(in srgb, var(--cf-bg-2), transparent 0%);
  transition: transform 500ms ease;
  z-index: 2;
}

.cinematic-btn-label {
  position: relative;
  z-index: 2;
  transition: color 500ms ease;
}

.cinematic-pill-motion:hover .cinematic-btn-fill {
  width: calc(100% - 12px);
}

.cinematic-pill-motion:hover .cinematic-btn-icon {
  transform: translateY(-50%) translateX(6px);
}

.cinematic-pill-motion:hover .cinematic-btn-label {
  color: color-mix(in srgb, var(--cf-bg-2), transparent 0%);
}

.cinematic-pill-small {
  padding: 10px 16px;
  font-size: 0.77rem;
  font-weight: 600;
  color: var(--cf-muted);
}

@keyframes cinematic-breathe {
  from { transform: translate(-50%, -50%) scale(1); opacity: 0.62; }
  to { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
}

@keyframes cinematic-heartbeat {
  0%, 100% { transform: scale(1); }
  15%, 45% { transform: scale(1.22); }
  30% { transform: scale(1); }
}

@media (max-width: 760px) {
  .cinematic-content {
    width: min(980px, 100% - 20px);
  }

  .cinematic-legacy-footer-card .footer-modern-grid,
  .cinematic-legacy-footer-card .footer-modern-links-grid {
    grid-template-columns: 1fr;
  }

  .cinematic-legacy-footer-card {
    padding: 12px 10px;
  }
}
`
function MotionFooter() {
  const wrapperRef = useRef(null)
  const giantTextRef = useRef(null)
  const headingRef = useRef(null)
  const linksRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !wrapperRef.current) return undefined
    const wrapper = wrapperRef.current
    const giant = giantTextRef.current
    const heading = headingRef.current
    const links = linksRef.current
    if (!giant || !heading || !links) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      giant.style.opacity = '1'
      giant.style.transform = 'translateX(-50%) translateY(0) scale(1)'
      heading.style.opacity = '1'
      heading.style.transform = 'translateY(0)'
      links.style.opacity = '1'
      links.style.transform = 'translateY(0)'
      return undefined
    }

    giant.style.willChange = 'transform, opacity'
    heading.style.willChange = 'transform, opacity'
    links.style.willChange = 'transform, opacity'

    let rafId = 0

    const applyProgress = () => {
      const rect = wrapper.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const start = viewportHeight * 0.82
      const end = -viewportHeight * 0.18
      const raw = (start - rect.top) / (start - end)
      const progress = Math.min(1, Math.max(0, raw))

      const giantScale = 0.82 + progress * 0.18
      const giantTranslateY = (1 - progress) * 10
      giant.style.opacity = String(progress)
      giant.style.transform = `translateX(-50%) translateY(${giantTranslateY}vh) scale(${giantScale})`

      const headingOpacity = Math.min(1, progress * 1.35)
      const headingTranslate = (1 - headingOpacity) * 50
      heading.style.opacity = String(headingOpacity)
      heading.style.transform = `translateY(${headingTranslate}px)`

      const linksProgress = Math.min(1, Math.max(0, (progress - 0.08) / 0.92))
      const linksTranslate = (1 - linksProgress) * 54
      links.style.opacity = String(linksProgress)
      links.style.transform = `translateY(${linksTranslate}px)`
    }

    const onScrollOrResize = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        applyProgress()
      })
    }

    applyProgress()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div ref={wrapperRef} className="cinematic-reveal-shell">
        <section className="cinematic-footer-wrapper">
          <div className="cinematic-aurora" aria-hidden="true" />
          <div className="cinematic-bg-grid" aria-hidden="true" />

          <div ref={giantTextRef} className="cinematic-giant-text" aria-hidden="true">
            BUILDER
          </div>

          <div className="cinematic-content">
            <h2 ref={headingRef} className="cinematic-heading">
              Ready to Build Your Dream PC?
            </h2>

            <div ref={linksRef} className="cinematic-link-groups">
              <div className="cinematic-pill-row">
                <MagneticButton href="#" className="cinematic-pill cinematic-pill-main cinematic-pill-motion">
                  <span className="cinematic-btn-fill" aria-hidden="true" />
                  <span className="cinematic-btn-icon" aria-hidden="true">
                    <ArrowRight size={18} />
                  </span>
                  <span className="cinematic-btn-label">Get Started</span>
                </MagneticButton>

                <MagneticButton href="#" className="cinematic-pill cinematic-pill-main cinematic-pill-motion">
                  <span className="cinematic-btn-fill" aria-hidden="true" />
                  <span className="cinematic-btn-icon" aria-hidden="true">
                    <ArrowRight size={18} />
                  </span>
                  <span className="cinematic-btn-label">AI Build Bot</span>
                </MagneticButton>
              </div>
            </div>

            <div className="cinematic-legacy-footer">
              <FooterSection as="div" className="cinematic-legacy-footer-card" />
            </div>
          </div>

        </section>
      </div>
    </>
  )
}

export default MotionFooter



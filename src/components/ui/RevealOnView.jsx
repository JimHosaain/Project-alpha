import { motion, useReducedMotion } from 'motion/react'

function RevealOnView({ children, className = '', delay = 0, variant = 'default' }) {
  const shouldReduceMotion = useReducedMotion()
  const MotionDiv = motion.div
  const isSmallScreen = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

  const motionByVariant = {
    default: {
      initial: { opacity: 0, y: 8, scale: 0.992 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      transition: { delay, duration: 0.16, ease: 'easeOut' },
    },
    hero: {
      initial: { opacity: 0, y: 10, scale: 0.99 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      transition: { delay, duration: 0.2, ease: 'easeOut' },
    },
    soft: {
      initial: { opacity: 0, y: 4, scale: 0.995 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      transition: { delay, duration: 0.12, ease: 'easeOut' },
    },
    lift: {
      initial: { opacity: 0, y: 8 },
      whileInView: { opacity: 1, y: 0 },
      transition: { delay, duration: 0.14, ease: 'easeOut' },
    },
  }

  // On smaller screens, render directly to avoid IntersectionObserver reveal stalls.
  if (shouldReduceMotion || isSmallScreen) {
    return <div className={className}>{children}</div>
  }

  const motionConfig = motionByVariant[variant] ?? motionByVariant.default

  return (
    <MotionDiv
      initial={motionConfig.initial}
      whileInView={motionConfig.whileInView}
      viewport={{ once: true, amount: 0.02 }}
      transition={motionConfig.transition}
      className={className}
    >
      {children}
    </MotionDiv>
  )
}

export default RevealOnView

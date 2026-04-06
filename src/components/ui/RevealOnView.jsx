import { motion, useReducedMotion } from 'motion/react'

function RevealOnView({ children, className = '', delay = 0 }) {
  const shouldReduceMotion = useReducedMotion()
  const MotionDiv = motion.div

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <MotionDiv
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </MotionDiv>
  )
}

export default RevealOnView

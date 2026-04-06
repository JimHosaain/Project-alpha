import { useEffect, useRef } from 'react'

function MagneticButton({ className = '', children, href, type = 'button', ...props }) {
  const localRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const element = localRef.current
    if (!element) return undefined

    const handleMouseMove = (event) => {
      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left - rect.width / 2
      const y = event.clientY - rect.top - rect.height / 2
      const tx = x * 0.14
      const ty = y * 0.14
      const rx = -y * 0.02
      const ry = x * 0.02

      element.style.transition = 'transform 130ms ease-out'
      element.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`
    }

    const handleMouseLeave = () => {
      element.style.transition = 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)'
      element.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)'
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.style.transform = 'translate3d(0, 0, 0)'
    }
  }, [])

  if (href) {
    return (
      <a href={href} ref={localRef} className={className} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} ref={localRef} className={className} {...props}>
      {children}
    </button>
  )
}

export default MagneticButton

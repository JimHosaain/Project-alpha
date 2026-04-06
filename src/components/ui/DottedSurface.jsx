import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function DottedSurface({ theme = 'dark', className = '' }) {
  const containerRef = useRef(null)
  const animationRef = useRef(0)
  const pointerTargetRef = useRef({ x: 0, y: 0 })
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(theme === 'dark' ? 0x02050b : 0xf4f8ff, 1800, 9200)

    const camera = new THREE.PerspectiveCamera(56, 1, 1, 10000)
    camera.position.set(0, 360, 1180)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const separation = 150
    const amountX = 40
    const amountY = 60

    const positions = []
    const colors = []
    const geometry = new THREE.BufferGeometry()

    const dotColor = theme === 'dark' ? 0xf3f3f3 : 0x171717
    const color = new THREE.Color(dotColor)

    const baseY = -170

    for (let ix = 0; ix < amountX; ix += 1) {
      for (let iy = 0; iy < amountY; iy += 1) {
        const x = ix * separation - (amountX * separation) / 2
        const z = iy * separation - (amountY * separation) / 2

        positions.push(x, 0, z)
        colors.push(color.r, color.g, color.b)
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: theme === 'dark' ? 0.9 : 0.75,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const resize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    const handlePointerMove = (event) => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      if (!viewportWidth || !viewportHeight) return

      const normalizedX = (event.clientX / viewportWidth) * 2 - 1
      const normalizedY = (event.clientY / viewportHeight) * 2 - 1

      pointerTargetRef.current.x = Math.max(-1, Math.min(1, normalizedX))
      pointerTargetRef.current.y = Math.max(-1, Math.min(1, normalizedY))
    }

    const handlePointerLeave = () => {
      pointerTargetRef.current.x = 0
      pointerTargetRef.current.y = 0
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)

    let tick = 0
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      pointerRef.current.x += (pointerTargetRef.current.x - pointerRef.current.x) * 0.05
      pointerRef.current.y += (pointerTargetRef.current.y - pointerRef.current.y) * 0.05

      const positionAttribute = geometry.attributes.position
      const positionArray = positionAttribute.array

      let i = 0
      for (let ix = 0; ix < amountX; ix += 1) {
        for (let iy = 0; iy < amountY; iy += 1) {
          const index = i * 3
          const waveX = Math.sin((ix + tick + pointerRef.current.x * 5) * 0.28) * 42
          const waveY = Math.sin((iy + tick - pointerRef.current.y * 7) * 0.46) * 38
          const crossWave = Math.sin((ix + iy + tick * 1.6 + pointerRef.current.x * 8) * 0.12) * 18
          positionArray[index + 1] =
            baseY + waveX + waveY + crossWave
          i += 1
        }
      }

      positionAttribute.needsUpdate = true
      camera.position.x = pointerRef.current.x * 90
      camera.position.y = 360 - pointerRef.current.y * 35
      camera.lookAt(pointerRef.current.x * 35, -130, 0)
      renderer.render(scene, camera)
      tick += 0.08
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)

      scene.traverse((object) => {
        if (object instanceof THREE.Points) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach((item) => item.dispose())
          } else {
            object.material.dispose()
          }
        }
      })

      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [theme])

  return <div ref={containerRef} className={`dotted-surface ${className}`} aria-hidden="true" />
}

export default DottedSurface

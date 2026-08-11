import { useEffect, useRef, useState } from 'react'
import { CharacterAnimator } from '../character/CharacterAnimator'
import { CharacterRenderer } from '../character/CharacterRenderer'
import { createLoadingSpriteMap, preloadSprites } from '../character/spriteLoader'
import type { AnimationSnapshot, SpriteMap } from '../character/characterTypes'

interface CharacterCanvasProps {
  animator: CharacterAnimator
  onSnapshot: (snapshot: AnimationSnapshot) => void
  onSprites: (sprites: SpriteMap) => void
}

export function CharacterCanvas({ animator, onSnapshot, onSprites }: CharacterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spritesRef = useRef<SpriteMap>(createLoadingSpriteMap())
  const [metrics, setMetrics] = useState({ width: 0, height: 0, dpr: 1 })

  useEffect(() => {
    let active = true
    void preloadSprites((sprites) => {
      if (!active) return
      spritesRef.current = sprites
      onSprites(sprites)
    })
    return () => { active = false }
  }, [onSprites])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.max(1, Math.floor(entry.contentRect.width))
      const height = Math.max(1, Math.floor(entry.contentRect.height))
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      setMetrics({ width, height, dpr })
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || metrics.width === 0) return

    const renderer = new CharacterRenderer()
    let rafId = 0
    let previousTime = performance.now()
    let previousSignature = ''

    const tick = (time: number) => {
      const delta = Math.min(0.25, Math.max(0, (time - previousTime) / 1000))
      previousTime = time
      const snapshot = animator.update(delta)
      renderer.render(context, snapshot, spritesRef.current[snapshot.state], metrics)
      const signature = `${snapshot.state}:${snapshot.frameIndex}:${snapshot.paused}:${snapshot.fps}:${snapshot.loop}`
      if (signature !== previousSignature) {
        previousSignature = signature
        onSnapshot(snapshot)
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [animator, metrics, onSnapshot])

  return <canvas ref={canvasRef} className="character-canvas" aria-label="Pré-visualização da animação" tabIndex={0} />
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CharacterAnimator } from './character/CharacterAnimator'
import { CHARACTER_ANIMATIONS } from './character/characterAnimations'
import { createLoadingSpriteMap } from './character/spriteLoader'
import type { AnimationSnapshot, CharacterState, SpriteMap } from './character/characterTypes'
import { AnimationControls } from './components/AnimationControls'
import { CharacterCanvas } from './components/CharacterCanvas'

const isTypingTarget = (target: EventTarget | null): boolean => {
  const element = target as HTMLElement | null
  return Boolean(element?.closest('input, select, textarea, button, [contenteditable="true"]'))
}

export default function App() {
  const animator = useMemo(() => new CharacterAnimator(), [])
  const [snapshot, setSnapshot] = useState<AnimationSnapshot>(() => animator.snapshot())
  const [sprites, setSprites] = useState<SpriteMap>(() => createLoadingSpriteMap())
  const [reducedMotion, setReducedMotion] = useState(false)

  const sync = useCallback(() => setSnapshot(animator.snapshot()), [animator])
  const onAnimation = useCallback((state: CharacterState) => { animator.setAnimation(state); sync() }, [animator, sync])
  const onTogglePause = useCallback(() => { animator.togglePause(); sync() }, [animator, sync])
  const onRestart = useCallback(() => { animator.restart(); sync() }, [animator, sync])
  const onFps = useCallback((fps: number) => { animator.setFps(fps); sync() }, [animator, sync])
  const onLoop = useCallback((loop: boolean) => { animator.setLoop(loop); sync() }, [animator, sync])
  const onSprites = useCallback((next: SpriteMap) => setSprites(next), [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return
      const states: Record<string, CharacterState> = { '1': 'waving', '2': 'smiling' }
      if (states[event.key]) onAnimation(states[event.key])
      if (event.code === 'Space') { event.preventDefault(); onTogglePause() }
      if (event.key.toLowerCase() === 'r') onRestart()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onAnimation, onRestart, onTogglePause])

  const currentSprite = sprites[snapshot.state]
  const canvas = document.querySelector<HTMLCanvasElement>('canvas')

  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">Canvas 2D · QA técnico</p>
          <h1>Laboratório da personagem</h1>
        </div>
        <span className={`status ${currentSprite.status}`}>{currentSprite.status}</span>
      </header>

      <div className="workspace">
        <section className="stage">
          <CharacterCanvas animator={animator} onSnapshot={setSnapshot} onSprites={onSprites} />
        </section>

        <aside className="diagnostics">
          <h2>Diagnóstico</h2>
          <dl>
            <div><dt>Animation</dt><dd>{snapshot.state}</dd></div>
            <div><dt>Frame</dt><dd>{snapshot.frameIndex + 1}</dd></div>
            <div><dt>Frames total</dt><dd>{snapshot.frameCount}</dd></div>
            <div><dt>FPS</dt><dd>{snapshot.fps}</dd></div>
            <div><dt>Elapsed</dt><dd>{snapshot.elapsed.toFixed(2)}s</dd></div>
            <div><dt>Paused</dt><dd>{snapshot.paused ? 'sim' : 'não'}</dd></div>
            <div><dt>Loop</dt><dd>{snapshot.loop ? 'sim' : 'não'}</dd></div>
            <div><dt>Sprite loaded</dt><dd>{currentSprite.status === 'ready' ? 'sim' : 'não'}</dd></div>
            <div><dt>Sprite size</dt><dd>{currentSprite.dimensions ? `${currentSprite.dimensions.spriteWidth}×${currentSprite.dimensions.spriteHeight}` : '—'}</dd></div>
            <div><dt>Frame size</dt><dd>{currentSprite.dimensions ? `${currentSprite.dimensions.frameWidth}×${currentSprite.dimensions.frameHeight}` : '—'}</dd></div>
            <div><dt>Canvas size</dt><dd>{canvas ? `${canvas.clientWidth}×${canvas.clientHeight}` : '—'}</dd></div>
            <div><dt>DPR</dt><dd>{window.devicePixelRatio || 1}</dd></div>
          </dl>
          {currentSprite.error && <p className="asset-error">{currentSprite.error}</p>}
          {reducedMotion && <p className="notice">prefers-reduced-motion está ativo.</p>}
          <div className="asset-list">
            <h3>Assets</h3>
            {Object.entries(CHARACTER_ANIMATIONS).map(([state, config]) => (
              <div key={state}><span>{state}</span><strong className={sprites[state as CharacterState].status}>{sprites[state as CharacterState].status}</strong><small>{config.asset}</small></div>
            ))}
          </div>
        </aside>
      </div>

      <AnimationControls snapshot={snapshot} onAnimation={onAnimation} onTogglePause={onTogglePause} onRestart={onRestart} onFps={onFps} onLoop={onLoop} />
      <footer>Atalhos: 1 Acenando · 2 Sorrindo · Espaço pausa/retoma · R reinicia</footer>
    </main>
  )
}

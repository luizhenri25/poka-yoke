import { CHARACTER_STATES, type AnimationSnapshot, type CharacterState } from '../character/characterTypes'

interface AnimationControlsProps {
  snapshot: AnimationSnapshot
  onAnimation: (state: CharacterState) => void
  onTogglePause: () => void
  onRestart: () => void
  onFps: (fps: number) => void
  onLoop: (loop: boolean) => void
}

const label: Record<CharacterState, string> = {
  waving: 'Acenando',
  smiling: 'Sorrindo',
}

export function AnimationControls(props: AnimationControlsProps) {
  return (
    <section className="controls" aria-label="Controles da animação">
      <div className="state-buttons">
        {CHARACTER_STATES.map((state) => (
          <button key={state} className={props.snapshot.state === state ? 'active' : ''} onClick={() => props.onAnimation(state)}>
            {label[state]}
          </button>
        ))}
      </div>
      <div className="transport">
        <button onClick={props.onTogglePause}>{props.snapshot.paused ? 'Play' : 'Pause'}</button>
        <button onClick={props.onRestart}>Restart</button>
        <label>
          FPS
          <select value={props.snapshot.fps} onChange={(event) => props.onFps(Number(event.target.value))}>
            {[6, 8, 10, 12].map((fps) => <option key={fps}>{fps}</option>)}
          </select>
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={props.snapshot.loop} onChange={(event) => props.onLoop(event.target.checked)} />
          Loop
        </label>
      </div>
    </section>
  )
}

import { CHARACTER_ANIMATIONS } from './characterAnimations'
import { CHARACTER_STATES, type AnimationConfigMap, type AnimationSnapshot, type CharacterState } from './characterTypes'

export const sourceXForFrame = (frameIndex: number, frameWidth: number): number => frameIndex * frameWidth

export class CharacterAnimator {
  private state: CharacterState = 'waving'
  private frameIndex = 0
  private elapsed = 0
  private paused = false
  private fps = CHARACTER_ANIMATIONS.waving.fps
  private loop = CHARACTER_ANIMATIONS.waving.loop
  private completed = false

  constructor(private readonly config: AnimationConfigMap = CHARACTER_ANIMATIONS) {}

  setAnimation(candidate: string): boolean {
    if (!CHARACTER_STATES.includes(candidate as CharacterState)) return false
    this.state = candidate as CharacterState
    this.frameIndex = 0
    this.elapsed = 0
    this.completed = false
    this.loop = this.config[this.state].loop
    return true
  }

  update(deltaSeconds: number): AnimationSnapshot {
    if (this.paused || !Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return this.snapshot()

    if (this.completed && !this.loop) return this.snapshot()

    const current = this.config[this.state]
    this.elapsed += deltaSeconds
    const rawFrame = Math.floor(this.elapsed * this.fps)

    if (this.loop) {
      this.frameIndex = rawFrame % current.frameCount
    } else if (rawFrame >= current.frameCount) {
      this.frameIndex = current.frameCount - 1
      this.elapsed = current.frameCount / this.fps
      this.completed = true
    } else {
      this.frameIndex = rawFrame
    }

    return this.snapshot()
  }

  pause(): void { this.paused = true }
  resume(): void { this.paused = false }
  togglePause(): void { this.paused = !this.paused }

  restart(): void {
    this.frameIndex = 0
    this.elapsed = 0
    this.completed = false
  }

  setFps(fps: number): boolean {
    if (![6, 8, 10, 12].includes(fps)) return false
    const frameProgress = this.elapsed * this.fps
    this.fps = fps
    this.elapsed = frameProgress / fps
    return true
  }

  setLoop(enabled: boolean): void {
    if (this.loop === enabled) return
    this.loop = enabled
    this.completed = false
    this.elapsed = this.frameIndex / this.fps
  }

  snapshot(): AnimationSnapshot {
    const current = this.config[this.state]
    return {
      state: this.state,
      frameIndex: this.frameIndex,
      frameCount: current.frameCount,
      fps: this.fps,
      elapsed: this.elapsed,
      paused: this.paused,
      loop: this.loop,
      completed: this.completed,
    }
  }
}

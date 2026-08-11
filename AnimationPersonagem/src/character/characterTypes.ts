export const CHARACTER_STATES = [
  'waving',
  'smiling',
] as const

export type CharacterState = (typeof CHARACTER_STATES)[number]
export type AssetStatus = 'loading' | 'ready' | 'error'

export interface AnimationConfig {
  readonly asset: string
  readonly frameCount: number
  readonly fps: number
  readonly loop: boolean
}

export type AnimationConfigMap = Readonly<Record<CharacterState, AnimationConfig>>

export interface AnimationSnapshot {
  readonly state: CharacterState
  readonly frameIndex: number
  readonly frameCount: number
  readonly fps: number
  readonly elapsed: number
  readonly paused: boolean
  readonly loop: boolean
  readonly completed: boolean
}

export interface SpriteDimensions {
  readonly spriteWidth: number
  readonly spriteHeight: number
  readonly frameWidth: number
  readonly frameHeight: number
}

export interface SpriteRecord {
  readonly status: AssetStatus
  readonly image: HTMLImageElement | null
  readonly error: string | null
  readonly dimensions: SpriteDimensions | null
}

export type SpriteMap = Record<CharacterState, SpriteRecord>

import type { AnimationConfigMap } from './characterTypes'

const animation = (
  asset: string,
  fps = 6,
  loop = false,
) => Object.freeze({ asset, frameCount: 6, fps, loop })

export const CHARACTER_ANIMATIONS: AnimationConfigMap = Object.freeze({
  waving: animation('/assets/character/sprites/waving.png'),
  smiling: animation('/assets/character/sprites/smiling.png'),
})

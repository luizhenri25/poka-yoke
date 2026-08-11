import { CHARACTER_ANIMATIONS } from './characterAnimations'
import { CHARACTER_STATES, type CharacterState, type SpriteDimensions, type SpriteMap, type SpriteRecord } from './characterTypes'

const cache = new Map<string, Promise<SpriteRecord>>()

export const calculateFrameDimensions = (
  naturalWidth: number,
  naturalHeight: number,
  frameCount: number,
): SpriteDimensions | null => {
  if (naturalWidth <= 0 || naturalHeight <= 0 || frameCount <= 0 || naturalWidth % frameCount !== 0) return null
  return {
    spriteWidth: naturalWidth,
    spriteHeight: naturalHeight,
    frameWidth: naturalWidth / frameCount,
    frameHeight: naturalHeight,
  }
}

export const loadSprite = (state: CharacterState): Promise<SpriteRecord> => {
  const config = CHARACTER_ANIMATIONS[state]
  const cached = cache.get(config.asset)
  if (cached) return cached

  const pending = new Promise<SpriteRecord>((resolve) => {
    const image = new Image()
    image.onload = () => {
      const dimensions = calculateFrameDimensions(image.naturalWidth, image.naturalHeight, config.frameCount)
      resolve(dimensions
        ? { status: 'ready', image, error: null, dimensions }
        : {
            status: 'error',
            image: null,
            error: `${state}.png possui largura ${image.naturalWidth}px, não divisível por ${config.frameCount} frames`,
            dimensions: null,
          })
    }
    image.onerror = () => resolve({
      status: 'error',
      image: null,
      error: `Sprite ${state}.png não encontrado`,
      dimensions: null,
    })
    image.src = config.asset
  })

  cache.set(config.asset, pending)
  return pending
}

export const createLoadingSpriteMap = (): SpriteMap => Object.fromEntries(
  CHARACTER_STATES.map((state) => [state, { status: 'loading', image: null, error: null, dimensions: null }]),
) as SpriteMap

export const preloadSprites = async (onUpdate: (sprites: SpriteMap) => void): Promise<SpriteMap> => {
  const sprites = createLoadingSpriteMap()
  await Promise.all(CHARACTER_STATES.map(async (state) => {
    sprites[state] = await loadSprite(state)
    onUpdate({ ...sprites })
  }))
  return sprites
}

export const clearSpriteCacheForTests = (): void => cache.clear()

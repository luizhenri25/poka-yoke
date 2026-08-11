import { sourceXForFrame } from './CharacterAnimator'
import type { AnimationSnapshot, SpriteRecord } from './characterTypes'

export interface RenderMetrics {
  readonly width: number
  readonly height: number
  readonly dpr: number
}

export class CharacterRenderer {
  render(
    context: CanvasRenderingContext2D,
    snapshot: AnimationSnapshot,
    sprite: SpriteRecord,
    metrics: RenderMetrics,
  ): void {
    const { width, height, dpr } = metrics
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, width, height)
    context.fillStyle = '#111318'
    context.fillRect(0, 0, width, height)

    if (sprite.status !== 'ready' || !sprite.image || !sprite.dimensions) {
      context.fillStyle = '#aeb5c2'
      context.font = '600 15px system-ui, sans-serif'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(sprite.status === 'loading' ? 'Carregando sprite…' : 'Sprite aguardando', width / 2, height / 2)
      return
    }

    const { frameWidth, frameHeight } = sprite.dimensions
    const padding = 24
    const scale = Math.min((width - padding * 2) / frameWidth, (height - padding * 2) / frameHeight)
    const destinationWidth = frameWidth * scale
    const destinationHeight = frameHeight * scale
    const destinationX = (width - destinationWidth) / 2
    const destinationY = (height - destinationHeight) / 2

    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(
      sprite.image,
      sourceXForFrame(snapshot.frameIndex, frameWidth),
      0,
      frameWidth,
      frameHeight,
      destinationX,
      destinationY,
      destinationWidth,
      destinationHeight,
    )
  }
}

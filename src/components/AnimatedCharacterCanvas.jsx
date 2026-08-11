import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Smile, Hand } from 'lucide-react';

const ANIMATIONS = {
  waving: { asset: '/assets/character/sprites/waving.png', frameCount: 6, fps: 6 },
  smiling: { asset: '/assets/character/sprites/smiling.png', frameCount: 6, fps: 6 }
};

export default function AnimatedCharacterCanvas({ height = 240, width = 200, defaultAnim = 'waving', currentAnim = null, customMessage = null }) {
  const canvasRef = useRef(null);
  const [animState, setAnimState] = useState(currentAnim || defaultAnim);
  const [isPaused, setIsPaused] = useState(false);
  const [images, setImages] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (currentAnim) {
      setAnimState(currentAnim);
    }
  }, [currentAnim]);

  // Precarregar spritesheet PNGs
  useEffect(() => {
    let active = true;
    const loadedImgs = {};
    let pending = Object.keys(ANIMATIONS).length;

    Object.entries(ANIMATIONS).forEach(([key, config]) => {
      const img = new Image();
      img.src = config.asset;
      img.onload = () => {
        if (!active) return;
        loadedImgs[key] = {
          img,
          frameWidth: img.width / config.frameCount,
          frameHeight: img.height
        };
        pending--;
        if (pending === 0) {
          setImages(loadedImgs);
          setLoaded(true);
        }
      };
      img.onerror = () => {
        pending--;
        if (pending === 0 && active) setLoaded(true);
      };
    });

    return () => { active = false; };
  }, []);

  // Loop de Renderização Canvas 2D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    let frameIndex = 0;
    let lastTime = performance.now();
    let animFrameId = 0;

    const render = (time) => {
      const config = ANIMATIONS[animState];
      const spriteData = images[animState];

      const frameInterval = 1000 / (config?.fps || 6);

      if (!isPaused && time - lastTime >= frameInterval) {
        frameIndex = (frameIndex + 1) % (config?.frameCount || 6);
        lastTime = time;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (spriteData && spriteData.img) {
        const { img, frameWidth, frameHeight } = spriteData;
        const padding = 10;
        const scale = Math.min((width - padding * 2) / frameWidth, (height - padding * 2) / frameHeight);
        const destW = frameWidth * scale;
        const destH = frameHeight * scale;
        const destX = (width - destW) / 2;
        const destY = (height - destH) / 2;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
          img,
          frameIndex * frameWidth,
          0,
          frameWidth,
          frameHeight,
          destX,
          destY,
          destW,
          destH
        );
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameId);
  }, [animState, isPaused, images, loaded, width, height]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      position: 'relative'
    }}>
      {/* Balão de Fala Interativo */}
      <div style={{
        backgroundColor: 'white',
        border: '2px solid var(--color-primary)',
        borderRadius: '16px',
        padding: '0.65rem 1rem',
        boxShadow: 'var(--shadow-md)',
        fontSize: '0.8rem',
        fontWeight: 800,
        color: 'var(--color-primary-dark)',
        textAlign: 'center',
        maxWidth: '220px',
        lineHeight: '1.3',
        borderBottomLeftRadius: '4px'
      }}>
        {customMessage || (animState === 'waving' ? '👋 Olá! Bem-vindo ao POKA-YOKE System' : '😊 Pronto para validar os processos!')}
      </div>

      {/* Canvas do Boneco Animado com Transparência */}
      <div style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        display: 'flex',
        justify: 'center',
        alignItems: 'center'
      }}>
        {loaded && images[animState] ? (
          <canvas
            ref={canvasRef}
            style={{
              width: `${width}px`,
              height: `${height}px`,
              filter: 'drop-shadow(0px 8px 16px rgba(10, 27, 159, 0.18))'
            }}
          />
        ) : (
          <video
            src="/boneco-correto.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.15))'
            }}
          />
        )}
      </div>

      {/* Controles do Personagem */}
      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '-0.25rem' }}>
        <button
          type="button"
          onClick={() => setAnimState('waving')}
          style={{
            backgroundColor: animState === 'waving' ? '#0A1B9F' : '#EEF2FF',
            color: animState === 'waving' ? 'white' : '#0A1B9F',
            border: 'none',
            borderRadius: '20px',
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <Hand size={12} /> Acenar
        </button>

        <button
          type="button"
          onClick={() => setAnimState('smiling')}
          style={{
            backgroundColor: animState === 'smiling' ? '#0A1B9F' : '#EEF2FF',
            color: animState === 'smiling' ? 'white' : '#0A1B9F',
            border: 'none',
            borderRadius: '20px',
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <Smile size={12} /> Sorrir
        </button>
      </div>

    </div>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { Edit3, RotateCcw, Check, X, ShieldCheck } from 'lucide-react';

export default function SignatureCanvasModal({ isOpen, onClose, onSave, operatorName, postoName }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0A1B9F'; // Cor azul corporativa Forvia Faurecia
      clearCanvas();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar fundo branco limpo no canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Linha guia pontilhada para a assinatura
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(30, canvas.height - 35);
    ctx.lineTo(canvas.width - 30, canvas.height - 35);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Restaurar configurações de desenho
    ctx.setLineDash([]);
    ctx.strokeStyle = '#0A1B9F';
    ctx.lineWidth = 3;
    
    setHasSignature(false);
  };

  // Funções de Posição (Mouse ou Touch/Dedo)
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (isDrawing) {
      if (e) e.preventDefault();
      setIsDrawing(false);
    }
  };

  const handleConfirm = () => {
    if (!hasSignature) {
      alert("Por favor, desenhe sua assinatura no quadro antes de confirmar.");
      return;
    }
    const canvas = canvasRef.current;
    const signatureDataUrl = canvas.toDataURL('image/png');
    onSave(signatureDataUrl);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      zIndex: 9999,
      padding: '1rem',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '520px',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        
        {/* Cabeçalho do Modal */}
        <div style={{
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Edit3 size={20} />
              Assinatura Digital com o Dedo
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#E2E8F0', margin: 0, marginTop: '0.2rem' }}>
              Operador: <strong>{operatorName}</strong> ({postoName})
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '0.2rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Corpo do Modal - Área de Desenho Canvas Touch */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            backgroundColor: '#F8FAFC',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            border: '1px solid #E2E8F0'
          }}>
            ✍️ <strong>Desenhe sua rubrica abaixo</strong> com o dedo no celular/tablet ou usando o mouse.
          </div>

          {/* Quadro do Canvas */}
          <div style={{
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            touchAction: 'none' // Impede a rolagem de tela ao desenhar no celular
          }}>
            <canvas
              ref={canvasRef}
              width={460}
              height={200}
              style={{
                display: 'block',
                cursor: 'crosshair',
                touchAction: 'none',
                backgroundColor: '#FFFFFF'
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          {/* Botões de Ação do Quadro */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={clearCanvas}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-main)',
                color: 'var(--color-text-main)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={16} /> Limpar Tela
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'white',
                  color: 'var(--color-text-muted)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: '#10B981',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Check size={18} /> Confirmar & Salvar
              </button>
            </div>
          </div>

        </div>

        {/* Rodapé Informativo */}
        <div style={{ backgroundColor: '#F1F5F9', padding: '0.75rem 1.5rem', borderTop: '1px solid #E2E8F0', fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={16} color="var(--color-primary)" />
          Validação Digital de Treinamento POKA-YOKE — Forvia Faurecia
        </div>

      </div>
    </div>
  );
}

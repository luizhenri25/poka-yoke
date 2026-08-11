import React, { useState, useEffect } from 'react';
import { Edit3, X, Check, RotateCcw } from 'lucide-react';

export default function EditKpiModal({ isOpen, onClose, onSave, onResetDefault, currentKpis }) {
  const [total, setTotal] = useState(52);
  const [funcionando, setFuncionando] = useState(49);
  const [backup, setBackup] = useState(2);
  const [falha, setFalha] = useState(0);
  const [codigoMestre, setCodigoMestre] = useState('JPR-S-PSS-0013');

  useEffect(() => {
    if (isOpen && currentKpis) {
      setTotal(currentKpis.total ?? 52);
      setFuncionando(currentKpis.funcionando ?? 49);
      setBackup(currentKpis.backup ?? 2);
      setFalha(currentKpis.falha ?? 0);
      setCodigoMestre(currentKpis.codigoMestre || 'JPR-S-PSS-0013');
    }
  }, [isOpen, currentKpis]);

  if (!isOpen) return null;

  const totalNum = Math.max(1, Number(total) || 1);
  const funcionandoNum = Number(funcionando) || 0;
  const backupNum = Number(backup) || 0;
  const falhaNum = Number(falha) || 0;

  const percFuncionando = Math.round((funcionandoNum / totalNum) * 100);
  const percBackup = Math.round((backupNum / totalNum) * 100);
  const percFalha = Math.round((falhaNum / totalNum) * 100);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      total: totalNum,
      funcionando: funcionandoNum,
      backup: backupNum,
      falha: falhaNum,
      codigoMestre,
      percFuncionando,
      percBackup,
      percFalha,
      editadoPor: 'Caio Cabral (Engenheiro de Processos)',
      dataEdicao: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '0.75rem',
      backdropFilter: 'blur(4px)',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @media (max-width: 640px) {
          .kpi-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          .kpi-preview-flex {
            flex-direction: column !important;
            gap: 0.4rem !important;
          }
          .kpi-actions-flex {
            flex-direction: column-reverse !important;
            gap: 0.75rem !important;
            align-items: stretch !important;
          }
          .kpi-action-btn-group {
            flex-direction: column !important;
            width: 100% !important;
          }
        }
      `}</style>

      <div style={{
        backgroundColor: 'white',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        
        {/* Cabeçalho do Modal */}
        <div style={{
          backgroundColor: '#0A1B9F',
          color: 'white',
          padding: '1rem 1.25rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Edit3 size={20} />
              Editar Métricas & Indicadores (KPIs)
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#E2E8F0', margin: 0, marginTop: '0.2rem' }}>
              Ajuste manual dos números do Dashboard Central dos Poka-Yokes
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '0.2rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Corpo do Formulário com Scroll Vertical Seguro */}
        <form onSubmit={handleSubmit} style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          overflowY: 'auto',
          boxSizing: 'border-box'
        }}>
          
          {/* Código da Lista Mestre */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
              📜 Código da Lista Mestre Poka-Yoke
            </label>
            <input
              type="text"
              className="input-field"
              value={codigoMestre}
              onChange={(e) => setCodigoMestre(e.target.value)}
              placeholder="Ex: JPR-S-PSS-0013"
              required
              style={{ width: '100%', fontSize: '0.9rem', boxSizing: 'border-box' }}
            />
          </div>

          {/* Grid de Métricas Numéricas Responsivo */}
          <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            
            {/* Total */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                📊 Total de Poka-Yokes
              </label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                required
                style={{ width: '100%', fontSize: '1.05rem', fontWeight: 800, boxSizing: 'border-box' }}
              />
            </div>

            {/* Funcionando */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#047857', marginBottom: '0.35rem' }}>
                🟢 Funcionando (OK)
              </label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={funcionando}
                onChange={(e) => setFuncionando(e.target.value)}
                required
                style={{ width: '100%', fontSize: '1.05rem', fontWeight: 800, color: '#047857', boxSizing: 'border-box' }}
              />
            </div>

            {/* Derroga / Backup */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#B45309', marginBottom: '0.35rem' }}>
                🟡 Com Derroga / Backup
              </label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={backup}
                onChange={(e) => setBackup(e.target.value)}
                required
                style={{ width: '100%', fontSize: '1.05rem', fontWeight: 800, color: '#B45309', boxSizing: 'border-box' }}
              />
            </div>

            {/* Desativados / Falha */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#B91C1C', marginBottom: '0.35rem' }}>
                🔴 Desativados / Em Falha
              </label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={falha}
                onChange={(e) => setFalha(e.target.value)}
                required
                style={{ width: '100%', fontSize: '1.05rem', fontWeight: 800, color: '#B91C1C', boxSizing: 'border-box' }}
              />
            </div>

          </div>

          {/* Pré-visualização dos Cálculos Percentuais */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem'
          }}>
            <strong style={{ display: 'block', color: 'var(--color-primary-dark)', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
              ⚡ Cálculos Recalculados em Tempo Real:
            </strong>
            <div className="kpi-preview-flex" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span>Funcionando: <strong style={{ color: '#10B981' }}>{percFuncionando}%</strong></span>
              <span>Com Derroga: <strong style={{ color: '#F59E0B' }}>{percBackup}%</strong></span>
              <span>Em Falha: <strong style={{ color: '#EF4444' }}>{percFalha}%</strong></span>
            </div>
          </div>

          {/* Rodapé com Ações */}
          <div className="kpi-actions-flex" style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--color-border)',
            gap: '0.75rem',
            flexShrink: 0
          }}>
            <button
              type="button"
              onClick={() => { onResetDefault(); onClose(); }}
              style={{
                backgroundColor: '#F1F5F9',
                border: '1px solid #CBD5E1',
                color: '#475569',
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <RotateCcw size={15} /> Restaurar CSV
            </button>

            <div className="kpi-action-btn-group" style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'white',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                style={{
                  backgroundColor: '#0A1B9F',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 1.15rem',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Check size={17} /> Salvar Métricas
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

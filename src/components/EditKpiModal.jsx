import React, { useState, useEffect } from 'react';
import { Edit3, X, Check, RotateCcw, ShieldCheck, Activity, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

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
        maxWidth: '580px',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}>
        
        {/* Cabeçalho do Modal */}
        <div style={{
          backgroundColor: '#0A1B9F',
          color: 'white',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Edit3 size={22} />
              Editar Métricas & Indicadores (KPIs)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#E2E8F0', margin: 0, marginTop: '0.2rem' }}>
              Ajuste manual dos números do Dashboard Central dos Poka-Yokes
            </p>
          </div>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Formulário de Edição de KPIs */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Código da Lista Mestre */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
              📜 Código da Lista Mestre Poka-Yoke
            </label>
            <input
              type="text"
              className="input-field"
              value={codigoMestre}
              onChange={(e) => setCodigoMestre(e.target.value)}
              placeholder="Ex: JPR-S-PSS-0013"
              required
              style={{ width: '100%', fontSize: '0.9rem' }}
            />
          </div>

          {/* Grid de Métricas Numéricas */}
          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            
            {/* Total */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
                📊 Total de Poka-Yokes
              </label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                required
                style={{ width: '100%', fontSize: '1.1rem', fontWeight: 800 }}
              />
            </div>

            {/* Funcionando */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#047857', marginBottom: '0.4rem' }}>
                🟢 Funcionando (OK)
              </label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={funcionando}
                onChange={(e) => setFuncionando(e.target.value)}
                required
                style={{ width: '100%', fontSize: '1.1rem', fontWeight: 800, color: '#047857' }}
              />
            </div>

            {/* Derroga / Backup */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#B45309', marginBottom: '0.4rem' }}>
                🟡 Com Derroga / Backup
              </label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={backup}
                onChange={(e) => setBackup(e.target.value)}
                required
                style={{ width: '100%', fontSize: '1.1rem', fontWeight: 800, color: '#B45309' }}
              />
            </div>

            {/* Desativados / Falha */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#B91C1C', marginBottom: '0.4rem' }}>
                🔴 Desativados / Em Falha
              </label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={falha}
                onChange={(e) => setFalha(e.target.value)}
                required
                style={{ width: '100%', fontSize: '1.1rem', fontWeight: 800, color: '#B91C1C' }}
              />
            </div>

          </div>

          {/* Pré-visualização dos Cálculos Percentuais */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            <strong style={{ display: 'block', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              ⚡ Cálculos Percentuais Recalculados em Tempo Real:
            </strong>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Disponibilidade (Funcionando): <strong style={{ color: '#10B981' }}>{percFuncionando}%</strong></span>
              <span>Com Derroga: <strong style={{ color: '#F59E0B' }}>{percBackup}%</strong></span>
              <span>Em Falha: <strong style={{ color: '#EF4444' }}>{percFalha}%</strong></span>
            </div>
          </div>

          {/* Rodapé com Ações */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <button
              type="button"
              onClick={() => { onResetDefault(); onClose(); }}
              style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', padding: '0.6rem 0.9rem', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RotateCcw size={16} /> Restaurar CSV
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: '#0A1B9F', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontWeight: 800, fontSize: '0.85rem' }}
              >
                <Check size={18} /> Salvar Métricas de Engenharia
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

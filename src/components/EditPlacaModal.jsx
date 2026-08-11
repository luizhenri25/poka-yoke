import React, { useState, useEffect } from 'react';
import { Edit3, X, Check, RotateCcw, Wrench, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function EditPlacaModal({ isOpen, onClose, onSave, onResetDefault, postoName, linhaName, currentPlacaData }) {
  const [especificacao, setEspecificacao] = useState('');
  const [falhaEvitada, setFalhaEvitada] = useState('');
  const [instrucao, setInstrucao] = useState('');
  const [statusPY, setStatusPY] = useState('FUNCIONANDO');
  const [procedimentoOK, setProcedimentoOK] = useState('');
  const [procedimentoNOK, setProcedimentoNOK] = useState('');

  useEffect(() => {
    if (isOpen && currentPlacaData) {
      setEspecificacao(currentPlacaData.especificacao || '');
      setFalhaEvitada(currentPlacaData.falhaEvitada || '');
      setInstrucao(currentPlacaData.instrucao || '');
      setStatusPY(currentPlacaData.statusPY || 'FUNCIONANDO');
      setProcedimentoOK(currentPlacaData.procedimentoOK || '');
      setProcedimentoNOK(currentPlacaData.procedimentoNOK || '');
    }
  }, [isOpen, currentPlacaData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      especificacao,
      falhaEvitada,
      instrucao,
      statusPY,
      procedimentoOK,
      procedimentoNOK,
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
        maxWidth: '680px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
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
              Edição Técnica da Placa Poka-Yoke
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#E2E8F0', margin: 0, marginTop: '0.2rem' }}>
              Linha: <strong>{linhaName}</strong> | Posto: <strong>{postoName}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Formulário de Edição */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Especificação Técnica */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
              🛠️ Especificação Técnica do Dispositivo
            </label>
            <textarea
              className="input-field"
              rows={2}
              value={especificacao}
              onChange={(e) => setEspecificacao(e.target.value)}
              placeholder="Ex: Sensor Óptico PNP de Barreira + Trava Mecânica de Presença..."
              required
              style={{ width: '100%', fontSize: '0.875rem' }}
            />
          </div>

          {/* Falha Evitada */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#B91C1C', marginBottom: '0.4rem' }}>
              ⚠️ Falha Evitada (Impacto no Processo/Qualidade)
            </label>
            <textarea
              className="input-field"
              rows={2}
              value={falhaEvitada}
              onChange={(e) => setFalhaEvitada(e.target.value)}
              placeholder="Ex: Prevenir a montagem invertida do encosto dianteiro direito..."
              required
              style={{ width: '100%', fontSize: '0.875rem' }}
            />
          </div>

          {/* Código da Instrução & Status */}
          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
                📜 Código & Título da Instrução PY
              </label>
              <input
                type="text"
                className="input-field"
                value={instrucao}
                onChange={(e) => setInstrucao(e.target.value)}
                placeholder="Ex: JPR-I-PSS-2025 Rev 02 (Inversão Encosto)"
                required
                style={{ width: '100%', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
                🚦 Status Operacional do Dispositivo
              </label>
              <select
                className="input-field"
                value={statusPY}
                onChange={(e) => setStatusPY(e.target.value)}
                style={{ width: '100%', fontSize: '0.875rem', fontWeight: 700 }}
              >
                <option value="FUNCIONANDO">🟢 FUNCIONANDO (100% OK)</option>
                <option value="EM MANUTENÇÃO">🟡 EM MANUTENÇÃO (Ajuste Técnico)</option>
                <option value="MODO BACKUP">🔴 MODO BACKUP (Contingência Ativa)</option>
              </select>
            </div>
          </div>

          {/* Procedimento Função OK */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#047857', marginBottom: '0.4rem' }}>
              ✅ Procedimento Operacional — Função OK
            </label>
            <textarea
              className="input-field"
              rows={2}
              value={procedimentoOK}
              onChange={(e) => setProcedimentoOK(e.target.value)}
              placeholder="Instruções quando o sistema aprova a operação..."
              required
              style={{ width: '100%', fontSize: '0.875rem' }}
            />
          </div>

          {/* Procedimento Função NÃO OK */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#B91C1C', marginBottom: '0.4rem' }}>
              ❌ Procedimento Operacional — Função NÃO OK (NOK)
            </label>
            <textarea
              className="input-field"
              rows={2}
              value={procedimentoNOK}
              onChange={(e) => setProcedimentoNOK(e.target.value)}
              placeholder="Ações imediatas caso o dispositivo alarme falha ou erro de torque..."
              required
              style={{ width: '100%', fontSize: '0.875rem' }}
            />
          </div>

          {/* Rodapé com Ações */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <button
              type="button"
              onClick={() => { onResetDefault(); onClose(); }}
              style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RotateCcw size={16} /> Restaurar Padrão
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
                <Check size={18} /> Salvar Alterações de Engenharia
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

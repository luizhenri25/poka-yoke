import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Video, 
  ExternalLink,
  Layers,
  FileText
} from 'lucide-react';
import { getPostoLink } from '../data/postoLinksData';

export default function DetailKpiModal({ isOpen, onClose, statusType, pokaYokesList }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filtragem dos itens conforme o status selecionado nos cards do Dashboard
  const filteredItems = pokaYokesList.filter(py => {
    const st = String(py['STATUS PY'] || '').toUpperCase();
    if (statusType === 'FUNCIONANDO') {
      if (!st.includes('FUNCIONANDO') && !st.includes('OK')) return false;
    } else if (statusType === 'DERROGA') {
      if (!st.includes('DERROGA') && !st.includes('BACKUP') && !st.includes('PENDENTE')) return false;
    } else if (statusType === 'DESATIVADO') {
      if (!st.includes('DESATIVADO') && !st.includes('FALHA') && !st.includes('NOK')) return false;
    }

    // Filtragem por Lupa de Busca 🔍 (Posto, PY, Especificação, Falha Evitada)
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const posto = String(py['DISPOSITIVO/POSTO'] || '').toLowerCase();
    const codigo = String(py.PY || '').toLowerCase();
    const espec = String(py.Especificacao || '').toLowerCase();
    const falha = String(py['Falha Evitada'] || '').toLowerCase();
    const linha = String(py.LINHA || '').toLowerCase();

    return posto.includes(term) || codigo.includes(term) || espec.includes(term) || falha.includes(term) || linha.includes(term);
  });

  // Configurações Visuais do Cabeçalho por Tipo de Status
  const getHeaderConfig = () => {
    switch (statusType) {
      case 'FUNCIONANDO':
        return {
          title: '🟢 Poka-Yokes Funcionando (Operação Padrão)',
          subtitle: `${filteredItems.length} dispositivos em operação normal com 100% de disponibilidade`,
          bgColor: '#065F46',
          badgeBg: '#ECFDF5',
          badgeColor: '#047857',
          icon: <CheckCircle2 size={24} />
        };
      case 'DERROGA':
        return {
          title: '🟡 Poka-Yokes em Modo Derroga / Backup (Contingência)',
          subtitle: `${filteredItems.length} dispositivos operando em plano de contingência sob acompanhamento`,
          bgColor: '#92400E',
          badgeBg: '#FFFBEB',
          badgeColor: '#B45309',
          icon: <AlertTriangle size={24} />
        };
      case 'DESATIVADO':
        return {
          title: '🔴 Poka-Yokes Desativados ou em Falha (Manutenção Requerida)',
          subtitle: `${filteredItems.length} dispositivos parados que necessitam ação corretiva imediata`,
          bgColor: '#991B1B',
          badgeBg: '#FEF2F2',
          badgeColor: '#B91C1C',
          icon: <XCircle size={24} />
        };
      default:
        return {
          title: '📋 Todos os Poka-Yokes Cadastrados no Sistema',
          subtitle: `Visão geral completa dos ${filteredItems.length} Poka-Yokes da fábrica (BDIA e BTR)`,
          bgColor: '#0A1B9F',
          badgeBg: '#EEF2FF',
          badgeColor: '#0A1B9F',
          icon: <ShieldCheck size={24} />
        };
    }
  };

  const headerConfig = getHeaderConfig();

  const getStatusBadge = (statusStr) => {
    const st = String(statusStr || '').toUpperCase();
    if (st.includes('FUNCIONANDO') || st.includes('OK')) {
      return (
        <span style={{ backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <CheckCircle2 size={13} /> FUNCIONANDO
        </span>
      );
    }
    if (st.includes('DERROGA') || st.includes('BACKUP') || st.includes('PENDENTE')) {
      return (
        <span style={{ backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <AlertTriangle size={13} /> MODO BACKUP
        </span>
      );
    }
    return (
      <span style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FCA5A5', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
        <XCircle size={13} /> DESATIVADO / FALHA
      </span>
    );
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)'
      }}
    >
      {/* Estilos CSS Inline para Barra de Rolagem Suave */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .modal-scroll-area::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .modal-scroll-area::-webkit-scrollbar-track {
            background: #F1F5F9;
            border-radius: 4px;
          }
          .modal-scroll-area::-webkit-scrollbar-thumb {
            background: #94A3B8;
            border-radius: 4px;
          }
          .modal-scroll-area::-webkit-scrollbar-thumb:hover {
            background: #0A1B9F;
          }
        `
      }} />

      {/* Caixa do Modal Centralizado */}
      <div 
        onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar no conteúdo
        style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-xl)',
          width: '94vw',
          maxWidth: '1100px',
          height: '86vh',
          maxHeight: '820px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          margin: 'auto'
        }}
      >
        
        {/* Cabeçalho do Modal (Fixo no Topo) */}
        <div style={{
          backgroundColor: headerConfig.bgColor,
          color: 'white',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 'var(--radius-md)' }}>
              {headerConfig.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, letterSpacing: '-0.2px' }}>
                {headerConfig.title}
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#E2E8F0', margin: 0, marginTop: '0.2rem' }}>
                {headerConfig.subtitle}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Fechar (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lupa de Pesquisa Ficha (Fixa no Topo do Conteúdo) */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <Search size={18} color="var(--color-primary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Pesquisar por posto, código PY, função ou erro (ex: Posto 3, Airbag, Cinto)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.75rem', width: '100%', fontSize: '0.875rem', backgroundColor: 'white' }}
              />
            </div>

            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)', backgroundColor: '#EEF2FF', padding: '0.35rem 0.75rem', borderRadius: '12px' }}>
              {filteredItems.length} registros listados
            </span>
          </div>
        </div>

        {/* Corpo com Rolagem Suave Personalizada */}
        <div className="modal-scroll-area" style={{ padding: '1rem 1.5rem', flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'white' }}>
            {filteredItems.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Nenhum Poka-Yoke encontrado para a busca "{searchTerm}".
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#F1F5F9', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1rem', width: '20%', color: 'var(--color-primary-dark)', fontWeight: 800 }}>Posto / Linha</th>
                    <th style={{ padding: '0.85rem 1rem', width: '15%', color: 'var(--color-primary-dark)', fontWeight: 800 }}>Poka-Yoke Nº</th>
                    <th style={{ padding: '0.85rem 1rem', width: '28%', color: 'var(--color-primary-dark)', fontWeight: 800 }}>Função / Especificação Técnica</th>
                    <th style={{ padding: '0.85rem 1rem', width: '25%', color: 'var(--color-primary-dark)', fontWeight: 800 }}>Falha Evitada / Prevenção de Erro</th>
                    <th style={{ padding: '0.85rem 1rem', width: '12%', textAlign: 'center', color: 'var(--color-primary-dark)', fontWeight: 800 }}>Status / Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => {
                    const posto = item['DISPOSITIVO/POSTO'] || 'Posto Geral';
                    const linha = item.LINHA || 'LINHA';
                    const pyCode = item.PY || `PY-${idx + 1}`;
                    const espec = item.Especificacao || item['DISPOSITIVO/POSTO'] || 'Dispositivo de Controle de Qualidade';
                    const falha = item['Falha Evitada'] || 'Prevenção de não conformidade no processo';
                    const status = item['STATUS PY'] || 'FUNCIONANDO';

                    // Buscar link do vídeo mLEAN para este posto
                    const videoLink = getPostoLink(statusType, linha, posto);

                    return (
                      <tr 
                        key={idx}
                        style={{
                          borderBottom: '1px solid var(--color-border)',
                          backgroundColor: idx % 2 === 0 ? 'white' : '#F9FAFB',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        {/* Posto / Linha */}
                        <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '0.9rem' }}>
                            📍 {posto}
                          </div>
                          <span style={{ fontSize: '0.72rem', backgroundColor: '#EEF2FF', color: 'var(--color-primary)', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 700, display: 'inline-block', marginTop: '0.25rem' }}>
                            LINHA {linha}
                          </span>
                        </td>

                        {/* Poka Yoke Nº */}
                        <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 800, color: '#0A1B9F', fontSize: '0.9rem' }}>
                            🔢 {pyCode}
                          </div>
                          {item.Instrucao && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.2rem' }}>
                              📜 {item.Instrucao}
                            </span>
                          )}
                        </td>

                        {/* Especificação / Função */}
                        <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top', color: 'var(--color-text-main)', lineHeight: '1.4' }}>
                          <strong>{espec}</strong>
                        </td>

                        {/* Falha Evitada */}
                        <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top', color: '#334155', lineHeight: '1.4' }}>
                          <span style={{ color: '#B91C1C', fontWeight: 700 }}>🛡️ </span>
                          {falha}
                        </td>

                        {/* Status e Link do Vídeo mLEAN */}
                        <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top', textAlign: 'center' }}>
                          {getStatusBadge(status)}

                          {videoLink && (
                            <a
                              href={videoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                marginTop: '0.5rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontSize: '0.72rem',
                                backgroundColor: '#EEF2FF',
                                color: '#0A1B9F',
                                border: '1px solid #C7D2FE',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                fontWeight: 800,
                                textDecoration: 'none'
                              }}
                            >
                              <Video size={12} /> Ver Vídeo mLEAN
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>

        {/* Rodapé do Modal (Fixo na Base) */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            💡 Sistema de Monitoramento POKA-YOKE (Rev05) — Forvia Faurecia
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: '#0A1B9F',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Fechar Visualização
          </button>
        </div>

      </div>
    </div>
  );
}

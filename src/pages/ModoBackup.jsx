import React, { useState } from 'react';
import { ChevronRight, ShieldAlert, FileText, Video, ExternalLink } from 'lucide-react';
import { modoBackupData, regraComumBackup, frequenciaValidacao } from '../data/modoBackupData';
import { getPostoLink } from '../data/postoLinksData';

const BDIA_POSTOS = ['POSTO 3', 'POSTO 4', 'POSTO 6', 'POSTO 8', 'POSTO 9', 'POSTO 10', 'POSTO 12', 'IF BDIA', 'RETRABALHO'];
const BTR_POSTOS = ['PREPARAÇÃO DA ESTRUTURA', 'POSTO 6', 'POSTO 7', 'INSPEÇÃO FINAL - P13C', 'INSPEÇÃO FINAL - P02H'];

export default function ModoBackup() {
  const [activeTab, setActiveTab] = useState('BDIA');
  const [selectedPosto, setSelectedPosto] = useState('');

  const postos = activeTab === 'BDIA' ? BDIA_POSTOS : BTR_POSTOS;
  const backupData = modoBackupData[activeTab]?.[selectedPosto];
  const currentLink = getPostoLink('MODO_BACKUP', activeTab, selectedPosto);

  return (
    <div className="page-grid">
      {/* Sidebar - Selecione o Posto */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', height: 'fit-content' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Selecione o Posto</h2>
            <span style={{ backgroundColor: 'var(--color-bg-main)', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
              {postos.length} Ativos
            </span>
          </div>
          <div className="segmented-control">
            <button 
              className={`segmented-btn ${activeTab === 'BDIA' ? 'active' : ''}`}
              onClick={() => { setActiveTab('BDIA'); setSelectedPosto(''); }}
            >
              BDIA
            </button>
            <button 
              className={`segmented-btn ${activeTab === 'BTR' ? 'active' : ''}`}
              onClick={() => { setActiveTab('BTR'); setSelectedPosto(''); }}
            >
              BTR
            </button>
          </div>
        </div>
        
        <div className="sidebar-list">
          {postos.map((posto, idx) => (
            <button 
              key={posto || idx}
              className={`posto-item ${selectedPosto === posto ? 'active' : ''}`}
              onClick={() => setSelectedPosto(posto)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className={`status-dot ${modoBackupData[activeTab]?.[posto] ? 'green' : 'gray'}`}></div>
                {posto}
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div>
        {!selectedPosto ? (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <ShieldAlert size={64} style={{ color: 'var(--color-border)', marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Modo Backup</h3>
            <p style={{ maxWidth: '400px' }}>Selecione um posto no menu lateral para visualizar os procedimentos técnicos do modo backup.</p>
          </div>
        ) : (
          <div className="card" style={{ minHeight: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <FileText size={24} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Procedimento Modo Backup - {selectedPosto}</h2>
            </div>

            {/* Link do Vídeo de Backup (mLEAN Corp) */}
            {currentLink && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1.5px solid #EF4444',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ backgroundColor: '#EF4444', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
                    <Video size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#991B1B', margin: 0 }}>
                      Vídeo & Padrão Visual Modo Backup (mLEAN) — {selectedPosto}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#B91C1C', margin: 0, marginTop: '0.2rem' }}>
                      Treinamento visual e instrução técnica para contingência do posto
                    </p>
                  </div>
                </div>

                <a
                  href={currentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    backgroundColor: '#DC2626',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none'
                  }}
                >
                  <ExternalLink size={16} /> Abrir Vídeo / Padrão Modo Backup (mLEAN)
                </a>
              </div>
            )}

            {backupData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--color-bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  {backupData.map((step, idx) => (
                    <div key={idx} style={{ marginBottom: idx === backupData.length - 1 ? 0 : '1rem' }}>
                      <strong style={{ color: 'var(--color-text-main)' }}>{step.title}</strong>{' '}
                      <span style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{step.text}</span>
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <h4 style={{ color: '#3B82F6', fontWeight: 700, marginBottom: '0.75rem' }}>Frequência de Validação de Poka Yoke</h4>
                  <p style={{ color: 'var(--color-text-main)', lineHeight: '1.6' }}>
                    <strong style={{ color: '#2563EB' }}>Regra geral: </strong> 
                    {frequenciaValidacao}
                  </p>
                </div>

                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <h4 style={{ color: '#EF4444', fontWeight: 700, marginBottom: '0.75rem' }}>Regras Comuns para Todos os Postos</h4>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--color-text-main)', gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                    {regraComumBackup.map((regra, idx) => (
                      <li key={idx} style={{ lineHeight: '1.5' }}>{regra}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', backgroundColor: 'var(--color-bg-main)', borderRadius: 'var(--radius-lg)' }}>
                <ShieldAlert size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Nenhum Backup Registrado</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Não foram encontrados procedimentos de Modo Backup para o {selectedPosto}.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

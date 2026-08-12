import React, { useState, useEffect } from 'react';
import { Volume2, Square, CheckCircle, AlertTriangle, ChevronRight, Activity, ExternalLink, Video } from 'lucide-react';
import { fetchPokaYokesData, fetchFullInstructionText } from '../utils/csvParser';
import { getPostoLink } from '../data/postoLinksData';

const BDIA_POSTOS = [
  'POSTO 3', 'POSTO 4', 'POSTO 6', 'POSTO 8', 'POSTO 9', 'POSTO 10', 'POSTO 12', 'IF BDIA', 'RETRABALHO'
];

const BTR_POSTOS = [
  'PREPARAÇÃO DA ESTRUTURA', 'POSTO 6', 'POSTO 7', 'INSPEÇÃO FINAL - P13C', 'INSPEÇÃO FINAL - P02H'
];

export default function LiberacaoProcessos() {
  const [activeTab, setActiveTab] = useState('BDIA');
  const [playing, setPlaying] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosto, setSelectedPosto] = useState('');
  const [fullInstructions, setFullInstructions] = useState([]);

  const currentLink = getPostoLink('LIBERACAO_PY', activeTab, selectedPosto);

  useEffect(() => {
    async function loadData() {
      const items = await fetchPokaYokesData();
      setData(items);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadFullInstructions() {
      if (selectedPosto) {
        const instructions = await fetchFullInstructionText(selectedPosto);
        setFullInstructions(instructions);
      } else {
        setFullInstructions([]);
      }
    }
    loadFullInstructions();
  }, [selectedPosto]);

  const handlePlayAudio = (text) => {
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.onend = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  };

  const filteredData = data.filter(item => String(item.LINHA || '').toUpperCase().includes(activeTab));
  
  const postos = activeTab === 'BDIA' ? BDIA_POSTOS : BTR_POSTOS;

  const pokaYokesDoPosto = data.filter(item => {
    let postoItem = String(item['DISPOSITIVO/POSTO'] || '').toUpperCase().trim();
    const postoFiltro = String(selectedPosto || '').toUpperCase().trim();
    
    // Mapeamentos específicos para BTR e nomes divergentes
    if (postoItem === 'DFE015') postoItem = 'PREPARAÇÃO DA ESTRUTURA';
    if (postoItem.includes('PIVOT PIN') || postoItem.includes('POSTO 7')) postoItem = 'POSTO 7';
    if (postoItem === 'INSPEÇÃO FINAL P13C') postoItem = 'INSPEÇÃO FINAL - P13C';
    if (postoItem === 'INSPEÇÃO FINAL P02H') postoItem = 'INSPEÇÃO FINAL - P02H';

    const normalize = (p) => String(p).replace(/POSTO 0+(\d+)/, 'POSTO $1').replace(/\s+/g, ' ');
    
    return normalize(postoItem) === normalize(postoFiltro) || normalize(postoItem).includes(normalize(postoFiltro));
  });

  // Criar o texto que será lido em voz alta
  let textoParaLer = '';
  if (selectedPosto) {
    textoParaLer = `Instruções para o ${selectedPosto}. `;
    pokaYokesDoPosto.forEach((py, index) => {
      textoParaLer += `Poka Yoke ${index + 1}. Especificação: ${py.Especificacao}. Falha Evitada: ${py['Falha Evitada']}. `;
    });
  }

  if (loading) return <div className="card text-center"><p>Carregando dados dos postos...</p></div>;

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
              onClick={() => { setActiveTab('BDIA'); setSelectedPosto(''); window.speechSynthesis.cancel(); setPlaying(false); }}
            >
              BDIA
            </button>
            <button 
              className={`segmented-btn ${activeTab === 'BTR' ? 'active' : ''}`}
              onClick={() => { setActiveTab('BTR'); setSelectedPosto(''); window.speechSynthesis.cancel(); setPlaying(false); }}
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
                <div className={`status-dot ${selectedPosto === posto ? 'green' : 'gray'}`}></div>
                {posto}
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </div>
      
      {/* Conteúdo Principal */}
      <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600 }}>Descrição da Atividade</h3>
            <button 
              className={`btn ${playing ? 'btn-outline' : 'btn-primary'}`} 
              onClick={() => handlePlayAudio(textoParaLer)}
              disabled={!selectedPosto}
            >
              {playing ? <Square key="square" size={18} fill="currentColor" /> : <Volume2 key="volume" size={18} />}
              {playing ? 'Parar Leitura' : 'Ouvir Instrução'}
            </button>
          </div>
          
          <div className="card" style={{ minHeight: '400px' }}>
            {!selectedPosto ? (
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                 <Activity size={64} style={{ color: 'var(--color-border)', marginBottom: '1.5rem' }} />
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Liberação de Processos</h3>
                 <p style={{ maxWidth: '400px' }}>Selecione um posto no menu lateral para visualizar e ouvir as instruções de liberação.</p>
               </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Link do Vídeo e Padrão Visual (mLEAN Corp) */}
                {currentLink && (
                  <div style={{
                    backgroundColor: '#ECFDF5',
                    border: '1.5px solid #10B981',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ backgroundColor: '#10B981', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
                        <Video size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#065F46', margin: 0 }}>
                          Vídeo & Padrão Visual mLEAN — {selectedPosto}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: '#047857', margin: 0, marginTop: '0.2rem' }}>
                          Link oficial da plataforma Faurecia mLEAN para treinamento visual do posto
                        </p>
                      </div>
                    </div>

                    <a
                      href={currentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{
                        backgroundColor: '#059669',
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
                      <ExternalLink size={16} /> Assistir Vídeo / Ver Padrão mLEAN
                    </a>
                  </div>
                )}

                {/* Resumo Rápido e Áudio */}
                <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1rem', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.5rem' }}>
                    Resumo do Posto (Áudio)
                  </h4>
                  {pokaYokesDoPosto.length === 0 && (
                    <p className="text-muted">Nenhuma instrução resumida cadastrada para este posto.</p>
                  )}
                  {pokaYokesDoPosto.map((py, idx) => (
                    <div key={py.PY || idx} style={{ paddingBottom: '1rem', borderBottom: idx === pokaYokesDoPosto.length - 1 ? 'none' : '1px solid var(--color-border)', marginBottom: idx === pokaYokesDoPosto.length - 1 ? 0 : '1rem' }}>
                      <p style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>{py.PY}</p>
                      <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}><strong>Especificação:</strong> {py.Especificacao}</p>
                      <p style={{ fontSize: '0.9rem' }}><strong>Falha Evitada:</strong> {py['Falha Evitada']}</p>
                    </div>
                  ))}
                </div>

                {/* Passo a Passo Completo (Para Leitura Visual) */}
                <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1rem', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.5rem' }}>
                    Método de Validação Completo (Leitura do Operador)
                  </h4>
                  
                  {fullInstructions.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B45309', backgroundColor: '#FEF3C7', padding: '1rem', borderRadius: '4px' }}>
                      <AlertTriangle size={18} />
                      <p style={{ fontSize: '0.9rem' }}>Nenhum passo a passo detalhado encontrado nos arquivos de instrução para este posto.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {fullInstructions.map((step, idx) => {
                        if (step.type === 'title') {
                          return <h5 key={idx} style={{ fontWeight: 600, color: 'var(--color-primary)', marginTop: '0.5rem' }}>{step.text}</h5>;
                        } else if (step.type === 'step') {
                          return (
                            <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '4px' }}>
                              <CheckCircle size={16} style={{ color: '#10B981', marginTop: '0.1rem', flexShrink: 0 }} />
                              <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#334155' }}>{step.text}</p>
                            </div>
                          );
                        } else {
                          return <p key={idx} style={{ fontSize: '0.95rem', color: '#64748B', paddingLeft: '1.75rem', fontStyle: 'italic' }}>{step.text}</p>;
                        }
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
  );
}

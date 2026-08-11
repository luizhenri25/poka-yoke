import React, { useState, useEffect } from 'react';
import { AlertCircle, FileImage, Download, ChevronRight, Edit3, ShieldCheck, RotateCcw, Search } from 'lucide-react';
import { fetchPokaYokesData } from '../utils/csvParser';
import { useAuth } from '../context/AuthContext';
import EditPlacaModal from '../components/EditPlacaModal';

const BDIA_POSTOS = [
  'POSTO 3', 'POSTO 4', 'POSTO 6', 'POSTO 8', 'POSTO 9', 'POSTO 10', 'POSTO 12', 'IF BDIA', 'RETRABALHO'
];

const BTR_POSTOS = [
  'PREPARAÇÃO DA ESTRUTURA', 'POSTO 6', 'POSTO 7', 'INSPEÇÃO FINAL - P13C', 'INSPEÇÃO FINAL - P02H'
];

export default function Placas() {
  const { isEngenheiro } = useAuth();
  const [activeTab, setActiveTab] = useState('BDIA');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosto, setSelectedPosto] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchPosto, setSearchPosto] = useState('');

  const postos = activeTab === 'BDIA' ? BDIA_POSTOS : BTR_POSTOS;
  const filteredPostos = postos.filter(p => p.toLowerCase().includes(searchPosto.toLowerCase().trim()));

  // Armazenamento de edições de engenharia persistidas em localStorage
  const [customEdits, setCustomEdits] = useState(() => {
    const saved = localStorage.getItem('poka_yoke_placas_edits');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('poka_yoke_placas_edits', JSON.stringify(customEdits));
  }, [customEdits]);

  useEffect(() => {
    async function loadData() {
      const items = await fetchPokaYokesData();
      setData(items);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filtra de forma mais flexível para evitar problemas com espaços e nomes diferentes na planilha mestre
  const pokaYokesDoPosto = data.filter(item => {
    let postoItem = String(item['DISPOSITIVO/POSTO'] || '').toUpperCase().trim();
    const postoFiltro = String(selectedPosto || '').toUpperCase().trim();
    
    // Mapeamentos específicos do BTR na planilha mestre
    if (postoItem === 'DFE015') postoItem = 'PREPARAÇÃO DA ESTRUTURA';
    if (postoItem.includes('PIVOT PIN') || postoItem.includes('POSTO 7')) postoItem = 'POSTO 7';
    if (postoItem === 'INSPEÇÃO FINAL P13C') postoItem = 'INSPEÇÃO FINAL - P13C';
    if (postoItem === 'INSPEÇÃO FINAL P02H') postoItem = 'INSPEÇÃO FINAL - P02H';

    const normalize = (p) => String(p).replace(/POSTO 0+(\d+)/, 'POSTO $1').replace(/\s+/g, ' ');
    
    return normalize(postoItem) === normalize(postoFiltro) || normalize(postoItem).includes(normalize(postoFiltro));
  });

  const postoKey = `${activeTab}_${selectedPosto}`;
  const currentCustomEdit = customEdits[postoKey] || null;

  const handleSaveEdits = (updatedData) => {
    setCustomEdits(prev => ({
      ...prev,
      [postoKey]: updatedData
    }));
  };

  const handleResetDefault = () => {
    setCustomEdits(prev => {
      const copy = { ...prev };
      delete copy[postoKey];
      return copy;
    });
  };

  if (loading) {
    return <div className="card text-center"><p>Carregando dados das placas...</p></div>;
  }

  return (
    <div className="page-grid">
      {/* Sidebar - Selecione o Posto */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', height: 'fit-content' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Selecione o Posto</h2>
            <span style={{ backgroundColor: 'var(--color-bg-main)', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
              {filteredPostos.length} Ativos
            </span>
          </div>

          <div className="segmented-control" style={{ margin: 0 }}>
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

          {/* Lupa de Pesquisa de Postos 🔍 */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={15} color="var(--color-primary)" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Filtrar posto (ex: Posto 3)..."
              value={searchPosto}
              onChange={(e) => setSearchPosto(e.target.value)}
              style={{ paddingLeft: '2rem', fontSize: '0.8rem', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        </div>
        
        <div className="sidebar-list">
          {filteredPostos.map((posto, idx) => (
            <button 
              key={posto || idx}
              className={`posto-item ${selectedPosto === posto ? 'active' : ''}`}
              onClick={() => { setSelectedPosto(posto); setPlacaPronta(false); }}
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
          {!selectedPosto ? (
            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-bg-main)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                👈 Selecione um posto ao lado para visualizar a Placa Poka-Yoke completa.
              </p>
            </div>
          ) : (
            <div style={{ border: '2px solid var(--color-primary)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-bg-card)', boxShadow: 'var(--shadow-md)' }}>
              {/* Cabeçalho da Placa Simulando Documento */}
              <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
                    Folha de Definição e Validação - Poka Yoke
                  </h3>
                  <p style={{ fontWeight: 600, marginTop: '0.25rem', margin: 0, opacity: 0.9 }}>
                    LINHA: {activeTab} | POSTO: {selectedPosto}
                  </p>
                </div>

                {isEngenheiro && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditModalOpen(true)}
                    style={{ backgroundColor: 'white', color: 'var(--color-primary-dark)', fontWeight: 800, padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-sm)' }}
                  >
                    <Edit3 size={16} /> <span>Editar Placa Poka-Yoke</span>
                  </button>
                )}
              </div>

              {/* Tag de Revisão Editada pela Engenharia */}
              {currentCustomEdit && (
                <div style={{ backgroundColor: '#EEF2FF', borderBottom: '1px solid #C7D2FE', padding: '0.65rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                    <ShieldCheck size={16} color="var(--color-primary)" />
                    Placa Poka-Yoke Editada pela Engenharia de Processos ({currentCustomEdit.editadoPor} em {currentCustomEdit.dataEdicao})
                  </div>
                  <button 
                    onClick={handleResetDefault}
                    style={{ backgroundColor: 'transparent', border: 'none', color: '#6366F1', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Restaurar Padrão de Fábrica
                  </button>
                </div>
              )}

              <div style={{ padding: '2rem' }}>
                {pokaYokesDoPosto.length === 0 ? (
                  <p className="text-muted text-center">Nenhum Poka-Yoke registrado no sistema para este posto.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '0.5rem' }}>
        
                    {/* Lista de Poka Yokes */}
                    <div style={{ borderBottom: '2px dashed var(--color-border)', paddingBottom: '1rem' }}>
                      <h4 style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Poka Yoke Nº</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {pokaYokesDoPosto.map((py, i) => (
                           <span key={py.PY || i} style={{ backgroundColor: '#EEF2FF', color: 'var(--color-primary)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: 600 }}>
                             {py.PY}
                           </span>
                        ))}
                      </div>
                    </div>

                    {/* Especificações */}
                    <div style={{ borderBottom: '2px dashed var(--color-border)', paddingBottom: '1rem' }}>
                      <h4 style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1rem', textTransform: 'uppercase' }}>Especificação Técnica do Poka Yoke</h4>
                      <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {pokaYokesDoPosto.map((py, i) => (
                           <li key={py.PY || i}>
                             <strong>{py.PY}:</strong> {currentCustomEdit?.especificacao || py.Especificacao || py['DISPOSITIVO/POSTO'] || 'Dispositivo de Controle de Qualidade'}
                           </li>
                        ))}
                      </ul>
                    </div>

                    {/* Falhas Evitadas */}
                    <div style={{ borderBottom: '2px dashed var(--color-border)', paddingBottom: '1rem' }}>
                      <h4 style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1rem', textTransform: 'uppercase' }}>Falha Evitada</h4>
                      <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {pokaYokesDoPosto.map((py, i) => (
                           <li key={py.PY || i}>
                             <strong>{py.PY}:</strong> {currentCustomEdit?.falhaEvitada || py['Falha Evitada'] || 'Prevenção de não conformidade no processo de montagem'}
                           </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Instruções */}
                    <div>
                      <h4 style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1rem', textTransform: 'uppercase' }}>Instrução PY e Status</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {pokaYokesDoPosto.map((py, i) => {
                          const statusFinal = currentCustomEdit?.statusPY || py['STATUS PY'] || 'FUNCIONANDO';
                          return (
                            <div key={py.PY || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                              <div>
                                <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{py.PY}</p>
                                <p style={{ fontSize: '0.875rem' }}>{currentCustomEdit?.instrucao || py.Instrucao || 'Conforme padrão de trabalho da linha'}</p>
                              </div>
                              <span style={{ 
                                fontSize: '0.875rem', 
                                fontWeight: 800, 
                                padding: '0.3rem 0.65rem', 
                                borderRadius: '4px', 
                                backgroundColor: statusFinal === 'FUNCIONANDO' ? '#10B981' : statusFinal === 'EM MANUTENÇÃO' ? '#F59E0B' : '#EF4444', 
                                color: 'white', 
                                whiteSpace: 'nowrap' 
                              }}>
                                {statusFinal}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Funções OK e Não OK (Procedimento Operacional) */}
                    <div style={{ marginTop: '1rem', borderTop: '2px solid var(--color-border)', paddingTop: '2rem' }}>
                      <h4 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-text-main)', marginBottom: '1rem', textAlign: 'center' }}>
                        Procedimento Operacional de Validação
                      </h4>
                      <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                        {/* Função OK */}
                        <div style={{ border: '2px solid #10B981', borderRadius: 'var(--radius-md)', padding: '1.5rem', backgroundColor: '#ECFDF5' }}>
                          <h5 style={{ fontWeight: 800, color: '#047857', marginBottom: '0.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                            Ok
                          </h5>
                          <p style={{ color: '#065F46', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            {currentCustomEdit?.procedimentoOK || 'O sistema seguiu o parâmetro correto (Torque OK, Peça Correta, Sensor de Posição OK). Ação: Registrar o valor (se aplicável), obrigação com a montagem normal da peça e liberar para o próximo posto.'}
                          </p>
                        </div>
                        
                        {/* Função Não OK (NOK) */}
                        <div style={{ border: '2px solid #EF4444', borderRadius: 'var(--radius-md)', padding: '1.5rem', backgroundColor: '#FEF2F2' }}>
                          <h5 style={{ fontWeight: 800, color: '#B91C1C', marginBottom: '0.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span>
                            Definindo não OK (Falha)
                          </h5>
                          <p style={{ color: '#991B1B', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            {currentCustomEdit?.procedimentoNOK || 'O dispositivo alarmou falha, falta de peça ou erro de torque. Ação Executável: Paralisar a linha imediatamente, acionar o líder. Caso não haja um bom funcionamento, inicie o procedimento de Modo Backup e registre o evento.'}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      {/* Modal de Edição de Placa Poka-Yoke pela Engenharia */}
      <EditPlacaModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdits}
        onResetDefault={handleResetDefault}
        postoName={selectedPosto}
        linhaName={activeTab}
        currentPlacaData={{
          especificacao: currentCustomEdit?.especificacao || pokaYokesDoPosto[0]?.Especificacao || pokaYokesDoPosto[0]?.['DISPOSITIVO/POSTO'] || '',
          falhaEvitada: currentCustomEdit?.falhaEvitada || pokaYokesDoPosto[0]?.['Falha Evitada'] || '',
          instrucao: currentCustomEdit?.instrucao || pokaYokesDoPosto[0]?.Instrucao || '',
          statusPY: currentCustomEdit?.statusPY || pokaYokesDoPosto[0]?.['STATUS PY'] || 'FUNCIONANDO',
          procedimentoOK: currentCustomEdit?.procedimentoOK || 'O sistema seguiu o parâmetro correto (Torque OK, Peça Correta, Sensor de Posição OK). Ação: Registrar o valor (se aplicável), obrigação com a montagem normal da peça e liberar para o próximo posto.',
          procedimentoNOK: currentCustomEdit?.procedimentoNOK || 'O dispositivo alarmou falha, falta de peça ou erro de torque. Ação Executável: Paralisar a linha imediatamente, acionar o líder. Caso não haja um bom funcionamento, inicie o procedimento de Modo Backup e registre o evento.'
        }}
      />

      </div>
  );
}

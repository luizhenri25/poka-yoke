import React, { useState, useEffect } from 'react';
import { BookOpen, AlertTriangle, ChevronRight, ExternalLink, FileText, CheckCircle, Clock } from 'lucide-react';
import { fetchInstrucoesList } from '../utils/csvParser';

export default function Treinamento() {
  const [activeTab, setActiveTab] = useState('BDIA');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosto, setSelectedPosto] = useState('');

  useEffect(() => {
    async function loadData() {
      const items = await fetchInstrucoesList();
      setData(items);
      setLoading(false);
    }
    loadData();
  }, []);

  const postos = [...new Set(data.filter(item => (item.JIT || '').toUpperCase().includes(activeTab)).map(item => item.Perimetro))];
  const filteredData = data.filter(item => 
    (item.JIT || '').toUpperCase().includes(activeTab) && 
    (selectedPosto ? item.Perimetro === selectedPosto : true)
  );

  if (loading) return <div className="card text-center"><p>Carregando dados dos treinamentos...</p></div>;

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
                <div className={`status-dot ${selectedPosto === posto ? 'green' : 'gray'}`}></div>
                {posto}
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </div>
      
      {/* Conteúdo Principal */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Manuais e Vídeos Técnicos</h2>
        
        {filteredData.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '2rem' }}>Nenhuma instrução encontrada para esta seleção.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredData.map((item, idx) => {
              const isAtivo = String(item.Status || '').toLowerCase().includes('ativo');
              const uniqueKey = item.Doc ? item.Doc + idx : idx;
              return (
                <div key={uniqueKey} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  backgroundColor: 'var(--color-bg-card)', 
                  border: '1px solid var(--color-border)', 
                  padding: '1.5rem', 
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-main)', borderRadius: 'var(--radius-md)' }}>
                      <FileText size={32} color="var(--color-primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                        {item.Perimetro}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {item.Standard}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <strong>Doc:</strong> {item.Doc}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem', minWidth: '150px' }}>
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      fontSize: '0.8rem', 
                      fontWeight: 600, 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      backgroundColor: isAtivo ? '#ECFDF5' : '#FFFBEB', 
                      color: isAtivo ? '#10B981' : '#F59E0B',
                      border: `1px solid ${isAtivo ? '#A7F3D0' : '#FDE68A'}`
                    }}>
                      {isAtivo ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {String(item.Status || '').toUpperCase()}
                    </span>
                    
                    <button 
                      className="btn btn-primary" 
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', width: '100%' }}
                      onClick={() => alert(`Iniciando treinamento para o ${item.Perimetro} (${item.Doc}).`)}
                    >
                      Acessar <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

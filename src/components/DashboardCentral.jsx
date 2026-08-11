import React, { useState, useEffect } from 'react';
import { fetchPokaYokesData, fetchInstrucoesList } from '../utils/csvParser';
import SignatureCanvasModal from './SignatureCanvasModal';
import AnimatedCharacterCanvas from './AnimatedCharacterCanvas';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Award, 
  UserCheck, 
  Clock, 
  Layers, 
  ShieldCheck, 
  FileCheck,
  TrendingUp,
  Search,
  Edit3
} from 'lucide-react';

export default function DashboardCentral() {
  const [pokaYokes, setPokaYokes] = useState([]);
  const [instrucoes, setInstrucoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLine, setSelectedLine] = useState('TODAS');
  const [searchOperator, setSearchOperator] = useState('');
  
  // Estado para Modal de Assinatura com o Dedo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);

  // Simulação de base de dados de treinamentos com assinaturas digitais
  const [operadores, setOperadores] = useState([
    { id: 1, nome: 'Luiz Henrique', posto: 'POSTO 3', linha: 'BDIA', instrucao: 'JPR-I-PSS-2025 (Inversão Encosto)', assinado: true, data: '03/08/2026' },
    { id: 2, nome: 'Carlos Eduardo', posto: 'POSTO 4', linha: 'BDIA', instrucao: 'JPR-I-PSS-1549 (Junção Encosto)', assinado: true, data: '02/08/2026' },
    { id: 3, nome: 'Ana Paula Santos', posto: 'POSTO 8', linha: 'BDIA', instrucao: 'JPR-I-PSS-1954 (Concatenação Airbag)', assinado: false, data: null },
    { id: 4, nome: 'Roberto Almeida', posto: 'POSTO 10', linha: 'BDIA', instrucao: 'JPR-I-PSS-1551 (Fecho de Cinto)', assinado: true, data: '01/08/2026' },
    { id: 5, nome: 'Mariana Costa', posto: 'DFE015', linha: 'BTR', instrucao: 'JPR-I-PSS-1554 (Prep. Estrutura)', assinado: false, data: null },
    { id: 6, nome: 'Fernando Silva', posto: 'POSTO 6', linha: 'BTR', instrucao: 'JPR-I-PSS-1993 (Aplicador Molicote)', assinado: true, data: '04/08/2026' },
    { id: 7, nome: 'Juliana Lima', posto: 'INSPEÇÃO FINAL P13C', linha: 'BTR', instrucao: 'JPR-I-PSS-1555 (Inspeção Final P13C)', assinado: true, data: '03/08/2026' },
    { id: 8, nome: 'Gabriel Oliveira', posto: 'INSPEÇÃO FINAL P02H', linha: 'BTR', instrucao: 'JPR-I-PSS-1981 (Inspeção Final P02H)', assinado: false, data: null },
  ]);

  useEffect(() => {
    async function loadDashboardData() {
      const [pyList, instList] = await Promise.all([
        fetchPokaYokesData(),
        fetchInstrucoesList()
      ]);
      setPokaYokes(pyList);
      setInstrucoes(instList);
      setLoading(false);
    }
    loadDashboardData();
  }, []);

  // Filtragem de PYs conforme a linha selecionada
  const filteredPYs = pokaYokes.filter(py => {
    if (selectedLine === 'TODAS') return true;
    return (py.LINHA || '').toUpperCase().includes(selectedLine);
  });

  // Métricas em Tempo Real
  const totalPYs = filteredPYs.length || 1;
  const funcionando = filteredPYs.filter(py => {
    const st = (py['STATUS PY'] || '').toUpperCase();
    return st.includes('FUNCIONANDO') || st.includes('OK');
  }).length;

  const comDerroga = filteredPYs.filter(py => {
    const st = (py['STATUS PY'] || '').toUpperCase();
    return st.includes('DERROGA') || st.includes('BACKUP') || st.includes('PENDENTE');
  }).length;

  const desativados = filteredPYs.filter(py => {
    const st = (py['STATUS PY'] || '').toUpperCase();
    return st.includes('DESATIVADO') || st.includes('FALHA') || st.includes('NOK');
  }).length;

  const percFuncionando = Math.round((funcionando / totalPYs) * 100);
  const percDerroga = Math.round((comDerroga / totalPYs) * 100);
  const percDesativados = Math.round((desativados / totalPYs) * 100);

  // Mapeamento por Linha
  const bdiaPYs = pokaYokes.filter(py => (py.LINHA || '').toUpperCase().includes('BDIA'));
  const btrPYs = pokaYokes.filter(py => (py.LINHA || '').toUpperCase().includes('BTR'));

  const bdiaFunc = bdiaPYs.filter(py => (py['STATUS PY'] || '').toUpperCase().includes('FUNCIONANDO')).length;
  const btrFunc = btrPYs.filter(py => (py['STATUS PY'] || '').toUpperCase().includes('FUNCIONANDO')).length;

  const bdiaPerc = bdiaPYs.length ? Math.round((bdiaFunc / bdiaPYs.length) * 100) : 0;
  const btrPerc = btrPYs.length ? Math.round((btrFunc / btrPYs.length) * 100) : 0;

  // Métricas de Treinamento
  const filteredOperadores = operadores.filter(op => {
    const matchLine = selectedLine === 'TODAS' || op.linha === selectedLine;
    const matchSearch = op.nome.toLowerCase().includes(searchOperator.toLowerCase()) ||
                        op.posto.toLowerCase().includes(searchOperator.toLowerCase());
    return matchLine && matchSearch;
  });

  const assinadosCount = filteredOperadores.filter(op => op.assinado).length;
  const totalOperadores = filteredOperadores.length || 1;
  const percAssinados = Math.round((assinadosCount / totalOperadores) * 100);

  const handleOpenSignatureModal = (op) => {
    setSelectedOp(op);
    setIsModalOpen(true);
  };

  const handleSaveSignature = (signatureDataUrl) => {
    if (!selectedOp) return;
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    setOperadores(prev => prev.map(op => {
      if (op.id === selectedOp.id) {
        return { 
          ...op, 
          assinado: true, 
          data: dataHoje, 
          assinaturaImg: signatureDataUrl 
        };
      }
      return op;
    }));
  };

  const toggleAssinatura = (id) => {
    setOperadores(prev => prev.map(op => {
      if (op.id === id) {
        const nextState = !op.assinado;
        const dataHoje = new Date().toLocaleDateString('pt-BR');
        return { 
          ...op, 
          assinado: nextState, 
          data: nextState ? dataHoje : null,
          assinaturaImg: nextState ? op.assinaturaImg : null
        };
      }
      return op;
    }));
  };

  if (loading) {
    return (
      <div className="card text-center" style={{ padding: '3rem' }}>
        <Activity className="animate-spin" size={40} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
        <p style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Carregando métricas em tempo real...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Cabeçalho do Dashboard Central */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.85rem', backgroundColor: 'rgba(10, 27, 159, 0.08)', borderRadius: 'var(--radius-md)' }}>
            <Activity size={30} color="var(--color-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Dashboard Central do Processista
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.2rem', margin: 0 }}>
              Monitoramento em tempo real do status dos Poka-Yokes (Rev05) & Gestão Digital de Treinamentos
            </p>
          </div>
        </div>

        {/* Filtro por Linha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Linha:</span>
          <div className="segmented-control" style={{ margin: 0 }}>
            {['TODAS', 'BDIA', 'BTR'].map(line => (
              <button
                key={line}
                className={`segmented-btn ${selectedLine === line ? 'active' : ''}`}
                onClick={() => setSelectedLine(line)}
                style={{ padding: '0.4rem 1rem' }}
              >
                {line}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cartões KPI - Status dos Poka-Yokes em Tempo Real */}
      <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
        
        {/* Total Cadastrados */}
        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ backgroundColor: '#EEF2FF', color: 'var(--color-primary)' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Total de Poka-Yokes
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              {filteredPYs.length}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              Mestre (JPR-S-PSS-0013)
            </span>
          </div>
        </div>

        {/* Funcionando */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div className="kpi-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Funcionando
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#047857', margin: 0 }}>
              {funcionando}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>
              {percFuncionando}% de disponibilidade
            </span>
          </div>
        </div>

        {/* Com Derroga / Backup */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="kpi-icon-box" style={{ backgroundColor: '#FFFBEB', color: '#F59E0B' }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Com Derroga / Backup
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#B45309', margin: 0 }}>
              {comDerroga}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>
              {percDerroga}% sob acompanhamento
            </span>
          </div>
        </div>

        {/* Desativados / Falha */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #EF4444' }}>
          <div className="kpi-icon-box" style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}>
            <XCircle size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Desativados / Falha
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#B91C1C', margin: 0 }}>
              {desativados}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>
              {percDesativados}% necessitam ação
            </span>
          </div>
        </div>

      </div>

      {/* Painel de Saúde por Linha + Gráfico de Barras de Saúde */}
      <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
        
        {/* Disponibilidade Operacional por Linha */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <TrendingUp size={20} color="var(--color-primary)" />
              Disponibilidade Operacional por Linha
            </h3>
            <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-bg-main)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
              Metas: 95% OK
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Linha BDIA */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--color-text-main)' }}>Linha BDIA (Encostos Dianteiros)</span>
                <span style={{ color: 'var(--color-primary)' }}>{bdiaFunc} de {bdiaPYs.length} PYs ({bdiaPerc}%)</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${bdiaPerc}%`, 
                    backgroundColor: bdiaPerc >= 90 ? '#10B981' : bdiaPerc >= 70 ? '#F59E0B' : '#EF4444' 
                  }}
                />
              </div>
            </div>

            {/* Linha BTR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--color-text-main)' }}>Linha BTR (Bancos Traseiros)</span>
                <span style={{ color: 'var(--color-primary)' }}>{btrFunc} de {btrPYs.length} PYs ({btrPerc}%)</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${btrPerc}%`, 
                    backgroundColor: btrPerc >= 90 ? '#10B981' : btrPerc >= 70 ? '#F59E0B' : '#EF4444' 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resumo da Gestão Digital de Treinamentos */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Award size={20} color="var(--color-primary)" />
              Conformidade Geral de Treinamentos
            </h3>
            <span style={{ fontSize: '0.75rem', backgroundColor: '#ECFDF5', color: '#10B981', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              {assinadosCount} de {filteredOperadores.length} Assinados
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Índice de Assinatura Digital dos Operadores</span>
              <span style={{ color: '#10B981', fontWeight: 800 }}>{percAssinados}% Concluído</span>
            </div>
            <div className="progress-bar-bg" style={{ height: '14px', marginBottom: '1.25rem' }}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${percAssinados}%`, backgroundColor: '#10B981' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--color-bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <UserCheck size={24} color="#10B981" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Assinados</span>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#047857', margin: 0 }}>{assinadosCount} Operadores</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={24} color="#F59E0B" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Pendentes</span>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#B45309', margin: 0 }}>{filteredOperadores.length - assinadosCount} Operadores</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mapa de Alocação de Operadores por Posto */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={22} color="var(--color-primary)" />
              Alocação dos Operadores por Posto de Trabalho
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Mapeamento em tempo real de quem está operando cada posto nas linhas BDIA e BTR.
            </p>
          </div>
          <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--color-bg-main)', color: 'var(--color-primary)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
            {filteredOperadores.length} Postos Alocados
          </span>
        </div>

        <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
          {filteredOperadores.map((op) => (
            <div key={op.id} style={{
              backgroundColor: 'white',
              border: `1.5px solid ${op.assinado ? '#A7F3D0' : '#FDE68A'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', backgroundColor: '#EEF2FF', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {op.linha}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: op.assinado ? '#10B981' : '#F59E0B' }}>
                    {op.assinado ? '✓ Habilitado' : '⏳ Pendente'}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '0 0 0.35rem 0' }}>
                  {op.posto}
                </h4>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
                  👤 {op.nome}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  {op.instrucao}
                </p>
              </div>

              <div style={{ marginTop: '0.85rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  <span>{op.assinado ? `Assinado em ${op.data}` : 'Aguardando validação'}</span>
                </span>
                <button
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: op.assinado ? '#059669' : 'var(--color-primary)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={() => toggleAssinatura(op.id)}
                >
                  <span>{op.assinado ? 'Desfazer' : 'Assinar Agora'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de Gestão de Treinamentos (Visão do Facilitador) */}
      <div className="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={22} color="var(--color-primary)" />
              Gestão de Treinamentos & Registro de Assinaturas
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Controle digital em tempo real que substitui o papel nas confirmações de instrução operacional.
            </p>
          </div>

          {/* Campo de Busca Rápida de Operador */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Buscar operador ou posto..."
              value={searchOperator}
              onChange={(e) => setSearchOperator(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.85rem 0.5rem 2.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* Tabela Digital */}
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: 'var(--color-bg-main)', borderBottom: '2px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '0.85rem 1rem' }}>Operador</th>
                <th style={{ padding: '0.85rem 1rem' }}>Posto / Perímetro</th>
                <th style={{ padding: '0.85rem 1rem' }}>Linha</th>
                <th style={{ padding: '0.85rem 1rem' }}>Instrução Padrão</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status da Assinatura</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Ação Rápida</th>
              </tr>
            </thead>
            <tbody>
              {filteredOperadores.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Nenhum registro de treinamento encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredOperadores.map((op) => (
                  <tr key={op.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'white' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {op.nome}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                      {op.posto}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px', 
                        backgroundColor: '#EEF2FF', 
                        color: 'var(--color-primary)', 
                        fontWeight: 700 
                      }}>
                        {op.linha}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      {op.instrucao}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {op.assinado ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <span className="badge-status" style={{ backgroundColor: '#ECFDF5', color: '#10B981', border: '1px solid #A7F3D0' }}>
                            <CheckCircle2 size={13} />
                            <span>Assinado em {op.data}</span>
                          </span>
                          {op.assinaturaImg && (
                            <div style={{ backgroundColor: 'white', border: '1px solid #CBD5E1', padding: '0.15rem 0.4rem', borderRadius: '4px', maxWidth: '100px' }}>
                              <img src={op.assinaturaImg} alt="Assinatura com o dedo" style={{ width: '100%', height: '22px', objectFit: 'contain' }} />
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="badge-status" style={{ backgroundColor: '#FFFBEB', color: '#F59E0B', border: '1px solid #FDE68A' }}>
                          <Clock size={13} />
                          <span>Assinatura Pendente</span>
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      {op.assinado ? (
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => toggleAssinatura(op.id)}
                        >
                          <span>Desfazer</span>
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', backgroundColor: '#0A1B9F' }}
                            onClick={() => handleOpenSignatureModal(op)}
                          >
                            <Edit3 size={14} /> <span>Assinar com o Dedo</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal Interativo de Assinatura com o Dedo (Touch Pad) */}
      <SignatureCanvasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSignature}
        operatorName={selectedOp?.nome}
        postoName={selectedOp?.posto}
      />

    </div>
  );
}

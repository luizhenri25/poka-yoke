import React, { useState } from 'react';
import { 
  Grid, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCw, 
  UserCheck, 
  Award, 
  ShieldAlert,
  Search,
  Filter,
  User,
  Sparkles
} from 'lucide-react';

const POSTOS_LIST = [
  'POSTO 3', 
  'POSTO 4', 
  'POSTO 6', 
  'POSTO 7', 
  'POSTO 8', 
  'POSTO 9', 
  'POSTO 10', 
  'POSTO 11', 
  'POSTO 12', 
  'DFE015', 
  'IF BDIA', 
  'IF P13C', 
  'IF P02H'
];

export default function SkillMatrix() {
  const [selectedLinha, setSelectedLinha] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [engPostoTarget, setEngPostoTarget] = useState('POSTO 11');
  const [engEngineerName, setEngEngineerName] = useState('Caio Cabral');
  const [engRevisionText, setEngRevisionText] = useState('Rev02 - Atualização Padrão Torque & Fotos');
  const [lastNotification, setLastNotification] = useState(null);

  // Estado inicial das revisões dos postos
  const [postoRevisoes, setPostoRevisoes] = useState({
    'POSTO 3': 'Rev02',
    'POSTO 4': 'Rev02',
    'POSTO 6': 'Rev00',
    'POSTO 7': 'Rev01',
    'POSTO 8': 'Rev01',
    'POSTO 9': 'Rev04',
    'POSTO 10': 'Rev04',
    'POSTO 11': 'Rev01',
    'POSTO 12': 'Rev01',
    'DFE015': 'Rev02',
    'IF BDIA': 'Rev02',
    'IF P13C': 'Rev01',
    'IF P02H': 'Rev01'
  });

  // Base inicial de Operadores e suas habilidades por Posto
  // Status possíveis: 'apto' (Verde), 'pendente' (Amarelo), 'nao_habilitado' (Cinza)
  const [operadoresSkills, setOperadoresSkills] = useState([
    {
      id: 1,
      nome: 'Luiz Henrique',
      linha: 'BDIA',
      skills: {
        'POSTO 3': 'apto',
        'POSTO 4': 'apto',
        'POSTO 6': 'apto',
        'POSTO 7': 'nao_habilitado',
        'POSTO 8': 'apto',
        'POSTO 9': 'apto',
        'POSTO 10': 'apto',
        'POSTO 11': 'apto',
        'POSTO 12': 'pendente',
        'DFE015': 'nao_habilitado',
        'IF BDIA': 'apto',
        'IF P13C': 'nao_habilitado',
        'IF P02H': 'nao_habilitado'
      }
    },
    {
      id: 2,
      nome: 'Carlos Eduardo',
      linha: 'BDIA',
      skills: {
        'POSTO 3': 'apto',
        'POSTO 4': 'apto',
        'POSTO 6': 'pendente',
        'POSTO 7': 'nao_habilitado',
        'POSTO 8': 'apto',
        'POSTO 9': 'apto',
        'POSTO 10': 'apto',
        'POSTO 11': 'apto',
        'POSTO 12': 'nao_habilitado',
        'DFE015': 'nao_habilitado',
        'IF BDIA': 'apto',
        'IF P13C': 'nao_habilitado',
        'IF P02H': 'nao_habilitado'
      }
    },
    {
      id: 3,
      nome: 'Ana Paula Santos',
      linha: 'BDIA',
      skills: {
        'POSTO 3': 'nao_habilitado',
        'POSTO 4': 'apto',
        'POSTO 6': 'nao_habilitado',
        'POSTO 7': 'nao_habilitado',
        'POSTO 8': 'pendente',
        'POSTO 9': 'apto',
        'POSTO 10': 'apto',
        'POSTO 11': 'apto',
        'POSTO 12': 'nao_habilitado',
        'DFE015': 'nao_habilitado',
        'IF BDIA': 'nao_habilitado',
        'IF P13C': 'nao_habilitado',
        'IF P02H': 'nao_habilitado'
      }
    },
    {
      id: 4,
      nome: 'Roberto Almeida',
      linha: 'BDIA',
      skills: {
        'POSTO 3': 'apto',
        'POSTO 4': 'apto',
        'POSTO 6': 'apto',
        'POSTO 7': 'nao_habilitado',
        'POSTO 8': 'apto',
        'POSTO 9': 'apto',
        'POSTO 10': 'apto',
        'POSTO 11': 'apto',
        'POSTO 12': 'apto',
        'DFE015': 'nao_habilitado',
        'IF BDIA': 'apto',
        'IF P13C': 'nao_habilitado',
        'IF P02H': 'nao_habilitado'
      }
    },
    {
      id: 5,
      nome: 'Mariana Costa',
      linha: 'BTR',
      skills: {
        'POSTO 3': 'nao_habilitado',
        'POSTO 4': 'nao_habilitado',
        'POSTO 6': 'apto',
        'POSTO 7': 'apto',
        'POSTO 8': 'nao_habilitado',
        'POSTO 9': 'nao_habilitado',
        'POSTO 10': 'nao_habilitado',
        'POSTO 11': 'nao_habilitado',
        'POSTO 12': 'nao_habilitado',
        'DFE015': 'pendente',
        'IF BDIA': 'nao_habilitado',
        'IF P13C': 'apto',
        'IF P02H': 'apto'
      }
    },
    {
      id: 6,
      nome: 'Fernando Silva',
      linha: 'BTR',
      skills: {
        'POSTO 3': 'nao_habilitado',
        'POSTO 4': 'nao_habilitado',
        'POSTO 6': 'apto',
        'POSTO 7': 'apto',
        'POSTO 8': 'nao_habilitado',
        'POSTO 9': 'nao_habilitado',
        'POSTO 10': 'nao_habilitado',
        'POSTO 11': 'nao_habilitado',
        'POSTO 12': 'nao_habilitado',
        'DFE015': 'apto',
        'IF BDIA': 'nao_habilitado',
        'IF P13C': 'apto',
        'IF P02H': 'apto'
      }
    },
    {
      id: 7,
      nome: 'Juliana Lima',
      linha: 'BTR',
      skills: {
        'POSTO 3': 'nao_habilitado',
        'POSTO 4': 'nao_habilitado',
        'POSTO 6': 'apto',
        'POSTO 7': 'apto',
        'POSTO 8': 'nao_habilitado',
        'POSTO 9': 'nao_habilitado',
        'POSTO 10': 'nao_habilitado',
        'POSTO 11': 'nao_habilitado',
        'POSTO 12': 'nao_habilitado',
        'DFE015': 'apto',
        'IF BDIA': 'nao_habilitado',
        'IF P13C': 'apto',
        'IF P02H': 'pendente'
      }
    }
  ]);

  // A MAGIA DO SISTEMA: Atualização de Revisão pela Engenharia invalida os treinos
  const triggerEngRevisionUpdate = () => {
    // Incrementar a revisão do posto escolhido (ex: Rev01 -> Rev02)
    const currentRev = postoRevisoes[engPostoTarget] || 'Rev01';
    const revNum = parseInt(currentRev.replace(/\D/g, '')) || 1;
    const newRevStr = `Rev0${revNum + 1}`;

    setPostoRevisoes(prev => ({
      ...prev,
      [engPostoTarget]: newRevStr
    }));

    // Alterar estado de todos os operadores que estavam 'apto' naquele posto para 'pendente'
    let countAffected = 0;
    setOperadoresSkills(prev => prev.map(op => {
      if (op.skills[engPostoTarget] === 'apto') {
        countAffected++;
        return {
          ...op,
          skills: {
            ...op.skills,
            [engPostoTarget]: 'pendente'
          }
        };
      }
      return op;
    }));

    setLastNotification({
      posto: engPostoTarget,
      novaRev: newRevStr,
      engenheiro: engEngineerName,
      afetados: countAffected
    });
  };

  // Alternar manualmente o status de habilitação (Simulação de Assinatura Digital)
  const toggleSkillStatus = (opId, posto) => {
    setOperadoresSkills(prev => prev.map(op => {
      if (op.id === opId) {
        const current = op.skills[posto];
        let next = 'apto';
        if (current === 'apto') next = 'pendente';
        else if (current === 'pendente') next = 'nao_habilitado';
        else next = 'apto';

        return {
          ...op,
          skills: {
            ...op.skills,
            [posto]: next
          }
        };
      }
      return op;
    }));
  };

  // Filtragem dos Operadores
  const filteredOperadores = operadoresSkills.filter(op => {
    const matchLinha = selectedLinha === 'TODAS' || op.linha === selectedLinha;
    const matchSearch = op.nome.toLowerCase().includes(searchTerm.toLowerCase());
    return matchLinha && matchSearch;
  });

  // Métricas Globais
  const totalOperadores = filteredOperadores.length || 1;
  
  // Calcular versatilidade por operador (% de postos onde está apto)
  const calcVersatilidade = (skills) => {
    const aptosCount = Object.values(skills).filter(s => s === 'apto').length;
    return Math.round((aptosCount / POSTOS_LIST.length) * 100);
  };

  const mediaVersatilidade = Math.round(
    filteredOperadores.reduce((acc, op) => acc + calcVersatilidade(op.skills), 0) / totalOperadores
  );

  const totalPendentesRevalida = filteredOperadores.reduce((acc, op) => {
    return acc + Object.values(op.skills).filter(s => s === 'pendente').length;
  }, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Cabeçalho da Matriz de Versatilidade */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.85rem', backgroundColor: 'rgba(10, 27, 159, 0.08)', borderRadius: 'var(--radius-md)' }}>
            <Grid size={32} color="var(--color-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Matriz de Versatilidade
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              Mapeamento em tempo real de polivalência dos operadores cruzado com revisões ativas da Engenharia.
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Buscar operador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.85rem 0.5rem 2.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div className="segmented-control" style={{ margin: 0 }}>
            {['TODAS', 'BDIA', 'BTR'].map(linha => (
              <button
                key={linha}
                className={`segmented-btn ${selectedLinha === linha ? 'active' : ''}`}
                onClick={() => setSelectedLinha(linha)}
                style={{ padding: '0.4rem 0.85rem' }}
              >
                {linha}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cartões de Indicadores da Matriz */}
      <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ backgroundColor: '#EEF2FF', color: 'var(--color-primary)' }}>
            <User size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Operadores Monitorados</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>{filteredOperadores.length}</h3>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div className="kpi-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
            <Award size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Índice Médio de Polivalência</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#047857', margin: 0 }}>{mediaVersatilidade}%</h3>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="kpi-icon-box" style={{ backgroundColor: '#FFFBEB', color: '#F59E0B' }}>
            <Clock size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Revalidações Pendentes</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#B45309', margin: 0 }}>{totalPendentesRevalida}</h3>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div className="kpi-icon-box" style={{ backgroundColor: 'rgba(10, 27, 159, 0.08)', color: 'var(--color-primary)' }}>
            <Sparkles size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Invalidação Automática</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>Ativa em Tempo Real</h3>
          </div>
        </div>
      </div>

      {/* A MAGIA DO SISTEMA: PAINEL DA ENGENHARIA DE PROCESSOS */}
      <div style={{
        backgroundColor: '#1E293B',
        color: 'white',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '8px' }}>
              <RefreshCw size={24} color="#60A5FA" className="animate-spin" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>
                Controle de Revisão da Engenharia
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>
                Ao atualizar a revisão de um posto, o sistema reclassifica automaticamente os operadores aptos para "Pendente de Treinamento".
              </p>
            </div>
          </div>

          <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 700, border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            Módulo Engenheiro (Caio Cabral / Anna Júlia)
          </span>
        </div>

        <div className="grid grid-cols-4" style={{ gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
              Engenheiro Responsável:
            </label>
            <select 
              value={engEngineerName}
              onChange={(e) => setEngEngineerName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', backgroundColor: '#0F172A', color: 'white', border: '1px solid #475569', fontSize: '0.85rem' }}
            >
              <option value="Caio Cabral">Caio Cabral (Eng. Processos)</option>
              <option value="Anna Júlia">Anna Júlia (Eng. Qualidade)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
              Posto de Trabalho Alvo:
            </label>
            <select 
              value={engPostoTarget}
              onChange={(e) => setEngPostoTarget(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', backgroundColor: '#0F172A', color: 'white', border: '1px solid #475569', fontSize: '0.85rem' }}
            >
              {POSTOS_LIST.map(p => (
                <option key={p} value={p}>{p} (Atual: {postoRevisoes[p] || 'Rev01'})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
              Descrição da Nova Revisão:
            </label>
            <input 
              type="text"
              value={engRevisionText}
              onChange={(e) => setEngRevisionText(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', backgroundColor: '#0F172A', color: 'white', border: '1px solid #475569', fontSize: '0.85rem' }}
            />
          </div>

          <button 
            className="btn btn-primary"
            style={{ backgroundColor: '#3B82F6', fontWeight: 700, fontSize: '0.85rem', padding: '0.6rem 1rem', width: '100%' }}
            onClick={triggerEngRevisionUpdate}
          >
            🚀 Lançar Nova Revisão
          </button>
        </div>

        {/* Notificação de Disparo do Gatilho */}
        {lastNotification && (
          <div style={{ 
            marginTop: '1rem', 
            backgroundColor: 'rgba(245, 158, 11, 0.15)', 
            border: '1px solid #F59E0B', 
            padding: '0.85rem 1.25rem', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <ShieldAlert size={22} color="#F59E0B" />
            <div style={{ fontSize: '0.85rem', color: '#FEF3C7' }}>
              <strong>Notificação de Invalidação Automática:</strong> O engenheiro <strong>{lastNotification.engenheiro}</strong> lançou a versão <strong>{lastNotification.novaRev}</strong> para o <strong>{lastNotification.posto}</strong>. 
              {lastNotification.afetados > 0 ? (
                <span> ⚠️ <strong>{lastNotification.afetados} operador(es)</strong> foram alterados de "Apto" para "Pendente de Treinamento".</span>
              ) : (
                <span> Nenhum operador ativo estava apto neste posto no momento.</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* GRELHA MATRIZ DE VERSATILIDADE (Skill Matrix Grid) */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={22} color="var(--color-primary)" />
              Matriz Cruzada: Operadores x Postos (Status de Habilitação)
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              Clique sobre qualquer ícone da matriz para alterar rapidamente o status do operador ou validar nova assinatura.
            </p>
          </div>

          {/* Legenda dos Estados */}
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#047857' }}>
              <CheckCircle2 size={16} color="#10B981" /> Apto (Treinado)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#B45309' }}>
              <Clock size={16} color="#F59E0B" /> Pendente de Treino
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94A3B8' }}>
              <XCircle size={16} color="#94A3B8" /> Não Habilitado
            </span>
          </div>
        </div>

        {/* Tabela Cruzada */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
            <thead style={{ backgroundColor: 'var(--color-bg-main)', borderBottom: '2px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', minWidth: '160px', position: 'sticky', left: 0, backgroundColor: 'var(--color-bg-main)', zIndex: 2 }}>
                  Operador
                </th>
                <th style={{ padding: '0.5rem', width: '60px' }}>Linha</th>
                <th style={{ padding: '0.5rem', width: '90px' }}>Polivalência</th>
                {POSTOS_LIST.map(posto => (
                  <th key={posto} style={{ padding: '0.65rem 0.5rem', minWidth: '95px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{posto}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {postoRevisoes[posto] || 'Rev01'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOperadores.map((op) => {
                const versatilidadePerc = calcVersatilidade(op.skills);
                return (
                  <tr key={op.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'white' }}>
                    
                    {/* Nome do Operador (Fixado) */}
                    <td style={{ 
                      padding: '0.85rem 1rem', 
                      textAlign: 'left', 
                      fontWeight: 700, 
                      color: 'var(--color-text-main)', 
                      position: 'sticky', 
                      left: 0, 
                      backgroundColor: 'white', 
                      zIndex: 1,
                      boxShadow: '2px 0 5px rgba(0,0,0,0.03)'
                    }}>
                      {op.nome}
                    </td>

                    {/* Linha */}
                    <td style={{ padding: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: '#EEF2FF', color: 'var(--color-primary)', fontWeight: 700 }}>
                        {op.linha}
                      </span>
                    </td>

                    {/* Versatilidade % */}
                    <td style={{ padding: '0.5rem' }}>
                      <div style={{ fontWeight: 800, color: versatilidadePerc >= 50 ? '#047857' : '#B45309' }}>
                        {versatilidadePerc}%
                      </div>
                      <div className="progress-bar-bg" style={{ height: '4px', marginTop: '0.2rem' }}>
                        <div className="progress-bar-fill" style={{ width: `${versatilidadePerc}%`, backgroundColor: versatilidadePerc >= 50 ? '#10B981' : '#F59E0B' }} />
                      </div>
                    </td>

                    {/* Células de Postos x Operador */}
                    {POSTOS_LIST.map(posto => {
                      const status = op.skills[posto] || 'nao_habilitado';
                      return (
                        <td 
                          key={posto} 
                          style={{ padding: '0.65rem 0.25rem', cursor: 'pointer', transition: 'background 0.2s' }}
                          onClick={() => toggleSkillStatus(op.id, posto)}
                          title={`Clique para alternar o status de ${op.nome} no ${posto}`}
                        >
                          {status === 'apto' && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.25rem 0.5rem', borderRadius: '12px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', fontSize: '0.75rem', fontWeight: 700 }}>
                              <CheckCircle2 size={13} color="#10B981" /> <span>Apto</span>
                            </div>
                          )}

                          {status === 'pendente' && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.25rem 0.5rem', borderRadius: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', color: '#B45309', fontSize: '0.75rem', fontWeight: 700 }}>
                              <Clock size={13} color="#F59E0B" /> <span>Pendente</span>
                            </div>
                          )}

                          {status === 'nao_habilitado' && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.25rem 0.5rem', borderRadius: '12px', backgroundColor: 'var(--color-bg-main)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                              <XCircle size={13} color="#94A3B8" /> <span>—</span>
                            </div>
                          )}
                        </td>
                      );
                    })}

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

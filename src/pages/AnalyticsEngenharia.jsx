import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Wrench, 
  Cpu, 
  Layers, 
  Activity,
  Zap,
  Target
} from 'lucide-react';

export default function AnalyticsEngenharia() {
  const [selectedLinha, setSelectedLinha] = useState('TODAS');
  const [selectedPeriodo, setSelectedPeriodo] = useState('MES');

  // Dados do Gráfico de Pareto (Ocorrências de Entrada em Modo Backup por Posto)
  const paretoDataRaw = [
    { posto: 'POSTO 4', ocorrencias: 18, linha: 'BDIA', perc: 42.8 },
    { posto: 'POSTO 9', ocorrencias: 12, linha: 'BDIA', perc: 28.5 },
    { posto: 'POSTO 3', ocorrencias: 5, linha: 'BDIA', perc: 11.9 },
    { posto: 'DFE015', ocorrencias: 4, linha: 'BTR', perc: 9.5 },
    { posto: 'POSTO 10', ocorrencias: 2, linha: 'BDIA', perc: 4.8 },
    { posto: 'POSTO 6', ocorrencias: 1, linha: 'BTR', perc: 2.5 }
  ];

  // Filtragem conforme a linha selecionada
  const paretoData = paretoDataRaw.filter(d => {
    if (selectedLinha === 'TODAS') return true;
    return d.linha === selectedLinha;
  });

  // Calcular curva acumulada de Pareto
  const totalOcorrencias = paretoData.reduce((acc, curr) => acc + curr.ocorrencias, 0) || 1;
  let acumulado = 0;
  const paretoWithAccumulated = paretoData.map(d => {
    acumulado += d.ocorrencias;
    return {
      ...d,
      acumuladoPerc: Math.round((acumulado / totalOcorrencias) * 100)
    };
  });

  // Ranking Top 5 Poka-Yokes Ofensores (Mais entraram em Modo Backup)
  const top5PokaYokes = [
    {
      rank: 1,
      pyCode: 'PY-JPR-254',
      nome: 'Sensor de Posição da Parafusadeira',
      posto: 'POSTO 4',
      linha: 'BDIA',
      backupsNoMes: 12,
      mttr: '1.2h',
      causaDominante: 'Falha de Alinhamento do Sensor',
      statusAcao: 'Em Análise de Engenharia'
    },
    {
      rank: 2,
      pyCode: 'PY-JPR-282',
      nome: 'CNF Apoio de Cabeça com o Banco',
      posto: 'POSTO 9',
      linha: 'BDIA',
      backupsNoMes: 8,
      mttr: '2.5h',
      causaDominante: 'Leitura Intermitente de Câmera',
      statusAcao: 'Troca do Cabo de Sinal Solicitada'
    },
    {
      rank: 3,
      pyCode: 'PY-JPR-225',
      nome: 'Painel CLP Inversão de Estrutura EDIA',
      posto: 'POSTO 3',
      linha: 'BDIA',
      backupsNoMes: 5,
      mttr: '1.8h',
      causaDominante: 'Oscilação de Tensão no CLP',
      statusAcao: 'Filtro de Linha Instalado'
    },
    {
      rank: 4,
      pyCode: 'PY-JPR-272',
      nome: 'Leitor Fixo QR Enrolador P02H',
      posto: 'DFE015',
      linha: 'BTR',
      backupsNoMes: 4,
      mttr: '1.4h',
      causaDominante: 'Sujeira na Lente de Leitura',
      statusAcao: 'Plano de Limpeza Autônoma Criado'
    },
    {
      rank: 5,
      pyCode: 'PY-JPR-228',
      nome: 'Parafusadeira Elétrica Torque Fecho Cinto',
      posto: 'POSTO 10',
      linha: 'BDIA',
      backupsNoMes: 2,
      mttr: '0.9h',
      causaDominante: 'Desgaste no Soquete',
      statusAcao: 'Substituição Concluída'
    }
  ].filter(py => selectedLinha === 'TODAS' || py.linha === selectedLinha);

  // Distribuição de Causa Raiz
  const causasRaiz = [
    { causa: 'Falha de Sensor / Câmera de Visão', perc: 38, color: '#3B82F6' },
    { causa: 'Desgaste Mecânico / Soquetes', perc: 28, color: '#F59E0B' },
    { causa: 'Calibração / Parâmetro de Torque', perc: 20, color: '#10B981' },
    { causa: 'Comunicação CLP / Elétrica', perc: 14, color: '#8B5CF6' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Cabeçalho Analytics */}
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
            <BarChart2 size={32} color="var(--color-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Analytics & Gráfico de Pareto
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              Análise estatística de confiabilidade, taxa de falhas dos Poka-Yokes e priorização 80/20 para a fábrica.
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="segmented-control" style={{ margin: 0 }}>
            {['MES', 'TRIMESTRE', 'ANO'].map(per => (
              <button
                key={per}
                className={`segmented-btn ${selectedPeriodo === per ? 'active' : ''}`}
                onClick={() => setSelectedPeriodo(per)}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              >
                {per === 'MES' ? 'Este Mês' : per === 'TRIMESTRE' ? '90 Dias' : 'Ano 2026'}
              </button>
            ))}
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

      {/* Cartões KPI Industriais */}
      <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
        
        {/* MTTR */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #3B82F6' }}>
          <div className="kpi-icon-box" style={{ backgroundColor: '#EEF2FF', color: '#3B82F6' }}>
            <Wrench size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>MTTR (Tempo Médio de Reparo)</span>
            <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>1.8 horas</h3>
            <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>↓ 22% mais rápido que o mês anterior</span>
          </div>
        </div>

        {/* MTBF */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div className="kpi-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
            <Clock size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>MTBF (Tempo Entre Falhas)</span>
            <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#047857', margin: 0 }}>158 horas</h3>
            <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>↑ 14 horas a mais sem paradas</span>
          </div>
        </div>

        {/* OEE dos PYs */}
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div className="kpi-icon-box" style={{ backgroundColor: 'rgba(10, 27, 159, 0.08)', color: 'var(--color-primary)' }}>
            <Activity size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Confiabilidade Geral (PYs)</span>
            <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>96.4%</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>Meta da Planta: 95.0% OK</span>
          </div>
        </div>

        {/* Ocorrências Modo Backup */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="kpi-icon-box" style={{ backgroundColor: '#FFFBEB', color: '#F59E0B' }}>
            <AlertTriangle size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Acionamentos Modo Backup</span>
            <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#B45309', margin: 0 }}>{totalOcorrencias} Eventos</h3>
            <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>80% concentrados nos Postos 4 e 9</span>
          </div>
        </div>

      </div>

      {/* GRÁFICO DE PARETO 80/20 (CONCENTRAÇÃO DE FALHAS POR POSTO) */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={22} color="var(--color-primary)" />
              Gráfico de Pareto 80/20 — Gargalos de Entrada em Modo Backup por Posto
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              Demonstra que a maioria absoluta dos acionamentos de Modo Backup se concentram em um pequeno grupo de postos ofensores.
            </p>
          </div>
          
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', color: '#B91C1C', fontSize: '0.75rem', fontWeight: 800 }}>
            🚨 Postos Ofensores Críticos: POSTO 4 & POSTO 9
          </div>
        </div>

        {/* Visualização do Gráfico de Pareto */}
        <div style={{ backgroundColor: 'var(--color-bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {paretoWithAccumulated.map((item, idx) => {
              const isCritico = idx < 2; // Postos 4 e 9 representam ~70-80% das falhas
              return (
                <div key={item.posto} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px 80px', alignItems: 'center', gap: '1rem' }}>
                  
                  {/* Nome do Posto */}
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isCritico ? '#B91C1C' : 'var(--color-text-main)' }}>
                    {item.posto} {isCritico && '🔥'}
                  </div>

                  {/* Barra Principal de Ocorrências */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>{item.ocorrencias} ocorrências de falha</span>
                      <span style={{ color: isCritico ? '#B91C1C' : 'var(--color-primary)', fontWeight: 800 }}>{item.perc}% das falhas</span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '14px' }}>
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${item.perc * 2}%`, 
                          backgroundColor: isCritico ? '#EF4444' : 'var(--color-primary)' 
                        }} 
                      />
                    </div>
                  </div>

                  {/* Porcentagem Acumulada (Pareto Curve) */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Acumulado</span>
                    <strong style={{ fontSize: '0.9rem', color: item.acumuladoPerc <= 80 ? '#B91C1C' : '#047857' }}>
                      {item.acumuladoPerc}%
                    </strong>
                  </div>

                  {/* Badge de Impacto */}
                  <div style={{ textAlign: 'center' }}>
                    {item.acumuladoPerc <= 80 ? (
                      <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#FEF2F2', color: '#B91C1C', fontWeight: 800, border: '1px solid #FCA5A5' }}>
                        ZONA 80%
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#ECFDF5', color: '#047857', fontWeight: 700 }}>
                        ZONA 20%
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEÇÃO DUPLA: TOP 5 POKAS + DISTRIBUIÇÃO DA CAUSA RAIZ */}
      <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
        
        {/* TOP 5 POKA-YOKES COM MAIS FALHAS / MODO BACKUP */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="#EF4444" />
              Top 5 Poka-Yokes mais Ofensores
            </h3>
            <span style={{ fontSize: '0.75rem', backgroundColor: '#FEF2F2', color: '#B91C1C', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              Ranking Reincidência
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {top5PokaYokes.map((py) => (
              <div key={py.pyCode} style={{
                backgroundColor: 'white',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: py.rank <= 2 ? '#FEF2F2' : '#EEF2FF', 
                    color: py.rank <= 2 ? '#B91C1C' : 'var(--color-primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justify: 'center', 
                    fontWeight: 900, 
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}>
                    #{py.rank}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>
                      {py.pyCode} — <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{py.posto}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                      {py.nome}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#B45309', marginTop: '0.15rem' }}>
                      Causa: {py.causaDominante}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#B91C1C', display: 'block' }}>
                    {py.backupsNoMes} Backups
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    MTTR: {py.mttr}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DISTRIBUIÇÃO DA CAUSA RAIZ */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={20} color="var(--color-primary)" />
              Distribuição por Causa Raiz de Falha
            </h3>
            <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-bg-main)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
              Análise de Engenharia
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
            {causasRaiz.map((item) => (
              <div key={item.causa}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--color-text-main)' }}>{item.causa}</span>
                  <span style={{ color: item.color }}>{item.perc}% dos chamados</span>
                </div>
                <div className="progress-bar-bg" style={{ height: '12px' }}>
                  <div className="progress-bar-fill" style={{ width: `${item.perc}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.75rem', backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Zap size={22} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-dark)', lineHeight: '1.4' }}>
              <strong>Recomendação da Engenharia de Processos:</strong> 66% de todas as paradas são provocadas por desalinhamento em <strong>sensores de posição</strong> e <strong>desgaste mecanico nos soquetes</strong>. Recomenda-se direcionar a preventiva quinzenal prioritariamente aos Postos 4 e 9.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

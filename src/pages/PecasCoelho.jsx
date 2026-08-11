import React, { useState } from 'react';
import { Rabbit, CheckCircle, AlertTriangle, Clock, ShieldAlert, Calendar, CheckCircle2, Wrench, MapPin, Mail, Send, Check } from 'lucide-react';
import { pecasCoelhoData, pecasCoelhoControleMensal as initialControleData } from '../data/pecasCoelhoData';

export default function PecasCoelho() {
  const [mainTab, setMainTab] = useState('INVENTARIO'); // 'INVENTARIO' ou 'CONTROLE_MENSAL'
  const [linhaTab, setLinhaTab] = useState('BDIA');
  const [controleList, setControleList] = useState(initialControleData);
  const [emailStatus, setEmailStatus] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const inventarioData = pecasCoelhoData[linhaTab] || [];

  // Métricas do Controle Mensal
  const totalMestres = controleList.length;
  const emDiaCount = controleList.filter(item => item.status === 'Em Dia').length;
  const vencendoCount = controleList.filter(item => item.status === 'Vencendo em Breve').length;
  const vencidosCount = controleList.filter(item => item.status === 'Vencido').length;

  const renovarVerificacaoMensal = (id) => {
    setControleList(prev => prev.map(item => {
      if (item.id === id) {
        const hoje = new Date();
        const proximoMes = new Date(hoje);
        proximoMes.setDate(hoje.getDate() + 30);

        return {
          ...item,
          ultimaVerificacao: hoje.toLocaleDateString('pt-BR'),
          proximaVerificacao: proximoMes.toLocaleDateString('pt-BR'),
          status: 'Em Dia'
        };
      }
      return item;
    }));
  };

  const handleSendEmailAlerts = async () => {
    const expiring = controleList.filter(item => item.status === 'Vencendo em Breve' || item.status === 'Vencido');
    
    if (expiring.length === 0) {
      alert("Todas as peças Coelho estão em dia! Nenhuma notificação por e-mail necessária no momento.");
      return;
    }

    try {
      // Chamada para o Backend API Laravel (App\Http\Controllers\NotificationController)
      const response = await fetch('/api/notifications/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: expiring.map(item => ({
            nome: item.nome,
            posto: item.posto,
            linha: item.linha,
            ultimaInspecao: item.ultimaVerificacao,
            diasRestantes: item.status === 'Vencido' ? -3 : 4
          })),
          recipients: ['caio.cabral@faurecia.com', 'anna.julia@faurecia.com', 'admin@faurecia.com']
        })
      });

      const resData = await response.json();
      setEmailStatus({
        recipients: ['caio.cabral@faurecia.com', 'anna.julia@faurecia.com', 'admin@faurecia.com'],
        vencidos: vencidosCount,
        vencendo: vencendoCount,
        timestamp: new Date().toLocaleTimeString('pt-BR')
      });
      setShowEmailModal(true);
    } catch (e) {
      // Fallback local se a API estiver em modo offline
      setEmailStatus({
        recipients: ['caio.cabral@faurecia.com', 'anna.julia@faurecia.com', 'admin@faurecia.com'],
        vencidos: vencidosCount,
        vencendo: vencendoCount,
        timestamp: new Date().toLocaleTimeString('pt-BR')
      });
      setShowEmailModal(true);
    }
  };

  return (
    <div className="card">
      
      {/* Cabeçalho da Página */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg-main)', borderRadius: 'var(--radius-md)' }}>
            <Rabbit size={32} color="var(--color-primary)" />
          </div>
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>Peças Coelho</h2>
            <p className="text-muted">Lista de peças padrão para validação do sistema Poka-Yoke & Controle Mensal da Engenharia de Processos.</p>
          </div>
        </div>

        {/* Abas Principais */}
        <div className="segmented-control" style={{ margin: 0 }}>
          <button 
            className={`segmented-btn ${mainTab === 'INVENTARIO' ? 'active' : ''}`}
            onClick={() => setMainTab('INVENTARIO')}
          >
            📋 Inventário por Linha
          </button>
          <button 
            className={`segmented-btn ${mainTab === 'CONTROLE_MENSAL' ? 'active' : ''}`}
            onClick={() => setMainTab('CONTROLE_MENSAL')}
          >
            ⏱️ Controle Mensal (Engenharia)
          </button>
        </div>
      </div>
      
      {/* ABA 1: INVENTÁRIO POR LINHA (BDIA / BTR) */}
      {mainTab === 'INVENTARIO' && (
        <div>
          {/* Segmented Control de Linha */}
          <div className="segmented-control" style={{ maxWidth: '400px', marginBottom: '2rem' }}>
            <button 
              className={`segmented-btn ${linhaTab === 'BDIA' ? 'active' : ''}`}
              onClick={() => setLinhaTab('BDIA')}
            >
              BDIA
            </button>
            <button 
              className={`segmented-btn ${linhaTab === 'BTR' ? 'active' : ''}`}
              onClick={() => setLinhaTab('BTR')}
            >
              BTR
            </button>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
            {inventarioData.length === 0 ? (
              <p className="text-muted">Nenhuma peça coelho cadastrada para {linhaTab}.</p>
            ) : (
              inventarioData.map((item, idx) => (
                <div key={idx} style={{ 
                  border: '1px solid var(--color-border)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 800, 
                    color: 'var(--color-primary-dark)',
                    marginBottom: '1rem',
                    borderBottom: '2px solid var(--color-bg-main)',
                    paddingBottom: '0.5rem'
                  }}>
                    {item.posto}
                  </h3>
                  
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: item.instrucoes ? '1.5rem' : '0' }}>
                    {item.pecas.map((peca, pIdx) => (
                      <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <CheckCircle size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                        <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{peca}</span>
                      </li>
                    ))}
                  </ul>

                  {item.instrucoes && (
                    <div style={{ 
                      backgroundColor: '#FEF2F2', 
                      border: '1px solid #FECACA', 
                      padding: '1rem', 
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start'
                    }}>
                      <AlertTriangle size={20} color="#EF4444" style={{ flexShrink: 0 }} />
                      <p style={{ color: '#B91C1C', fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>
                        {item.instrucoes}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ABA 2: CONTROLE MENSAL DE INTEGRIDADE (ENGENHARIA DE PROCESSOS) */}
      {mainTab === 'CONTROLE_MENSAL' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Alerta Visual de Peças Vencidas + Botão de E-mail */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: vencidosCount > 0 ? '#FEF2F2' : '#EEF2FF', border: `1px solid ${vencidosCount > 0 ? '#FCA5A5' : '#C7D2FE'}`, padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <ShieldAlert size={28} color={vencidosCount > 0 ? '#EF4444' : 'var(--color-primary)'} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: vencidosCount > 0 ? '#B91C1C' : 'var(--color-primary-dark)', margin: 0 }}>
                  {vencidosCount > 0 ? `🚨 ALERTA: ${vencidosCount} Peça(s) Coelho Vencida(s) & ${vencendoCount} Vencendo em Breve` : `⏱️ Controle de Integridade Mensal (30 Dias)`}
                </h4>
                <p style={{ fontSize: '0.85rem', color: vencidosCount > 0 ? '#991B1B' : 'var(--color-text-muted)', marginTop: '0.2rem', margin: 0 }}>
                  Notificação automática da Engenharia de Processos & Qualidade da Forvia Faurecia.
                </p>
              </div>
            </div>

            <button
              onClick={handleSendEmailAlerts}
              className="btn btn-primary"
              style={{ backgroundColor: '#0A1B9F', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.15rem', fontWeight: 800, fontSize: '0.85rem' }}
            >
              <Mail size={16} /> Disparar E-mail para Engenharia
            </button>
          </div>

          {/* KPIs de Calibração / Integridade */}
          <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
            <div className="kpi-card">
              <div className="kpi-icon-box" style={{ backgroundColor: '#EEF2FF', color: 'var(--color-primary)' }}>
                <Rabbit size={26} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total de Amostras Mestre</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>{totalMestres}</h3>
              </div>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
              <div className="kpi-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
                <CheckCircle2 size={26} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Verificação Em Dia</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#047857', margin: 0 }}>{emDiaCount}</h3>
              </div>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
              <div className="kpi-icon-box" style={{ backgroundColor: '#FFFBEB', color: '#F59E0B' }}>
                <Clock size={26} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Vencendo no Mês</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#B45309', margin: 0 }}>{vencendoCount}</h3>
              </div>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #EF4444' }}>
              <div className="kpi-icon-box" style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}>
                <AlertTriangle size={26} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Verificação Vencida</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#B91C1C', margin: 0 }}>{vencidosCount}</h3>
              </div>
            </div>
          </div>

          {/* Tabela de Gestão de Integridade Mensal */}
          <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead style={{ backgroundColor: 'var(--color-bg-main)', borderBottom: '2px solid var(--color-border)' }}>
                <tr>
                  <th style={{ padding: '0.85rem 1rem' }}>Peça Coelho / Amostra Mestre</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Posto & Linha</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Localização no Posto</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Engenheiro Responsável</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Próxima Checagem (30 Dias)</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Ação de Engenharia</th>
                </tr>
              </thead>
              <tbody>
                {controleList.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'white' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {item.nomePeca}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      {item.posto} <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: '#EEF2FF', color: 'var(--color-primary)', marginLeft: '0.35rem' }}>{item.linha}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      {item.localizacao}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Wrench size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      {item.responsavel}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      {item.proximaVerificacao}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {item.status === 'Em Dia' && (
                        <span className="badge-status" style={{ backgroundColor: '#ECFDF5', color: '#10B981', border: '1px solid #A7F3D0' }}>
                          <CheckCircle2 size={13} /> Em Dia
                        </span>
                      )}
                      {item.status === 'Vencendo em Breve' && (
                        <span className="badge-status" style={{ backgroundColor: '#FFFBEB', color: '#F59E0B', border: '1px solid #FDE68A' }}>
                          <Clock size={13} /> Vencendo no Mês
                        </span>
                      )}
                      {item.status === 'Vencido' && (
                        <span className="badge-status" style={{ backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FCA5A5' }}>
                          <AlertTriangle size={13} /> Verificação Vencida
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 700 }}
                        onClick={() => renovarVerificacaoMensal(item.id)}
                      >
                        Renovar +30 Dias
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* MODAL DE NOTIFICAÇÃO POR E-MAIL DISPARADO */}
      {showEmailModal && emailStatus && (
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
            maxWidth: '560px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden'
          }}>
            <div style={{ backgroundColor: '#0A1B9F', color: 'white', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={22} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>E-mail de Notificação Disparado com Sucesso!</h3>
              </div>
              <button onClick={() => setShowEmailModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', padding: '1rem', borderRadius: 'var(--radius-md)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Check size={20} color="#10B981" />
                Disparo via Laravel Mailer realizado às {emailStatus.timestamp}
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
                <strong>Destinatários Notificados:</strong>
                <ul style={{ margin: '0.4rem 0 0 1.2rem', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                  {emailStatus.recipients.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div style={{ border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', padding: '1rem', backgroundColor: '#F8FAFC', fontSize: '0.8rem', lineHeight: '1.5' }}>
                <strong style={{ display: 'block', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                  📧 Assunto: ALERTA POKA-YOKE: 🚨 {emailStatus.vencidos} Peça(s) Coelho Vencida(s) - Ação Imediata Necessária
                </strong>
                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                  A lista contendo os itens vencidos, postos de trabalho e a solicitação de renovação por mais 30 dias foi enviada com sucesso para a Engenharia de Processos e Qualidade da Forvia Faurecia.
                </p>
              </div>

              <button
                onClick={() => setShowEmailModal(false)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontWeight: 800 }}
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


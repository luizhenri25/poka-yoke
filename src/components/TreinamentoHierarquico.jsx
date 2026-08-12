import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  UserCheck, 
  Edit3, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Award,
  Calendar,
  Search,
  Lock,
  X,
  Video,
  ExternalLink
} from 'lucide-react';
import SignatureCanvasModal from './SignatureCanvasModal';
import { useAuth } from '../context/AuthContext';
import { getPostoLink } from '../data/postoLinksData';

// Base de Dados Padrão de Postos e Operadores da Faurecia
const DEFAULT_POSTS_DATA = {
  BDIA: [
    {
      posto: 'POSTO 1 - Montagem Estrutural',
      instrucao: 'JPR-I-PSS-1001 (Trava Estrutural)',
      operadores: [
        { id: 101, nome: 'Luiz Henrique', matricula: 'OP-504', assinado: false, dataHora: null, assinaturaImg: null },
        { id: 102, nome: 'Carlos Eduardo', matricula: 'OP-508', assinado: false, dataHora: null, assinaturaImg: null }
      ]
    },
    {
      posto: 'POSTO 2 - Sensor Óptico Encosto',
      instrucao: 'JPR-I-PSS-1549 (Sensor Presença)',
      operadores: [
        { id: 103, nome: 'Ana Paula Souza', matricula: 'OP-612', assinado: false, dataHora: null, assinaturaImg: null },
        { id: 104, nome: 'Marcos Vinicius', matricula: 'OP-615', assinado: false, dataHora: null, assinaturaImg: null }
      ]
    },
    {
      posto: 'POSTO 3 - Inversão Encosto BDIA',
      instrucao: 'JPR-I-PSS-2025 (Anti-Inversão)',
      operadores: [
        { id: 105, nome: 'Roberto Silva', matricula: 'OP-701', assinado: false, dataHora: null, assinaturaImg: null },
        { id: 106, nome: 'Fernanda Lima', matricula: 'OP-709', assinado: false, dataHora: null, assinaturaImg: null }
      ]
    },
    {
      posto: 'POSTO 4 - Torqueador Pneumático',
      instrucao: 'JPR-I-PSS-2040 (Controle de Torque)',
      operadores: [
        { id: 107, nome: 'Diego Alves', matricula: 'OP-810', assinado: false, dataHora: null, assinaturaImg: null }
      ]
    }
  ],
  BTR: [
    {
      posto: 'POSTO 1 - Fixação Banco Traseiro',
      instrucao: 'JPR-I-PSS-3010 (Gabarito BTR)',
      operadores: [
        { id: 201, nome: 'Juliana Costa', matricula: 'OP-902', assinado: false, dataHora: null, assinaturaImg: null },
        { id: 202, nome: 'Lucas Mendes', matricula: 'OP-914', assinado: false, dataHora: null, assinaturaImg: null }
      ]
    },
    {
      posto: 'POSTO 2 - Cinto de Segurança BTR',
      instrucao: 'JPR-I-PSS-3050 (Checagem Trava Cinto)',
      operadores: [
        { id: 203, nome: 'Thiago Oliveira', matricula: 'OP-920', assinado: false, dataHora: null, assinaturaImg: null }
      ]
    },
    {
      posto: 'POSTO 3 - Inspeção Final Poka-Yoke',
      instrucao: 'JPR-I-PSS-4000 (Liberação de Qualidade)',
      operadores: [
        { id: 204, nome: 'Patricia Rocha', matricula: 'OP-950', assinado: false, dataHora: null, assinaturaImg: null }
      ]
    }
  ]
};

export default function TreinamentoHierarquico() {
  const { currentUser, isAdmin, isEngenheiro } = useAuth();
  const [categoria, setCategoria] = useState(null); // 'MODO BACKUP' ou 'LIBERAÇÃO DE POKA-YOKE'
  const [linha, setLinha] = useState(null); // 'BDIA' ou 'BTR'
  const [searchTerm, setSearchTerm] = useState('');
  const [identityError, setIdentityError] = useState(null);

  // Carregar estado de assinaturas salvas localmente
  const [postData, setPostData] = useState(() => {
    const saved = localStorage.getItem('poka_yoke_treinamentos_hierarquicos');
    return saved ? JSON.parse(saved) : DEFAULT_POSTS_DATA;
  });

  // Modal de Assinatura com o Dedo / Mouse
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);
  const [selectedPostoName, setSelectedPostoName] = useState('');

  useEffect(() => {
    localStorage.setItem('poka_yoke_treinamentos_hierarquicos', JSON.stringify(postData));
  }, [postData]);

  // Função de Validação Estrita de Identidade Digital
  const canOperatorSign = (opObj) => {
    if (!currentUser) return false;
    // Engenheiros e Admins possuem permissão de supervisão no posto
    if (isAdmin || isEngenheiro) return true;

    // Checar correspondência de Matrícula ou Nome
    const curMatricula = (currentUser.matricula || '').toLowerCase().trim();
    const opMatricula = (opObj.matricula || '').toLowerCase().trim();
    const curName = (currentUser.name || '').toLowerCase().trim();
    const opName = (opObj.nome || '').toLowerCase().trim();

    return (curMatricula && curMatricula === opMatricula) || 
           (curName && (curName.includes(opName) || opName.includes(curName)));
  };

  // Abrir Modal de Assinatura ao clicar no operador
  const handleOpenSignature = (postoObj, opObj) => {
    setIdentityError(null);

    if (!canOperatorSign(opObj)) {
      setIdentityError({
        targetOp: opObj.nome,
        targetMatricula: opObj.matricula,
        currentName: currentUser?.name || 'Não Identificado',
        currentMatricula: currentUser?.matricula || currentUser?.email || 'Desconhecido'
      });
      return;
    }

    setSelectedPostoName(postoObj.posto);
    setSelectedOp(opObj);
    setIsModalOpen(true);
  };

  // Salvar Assinatura com Data e Hora Exata com Segundos
  const handleSaveSignature = (signatureImg) => {
    if (!selectedOp || !linha) return;

    const now = new Date();
    const dataHoraFormatada = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');

    setPostData(prev => {
      const updatedLine = prev[linha].map(p => {
        if (p.posto === selectedPostoName) {
          const updatedOps = p.operadores.map(op => {
            if (op.id === selectedOp.id) {
              return {
                ...op,
                assinado: true,
                dataHora: dataHoraFormatada,
                categoriaTreino: categoria,
                assinaturaImg: signatureImg
              };
            }
            return op;
          });
          return { ...p, operadores: updatedOps };
        }
        return p;
      });
      return { ...prev, [linha]: updatedLine };
    });
  };

  // Desfazer assinatura de treino
  const handleResetSignature = (linhaKey, postoName, opId) => {
    setPostData(prev => {
      const updatedLine = prev[linhaKey].map(p => {
        if (p.posto === postoName) {
          const updatedOps = p.operadores.map(op => {
            if (op.id === opId) {
              return { ...op, assinado: false, dataHora: null, assinaturaImg: null };
            }
            return op;
          });
          return { ...p, operadores: updatedOps };
        }
        return p;
      });
      return { ...prev, [linhaKey]: updatedLine };
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Breadcrumb / Indicador de Passos */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', fontSize: '0.9rem', fontWeight: 700 }}>
          <button 
            type="button" 
            onClick={() => { setCategoria(null); setLinha(null); }}
            style={{ 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: categoria ? 'var(--color-primary)' : 'var(--color-text-main)', 
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.95rem'
            }}
          >
            🎓 Treinamentos & Registro Digital
          </button>

          {categoria && (
            <>
              <ChevronRight size={16} color="var(--color-text-muted)" />
              <button 
                type="button" 
                onClick={() => setLinha(null)}
                style={{ 
                  backgroundColor: categoria === 'MODO BACKUP' ? '#FEF2F2' : '#ECFDF5', 
                  color: categoria === 'MODO BACKUP' ? '#B91C1C' : '#047857', 
                  border: `1px solid ${categoria === 'MODO BACKUP' ? '#FCA5A5' : '#6EE7B7'}`, 
                  borderRadius: '16px',
                  padding: '0.2rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {categoria}
              </button>
            </>
          )}

          {linha && (
            <>
              <ChevronRight size={16} color="var(--color-text-muted)" />
              <span style={{ 
                backgroundColor: '#EEF2FF', 
                color: '#0A1B9F', 
                border: '1px solid #C7D2FE', 
                borderRadius: '16px',
                padding: '0.2rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 800
              }}>
                LINHA {linha}
              </span>
            </>
          )}
        </div>

        {(categoria || linha) && (
          <button
            type="button"
            onClick={() => {
              if (linha) setLinha(null);
              else if (categoria) setCategoria(null);
            }}
            style={{
              backgroundColor: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ArrowLeft size={16} /> Voltar Etapa
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* PASSO 1: SELEÇÃO DE CATEGORIA (MODO BACKUP OU LIBERAÇÃO)  */}
      {/* ========================================================= */}
      {!categoria && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-primary-dark)', margin: 0 }}>
              Selecione o Tipo de Treinamento de Processo
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Escolha a modalidade operacional para listar as linhas e postos de trabalho
            </p>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
            
            {/* Card Modo Backup */}
            <div 
              onClick={() => setCategoria('MODO BACKUP')}
              style={{
                backgroundColor: 'white',
                border: '2px solid #EF4444',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', borderRadius: 'var(--radius-lg)', color: '#EF4444' }}>
                  <AlertTriangle size={36} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Plano de Contingência
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#991B1B', margin: 0 }}>
                    🔴 MODO BACKUP
                  </h3>
                </div>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
                Treinamento obrigatório para operadores em **Modo Derroga / Backup** quando o dispositivo Poka-Yoke estiver em manutenção.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#DC2626', fontWeight: 800, fontSize: '0.85rem', marginTop: '0.5rem' }}>
                <span>Acessar Linhas em Modo Backup</span>
                <ChevronRight size={18} />
              </div>
            </div>

            {/* Card Liberação de Poka-Yoke */}
            <div 
              onClick={() => setCategoria('LIBERAÇÃO DE POKA-YOKE')}
              style={{
                backgroundColor: 'white',
                border: '2px solid #10B981',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#ECFDF5', borderRadius: 'var(--radius-lg)', color: '#10B981' }}>
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Operação Padrão
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#065F46', margin: 0 }}>
                    🟢 LIBERAÇÃO DE POKA-YOKE
                  </h3>
                </div>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
                Treinamento padrão de liberação de processo e certificação dos sensores e dispositivos em funcionamento normal.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 800, fontSize: '0.85rem', marginTop: '0.5rem' }}>
                <span>Acessar Linhas de Liberação</span>
                <ChevronRight size={18} />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PASSO 2: SELEÇÃO DE LINHA DE PRODUÇÃO (BDIA OU BTR)       */}
      {/* ========================================================= */}
      {categoria && !linha && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Categoria Selecionada: {categoria}
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-text-main)', margin: '0.2rem 0 0' }}>
              Selecione a Linha de Produção
            </h2>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
            
            {/* Linha BDIA */}
            <div 
              onClick={() => setLinha('BDIA')}
              style={{
                backgroundColor: 'white',
                border: '2px solid #0A1B9F',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#EEF2FF', borderRadius: 'var(--radius-lg)', color: '#0A1B9F' }}>
                  <Layers size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-primary-dark)', margin: 0 }}>
                    LINHA BDIA
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                    Bancos Dianteiros ({postData.BDIA.length} Postos de Trabalho)
                  </p>
                </div>
              </div>
              <ChevronRight size={24} color="#0A1B9F" />
            </div>

            {/* Linha BTR */}
            <div 
              onClick={() => setLinha('BTR')}
              style={{
                backgroundColor: 'white',
                border: '2px solid #0A1B9F',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#EEF2FF', borderRadius: 'var(--radius-lg)', color: '#0A1B9F' }}>
                  <Layers size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-primary-dark)', margin: 0 }}>
                    LINHA BTR
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                    Bancos Traseiros ({postData.BTR.length} Postos de Trabalho)
                  </p>
                </div>
              </div>
              <ChevronRight size={24} color="#0A1B9F" />
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PASSO 3 & 4: LISTA DE POSTOS SEPARADOS E ASSINATURA      */}
      {/* ========================================================= */}
      {categoria && linha && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Busca por Operador */}
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                Postos de Trabalho — Linha {linha} ({categoria})
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, marginTop: '0.15rem' }}>
                Clique sobre o <strong>Nome do Operador</strong> para coletar a assinatura digital com o dedo ou mouse
              </p>
            </div>

            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Pesquisar operador..."
                className="input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.2rem', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Grid de Postos Individualizados */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {postData[linha].map((postoObj, pIdx) => {
              const opsFiltrados = postoObj.operadores.filter(op => 
                op.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                op.matricula.toLowerCase().includes(searchTerm.toLowerCase())
              );

              if (searchTerm && opsFiltrados.length === 0) return null;

              return (
                <div 
                  key={pIdx}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Cabeçalho do Posto */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                        Posto Separado #{pIdx + 1}
                      </span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-text-main)', margin: '0.15rem 0 0' }}>
                        {postoObj.posto}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {(() => {
                        const link = getPostoLink(categoria, linha, postoObj.posto);
                        if (!link) return null;
                        return (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              backgroundColor: categoria === 'MODO BACKUP' ? '#FEF2F2' : '#ECFDF5',
                              color: categoria === 'MODO BACKUP' ? '#DC2626' : '#059669',
                              border: `1px solid ${categoria === 'MODO BACKUP' ? '#FCA5A5' : '#6EE7B7'}`,
                              padding: '0.35rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            <Video size={14} /> Padrão Visual mLEAN <ExternalLink size={12} />
                          </a>
                        );
                      })()}

                      <div style={{ backgroundColor: '#EEF2FF', color: '#0A1B9F', padding: '0.35rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                        📜 {postoObj.instrucao}
                      </div>
                    </div>
                  </div>

                  {/* Lista de Operadores do Posto */}
                  <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {opsFiltrados.map(op => {
                      const isAllowedToSign = canOperatorSign(op);

                      return (
                        <div 
                          key={op.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.85rem 1rem',
                            backgroundColor: op.assinado ? '#F0FDF4' : (isAllowedToSign ? '#FFFBEB' : '#F8FAFC'),
                            border: `1px solid ${op.assinado ? '#A7F3D0' : (isAllowedToSign ? '#FDE68A' : '#E2E8F0')}`,
                            borderRadius: 'var(--radius-md)',
                            flexWrap: 'wrap',
                            gap: '0.75rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              backgroundColor: op.assinado ? '#10B981' : (isAllowedToSign ? '#F59E0B' : '#94A3B8'),
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.9rem'
                            }}>
                              {op.nome.charAt(0)}
                            </div>
                            <div>
                              {/* NOME DO OPERADOR CLICÁVEL */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenSignature(postoObj, op)}
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    padding: 0,
                                    fontSize: '1rem',
                                    fontWeight: 800,
                                    color: 'var(--color-primary-dark)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    textDecoration: 'underline'
                                  }}
                                >
                                  👤 {op.nome} ({op.matricula})
                                </button>

                                {isAllowedToSign && !op.assinado && (
                                  <span style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '0.15rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>
                                    👤 Você (Sua Conta Logada)
                                  </span>
                                )}

                                {!isAllowedToSign && !op.assinado && (
                                  <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', padding: '0.15rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                    <Lock size={11} /> Exige Login do Próprio Operador
                                  </span>
                                )}
                              </div>

                              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                                Status: {op.assinado ? (
                                  <span style={{ color: '#047857', fontWeight: 800 }}>
                                    ✅ TREINADO E ASSINADO (🕒 {op.dataHora})
                                  </span>
                                ) : (
                                  <span style={{ color: isAllowedToSign ? '#B45309' : '#64748B', fontWeight: 700 }}>
                                    {isAllowedToSign ? '✍️ Clique para assinar o seu treinamento' : '🔒 Restrito: Apenas este operador pode assinar seu próprio treino'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Botão de Ação do Operador */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {op.assinado ? (
                              <>
                                {op.assinaturaImg && (
                                  <div style={{ backgroundColor: 'white', border: '1px solid #CBD5E1', padding: '0.15rem 0.4rem', borderRadius: '4px', maxWidth: '90px' }}>
                                    <img src={op.assinaturaImg} alt="Assinatura" style={{ width: '100%', height: '22px', objectFit: 'contain' }} />
                                  </div>
                                )}
                                {(isAdmin || isEngenheiro || isAllowedToSign) && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetSignature(linha, postoObj.posto, op.id)}
                                    style={{
                                      backgroundColor: '#F1F5F9',
                                      border: '1px solid #CBD5E1',
                                      color: '#475569',
                                      padding: '0.4rem 0.65rem',
                                      borderRadius: 'var(--radius-md)',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Desfazer
                                  </button>
                                )}
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenSignature(postoObj, op)}
                                style={{
                                  backgroundColor: isAllowedToSign ? '#0A1B9F' : '#94A3B8',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.5rem 1rem',
                                  borderRadius: 'var(--radius-md)',
                                  fontSize: '0.8rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  boxShadow: 'var(--shadow-sm)'
                                }}
                              >
                                {isAllowedToSign ? <Edit3 size={15} /> : <Lock size={15} />}
                                {isAllowedToSign ? 'Assinar com Dedo / Mouse' : 'Assinar (Requer Login)'}
                              </button>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Modal de Alerta de Segurança (Tentativa de Assinatura por Terceiros) */}
      {identityError && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
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
            maxWidth: '520px',
            boxShadow: 'var(--shadow-xl)',
            border: '2px solid #EF4444',
            overflow: 'hidden'
          }}>
            <div style={{ backgroundColor: '#EF4444', color: 'white', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={24} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0 }}>
                  Bloqueio de Segurança Digital
                </h3>
              </div>
              <button onClick={() => setIdentityError(null)} style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '1rem', borderRadius: 'var(--radius-md)', color: '#991B1B', fontSize: '0.9rem', lineHeight: '1.5' }}>
                🔒 <strong>Assinatura Restrita ao Próprio Operador:</strong>
                <p style={{ marginTop: '0.5rem', margin: 0 }}>
                  Você está autenticado no momento como <strong>{identityError.currentName} ({identityError.currentMatricula})</strong>.
                </p>
                <p style={{ marginTop: '0.5rem', margin: 0 }}>
                  Apenas o operador <strong>{identityError.targetOp} ({identityError.targetMatricula})</strong> possui permissão jurídica e de processo para assinar o seu próprio treinamento.
                </p>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                💡 <em>Dica: Para assinar este treinamento, altere o usuário autenticado na tela de login ou solicite a supervisão de um Engenheiro de Processos.</em>
              </div>

              <button
                type="button"
                onClick={() => setIdentityError(null)}
                style={{
                  backgroundColor: '#0A1B9F',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Compreendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Assinatura com Dedo / Mouse */}
      <SignatureCanvasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSignature}
        operatorName={selectedOp?.nome}
        postoName={selectedPostoName}
        categoryName={categoria || 'TREINAMENTO'}
        lineName={linha || 'LINHA'}
      />

    </div>
  );
}

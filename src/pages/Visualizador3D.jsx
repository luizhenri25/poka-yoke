import React, { useState } from 'react';
import PokaYokeViewer3D from '../components/PokaYokeViewer3D';
import { 
  Box, 
  RotateCw, 
  Sparkles, 
  Layers, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  FileText,
  Info
} from 'lucide-react';

export default function Visualizador3D() {
  const [selectedPosto, setSelectedPosto] = useState('POSTO3');

  const postosInfo = {
    POSTO3: {
      codigoPY: 'PY-JPR-225',
      nome: 'Painel CLP Inversão de Estrutura EDIA',
      posto: 'POSTO 3',
      linha: 'BDIA (Encostos Dianteiros)',
      docCode: 'JPR-I-PSS-2025',
      sensorTipo: 'Sensor Ótico Laser de Presença e Alinhamento',
      especificacao: 'Detecta a inversão física entre as estruturas dos bancos motorista e passageiro antes da montagem final.',
      falhaEvitada: 'Inversão das estruturas de encostos dianteiros no processo de montagem.',
      instrucaoBackup: 'Em caso de alarme ou falha do leitor laser, acione o botão Modo Backup no painel e utilize o gabarito mecânico vermelho.'
    },
    POSTO10: {
      codigoPY: 'PY-JPR-228',
      nome: 'Parafusadeira Elétrica Torque Fecho Cinto',
      posto: 'POSTO 10',
      linha: 'BDIA (Encostos Dianteiros)',
      docCode: 'JPR-I-PSS-1840',
      sensorTipo: 'Sensor Indutivo de Torque & Posição de Soquete',
      especificacao: 'Valida se o fecho de cinto P13C/P02H foi apertado com o valor de torque dentro da tolerância especificada.',
      falhaEvitada: 'Falta de aperto no fecho de cinto de segurança.',
      instrucaoBackup: 'Se a parafusadeira descalibrar, utilize a chave de estalo manual calibrada guardada na gaveta amarela.'
    },
    DFE015: {
      codigoPY: 'PY-JPR-272',
      nome: 'Leitor Fixo QR Enrolador P02H',
      posto: 'DFE015',
      linha: 'BTR (Bancos Traseiros)',
      docCode: 'JPR-I-PSS-1549',
      sensorTipo: 'Câmera de Visão & Scanner QR Code Industrial',
      especificacao: 'Realiza a leitura do código QR no enrolador do cinto traseiro para confirmar a rastreabilidade.',
      falhaEvitada: 'Montagem de enrolador de modelo incompatível.',
      instrucaoBackup: 'Utilize o scanner portátil de mão para bipar manualmente o código na etiqueta da peça.'
    }
  };

  const currentInfo = postosInfo[selectedPosto];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Cabeçalho do Visualizador 3D */}
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
            <Box size={32} color="var(--color-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Visualizador 3D de Peças Poka-Yoke
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              Inspeção 360° interativa para operadores e engenharia da Forvia Faurecia Porto Real.
            </p>
          </div>
        </div>

        {/* Seletor de Posto em 3D */}
        <div className="segmented-control" style={{ margin: 0 }}>
          <button 
            className={`segmented-btn ${selectedPosto === 'POSTO3' ? 'active' : ''}`}
            onClick={() => setSelectedPosto('POSTO3')}
          >
            POSTO 3 (Estrutura BDIA)
          </button>
          <button 
            className={`segmented-btn ${selectedPosto === 'POSTO10' ? 'active' : ''}`}
            onClick={() => setSelectedPosto('POSTO10')}
          >
            POSTO 10 (Parafusadeira)
          </button>
          <button 
            className={`segmented-btn ${selectedPosto === 'DFE015' ? 'active' : ''}`}
            onClick={() => setSelectedPosto('DFE015')}
          >
            DFE015 (Enrolador BTR)
          </button>
        </div>
      </div>

      {/* SEÇÃO PRINCIPAL: TELA 3D + FICHA TÉCNICA DO POSTO */}
      <div className="grid grid-cols-3" style={{ gap: '1.5rem', alignItems: 'start' }}>
        
        {/* CANVAS 3D INTERATIVO (2 colunas) */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--color-primary)" />
                <span style={{ fontWeight: 800, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                  Modelo 3D Interativo — {currentInfo.posto} ({currentInfo.linha})
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#EEF2FF', color: 'var(--color-primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                WebGL Engine (Three.js)
              </span>
            </div>

            {/* Componente 3D WebGL */}
            <PokaYokeViewer3D modelType={selectedPosto} highlightSensor={true} showRabbit={true} />

          </div>
        </div>

        {/* FICHA TÉCNICA E REGRAS DE REAÇÃO (1 coluna) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0, marginBottom: '1rem', borderBottom: '2px solid var(--color-bg-main)', paddingBottom: '0.5rem' }}>
              Ficha Técnica do Poka-Yoke
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Código do Poka-Yoke:</span>
                <strong style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>{currentInfo.codigoPY}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Documento Padrão (FCP Library):</span>
                <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{currentInfo.docCode}</span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Tipo de Sensor Instalado:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#047857', marginTop: '0.15rem' }}>
                  <Cpu size={15} color="#10B981" /> {currentInfo.sensorTipo}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Especificação de Atuação:</span>
                <p style={{ margin: 0, marginTop: '0.2rem', lineHeight: '1.4', color: 'var(--color-text-main)' }}>
                  {currentInfo.especificacao}
                </p>
              </div>

              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '0.75rem', borderRadius: '6px' }}>
                <span style={{ color: '#B91C1C', fontWeight: 800, display: 'block', fontSize: '0.75rem' }}>Falha Evitada pelo Poka-Yoke:</span>
                <p style={{ margin: 0, marginTop: '0.2rem', color: '#991B1B', lineHeight: '1.4', fontWeight: 600 }}>
                  {currentInfo.falhaEvitada}
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '0.75rem', borderRadius: '6px' }}>
                <span style={{ color: '#B45309', fontWeight: 800, display: 'block', fontSize: '0.75rem' }}>Regra de Reação & Modo Backup:</span>
                <p style={{ margin: 0, marginTop: '0.2rem', color: '#92400E', lineHeight: '1.4' }}>
                  {currentInfo.instrucaoBackup}
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Settings, Cloud, Grid, GraduationCap, Rabbit } from 'lucide-react';
import Placas from './Placas';
import LiberacaoProcessos from './LiberacaoProcessos';
import Treinamento from './Treinamento';
import ModoBackup from './ModoBackup';
import PecasCoelho from './PecasCoelho';

export default function JIT() {
  const [activeTab, setActiveTab] = useState('liberacao');

  const modules = [
    { id: 'liberacao', title: 'Liberação de POKA YOKE', subtitle: 'Configuração de processos (BDIA/BTR)', icon: Settings },
    { id: 'backup', title: 'Modo Backup', subtitle: 'Redirecionamento & Standby', icon: Cloud },
    { id: 'placas', title: 'Placas', subtitle: 'Inventário Poka-Yoke', icon: Grid },
    { id: 'treinamento', title: 'Treinamento', subtitle: 'Manuais & Vídeos Técnicos', icon: GraduationCap },
    { id: 'pecas-coelho', title: 'Peças Coelho', subtitle: 'Validação & Controle Mensal', icon: Rabbit }
  ];

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* 5 Cards Superiores */}
      <div className="module-grid">
        {modules.map((mod) => (
          <button 
            key={mod.id}
            className={`module-card ${activeTab === mod.id ? 'active' : ''}`}
            onClick={() => setActiveTab(mod.id)}
          >
            <mod.icon size={28} className="module-icon" />
            <div>
              <h3>{mod.title}</h3>
              <p>{mod.subtitle}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Conteúdo Dinâmico Inferior */}
      <div style={{ flex: 1, position: 'relative' }}>
        {activeTab === 'liberacao' && <LiberacaoProcessos />}
        {activeTab === 'backup' && <ModoBackup />}
        {activeTab === 'placas' && <Placas />}
        {activeTab === 'treinamento' && <Treinamento />}
        {activeTab === 'pecas-coelho' && <PecasCoelho />}
      </div>
    </div>
  );
}

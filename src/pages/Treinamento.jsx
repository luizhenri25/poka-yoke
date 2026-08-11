import React from 'react';
import TreinamentoHierarquico from '../components/TreinamentoHierarquico';

export default function Treinamento() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <TreinamentoHierarquico />
    </div>
  );
}

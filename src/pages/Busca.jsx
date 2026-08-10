import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { fetchPokaYokesData } from '../utils/csvParser';

export default function Busca() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const items = await fetchPokaYokesData();
      setData(items);
      setLoading(false);
    }
    loadData();
  }, []);

  const searchResults = query.length >= 2 
    ? data.filter(item => {
        const searchText = `${item.PY} ${item.Especificacao} ${item['DISPOSITIVO/POSTO']} ${item['Falha Evitada']} ${item.Instrucao}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      })
    : [];

  return (
    <div className="card">
      <h2 className="card-title">Busca Global</h2>
      <p className="mb-4 text-muted">Pesquise por postos, peças, instruções ou registros no sistema.</p>
      
      <div className="input-group">
        <div className="flex gap-2">
          <input 
            type="text" 
            className="input-field" 
            style={{ flex: 1 }}
            placeholder="Digite sua busca (ex: Posto 4, JPR-I-PSS, Airbag...)" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary">
            <Search size={18} />
            Buscar
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        {loading && <p>Carregando base de dados...</p>}
        {!loading && query.length < 2 && (
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            Digite pelo menos 2 caracteres para buscar...
          </p>
        )}
        {!loading && query.length >= 2 && searchResults.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            Nenhum resultado encontrado para "{query}".
          </p>
        )}
        {!loading && searchResults.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p><strong>{searchResults.length}</strong> resultados encontrados:</p>
            {searchResults.map((result, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{result.PY} - {result['DISPOSITIVO/POSTO']} ({result.LINHA})</h4>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--color-bg-main)', borderRadius: '4px' }}>
                    {result['STATUS PY']}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}><strong>Especificação:</strong> {result.Especificacao}</p>
                <p style={{ fontSize: '0.875rem' }}><strong>Instrução:</strong> {result.Instrucao}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

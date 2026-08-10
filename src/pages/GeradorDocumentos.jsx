import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Upload, 
  Eye, 
  Edit3
} from 'lucide-react';

export default function GeradorDocumentos() {
  const [activeTab, setActiveTab] = useState('FORM'); // 'FORM' ou 'PREVIEW'

  // Dados da Instrução (JPR-I-PSS)
  const [formData, setFormData] = useState({
    codigoDoc: 'JPR-I-PSS-2025',
    titulo: 'Instrução de Definição e Validação de PY - Inversão do Encosto Dianteiro',
    pyCode: 'PY-JPR-225',
    posto: 'POSTO 3',
    linha: 'BDIA',
    revisao: 'Rev02',
    dataRevisao: '04/08/2026',
    engenheiro: 'Caio Cabral',
    qualidade: 'Anna Júlia',
    producao: 'Supervisão de Produção JIT',
    historicoModificacao: 'Atualização do parâmetro de controle no CLP e inclusão da regra de reação para modo backup em caso de falha de sensor.',
    especificacao: 'Painel Elétrico (CLP): Controla a conformidade de inversão das estruturas de encostos dianteiros.',
    falhaEvitada: 'Evita a inversão das estruturas de encostos direito e esquerdo no processo de montagem.',
    procedimentoOK: 'O sistema seguiu o parâmetro correto (Torque OK, Peça Correta, Sensor de Posição OK). Ação: Registrar o valor se aplicável, prosseguir com a montagem normal da peça e liberar para o próximo posto.',
    procedimentoNOK: 'O dispositivo alarmou falha, falta de peça ou erro de torque. Ação Executável: Paralisar a linha imediatamente, acionar o líder. Caso não haja bom funcionamento, inicie o procedimento de Modo Backup e registre o evento.',
    imagemUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Cabeçalho da Tela (Oculto na Impressão) */}
      <div className="no-print" style={{
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
            <FileText size={32} color="var(--color-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Gerador Automático de Documentos Oficiais (JPR-I-PSS)
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              Crie folhas oficiais padronizadas A4 para a biblioteca FCP da Forvia Faurecia sem complicações de Word/Excel.
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="segmented-control" style={{ margin: 0 }}>
            <button 
              className={`segmented-btn ${activeTab === 'FORM' ? 'active' : ''}`}
              onClick={() => setActiveTab('FORM')}
            >
              <Edit3 size={15} style={{ marginRight: '0.35rem' }} /> Formulário
            </button>
            <button 
              className={`segmented-btn ${activeTab === 'PREVIEW' ? 'active' : ''}`}
              onClick={() => setActiveTab('PREVIEW')}
            >
              <Eye size={15} style={{ marginRight: '0.35rem' }} /> Visualizar A4
            </button>
          </div>

          <button 
            className="btn btn-primary"
            onClick={handlePrint}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
          >
            <Printer size={18} /> Gerar PDF / Imprimir Oficial
          </button>
        </div>
      </div>

      {/* ABA 1: FORMULÁRIO DE PREENCHIMENTO DO ENGENHEIRO */}
      {activeTab === 'FORM' && (
        <div className="card no-print">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={22} color="var(--color-primary)" />
            Dados da Nova Revisão do Documento Técnicos (Processos / Qualidade)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
            
            <div className="input-group">
              <label className="input-label">Código do Documento Oficial (FCP)</label>
              <input 
                type="text" 
                name="codigoDoc"
                value={formData.codigoDoc} 
                onChange={handleChange}
                className="input-field" 
                placeholder="Ex: JPR-I-PSS-2025" 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Número do Poka-Yoke</label>
              <input 
                type="text" 
                name="pyCode"
                value={formData.pyCode} 
                onChange={handleChange}
                className="input-field" 
                placeholder="Ex: PY-JPR-225" 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Número da Revisão</label>
              <input 
                type="text" 
                name="revisao"
                value={formData.revisao} 
                onChange={handleChange}
                className="input-field" 
                placeholder="Ex: Rev02" 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Posto de Trabalho</label>
              <input 
                type="text" 
                name="posto"
                value={formData.posto} 
                onChange={handleChange}
                className="input-field" 
                placeholder="Ex: POSTO 3" 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Linha de Produção</label>
              <select name="linha" value={formData.linha} onChange={handleChange} className="input-field">
                <option value="BDIA">BDIA (Encostos Dianteiros)</option>
                <option value="BTR">BTR (Bancos Traseiros)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Data de Emissão / Alteração</label>
              <input 
                type="text" 
                name="dataRevisao"
                value={formData.dataRevisao} 
                onChange={handleChange}
                className="input-field" 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Engenheiro Responsável</label>
              <input 
                type="text" 
                name="engenheiro"
                value={formData.engenheiro} 
                onChange={handleChange}
                className="input-field" 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Engenheiro de Qualidade</label>
              <input 
                type="text" 
                name="qualidade"
                value={formData.qualidade} 
                onChange={handleChange}
                className="input-field" 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Supervisão de Produção</label>
              <input 
                type="text" 
                name="producao"
                value={formData.producao} 
                onChange={handleChange}
                className="input-field" 
              />
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="input-group">
              <label className="input-label">Especificação Técnica do Dispositivo</label>
              <textarea 
                rows="3" 
                name="especificacao"
                value={formData.especificacao} 
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Falha Evitada pelo Poka-Yoke</label>
              <textarea 
                rows="3" 
                name="falhaEvitada"
                value={formData.falhaEvitada} 
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">Histórico de Modificação nesta Revisão</label>
            <textarea 
              rows="2" 
              name="historicoModificacao"
              value={formData.historicoModificacao} 
              onChange={handleChange}
              className="input-field"
              placeholder="Descreva o que mudou em relação à versão anterior..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="input-group">
              <label className="input-label">Procedimento Operacional OK (Verde)</label>
              <textarea 
                rows="3" 
                name="procedimentoOK"
                value={formData.procedimentoOK} 
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Procedimento Operacional NÃO OK / Backup (Vermelho)</label>
              <textarea 
                rows="3" 
                name="procedimentoNOK"
                value={formData.procedimentoNOK} 
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">URL da Imagem Técnica do Dispositivo</label>
            <input 
              type="text" 
              name="imagemUrl"
              value={formData.imagemUrl} 
              onChange={handleChange}
              className="input-field" 
              placeholder="Link da imagem ou foto técnica..."
            />
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => setActiveTab('PREVIEW')}
            style={{ width: '100%', padding: '0.85rem', fontWeight: 800, fontSize: '1rem' }}
          >
            Visualizar Documento Oficial Formatado em A4 ➔
          </button>
        </div>
      )}

      {/* ABA 2: PRÉ-VISUALIZADOR DO DOCUMENTO OFICIAL A4 (PRONTO PARA IMPRESSÃO / PDF) */}
      {(activeTab === 'PREVIEW' || true) && (
        <div className={`printable-a4-doc ${activeTab === 'FORM' ? 'no-print' : ''}`} style={{
          backgroundColor: 'white',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)',
          color: '#1E293B'
        }}>
          
          {/* CABEÇALHO OFICIAL FORVIA FAURECIA */}
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            borderBottom: '3px solid var(--color-primary)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Lock size={32} color="var(--color-primary)" />
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-primary)', margin: 0, letterSpacing: '0.5px' }}>
                  POKA-YOKE
                </h1>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  FORVIA FAURECIA — PORTO REAL
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.35rem 0.85rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.9rem' }}>
                {formData.codigoDoc}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'block' }}>
                REVISÃO ATIVA: {formData.revisao} | DATA: {formData.dataRevisao}
              </span>
            </div>
          </div>

          {/* TÍTULO PRINCIPAL DO DOCUMENTO */}
          <div style={{ backgroundColor: 'var(--color-bg-main)', padding: '1rem 1.5rem', borderRadius: '6px', marginBottom: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
              {formData.titulo}
            </h2>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              <span>POSTO: <strong style={{ color: 'var(--color-primary)' }}>{formData.posto}</strong></span>
              <span>LINHA: <strong style={{ color: 'var(--color-primary)' }}>{formData.linha}</strong></span>
              <span>CÓDIGO PY: <strong style={{ color: 'var(--color-primary)' }}>{formData.pyCode}</strong></span>
            </div>
          </div>

          {/* TABELA DE HISTÓRICO DE MODIFICAÇÃO */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary-dark)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              1. Histórico de Revisões e Modificações FCP
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', border: '1px solid #CBD5E1' }}>
              <thead style={{ backgroundColor: '#F1F5F9' }}>
                <tr>
                  <th style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', textAlign: 'left' }}>Revisão</th>
                  <th style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', textAlign: 'left' }}>Data</th>
                  <th style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', textAlign: 'left' }}>Descrição da Modificação</th>
                  <th style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', textAlign: 'left' }}>Elaborador</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', fontWeight: 700 }}>{formData.revisao}</td>
                  <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1' }}>{formData.dataRevisao}</td>
                  <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1' }}>{formData.historicoModificacao}</td>
                  <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', fontWeight: 600 }}>{formData.engenheiro}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ESPECIFICAÇÃO E FOTO DO DISPOSITIVO */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary-dark)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                2. Especificação Técnica & Falha Evitada
              </h3>
              
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '0.25rem' }}>Especificação do Dispositivo:</strong>
                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>{formData.especificacao}</p>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '6px' }}>
                <strong style={{ color: '#B91C1C', display: 'block', marginBottom: '0.25rem' }}>Falha Evitada no Processo:</strong>
                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>{formData.falhaEvitada}</p>
              </div>
            </div>

            {/* Imagem Técnica */}
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary-dark)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Foto Técnica do Dispositivo
              </h3>
              <div style={{ border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9' }}>
                {formData.imagemUrl ? (
                  <img src={formData.imagemUrl} alt="Foto Técnica" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Sem foto anexada</span>
                )}
              </div>
            </div>
          </div>

          {/* PROCEDIMENTO OPERACIONAL DE VALIDAÇÃO (OK / NOK) */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary-dark)', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
              3. Procedimento Operacional de Validação & Modo Backup
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* OK */}
              <div style={{ border: '2px solid #10B981', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#ECFDF5' }}>
                <h4 style={{ fontWeight: 800, color: '#047857', marginBottom: '0.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={18} color="#10B981" /> Ok (Funcionamento Normal)
                </h4>
                <p style={{ color: '#065F46', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                  {formData.procedimentoOK}
                </p>
              </div>

              {/* NOK */}
              <div style={{ border: '2px solid #EF4444', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#FEF2F2' }}>
                <h4 style={{ fontWeight: 800, color: '#B91C1C', marginBottom: '0.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={18} color="#EF4444" /> Definindo não OK (Falha / Entrada em Modo Backup)
                </h4>
                <p style={{ color: '#991B1B', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                  {formData.procedimentoNOK}
                </p>
              </div>
            </div>
          </div>

          {/* QUADRO OFICIAL DE ASSINATURAS */}
          <div style={{ borderTop: '2px solid #CBD5E1', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'center' }}>
              Aprovações & Assinaturas Digitais Oficiais (FCP Library)
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
              <div>
                <div style={{ borderBottom: '1.5px solid #64748B', marginBottom: '0.5rem', height: '35px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '0.2rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {formData.engenheiro}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'block' }}>Engenharia de Processos</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Assinado digitalmente via POKA-YOKE System</span>
              </div>

              <div>
                <div style={{ borderBottom: '1.5px solid #64748B', marginBottom: '0.5rem', height: '35px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '0.2rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {formData.qualidade}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'block' }}>Engenharia de Qualidade</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Assinado digitalmente via POKA-YOKE System</span>
              </div>

              <div>
                <div style={{ borderBottom: '1.5px solid #64748B', marginBottom: '0.5rem', height: '35px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '0.2rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {formData.producao}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'block' }}>Supervisão de Produção</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Assinado digitalmente via POKA-YOKE System</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

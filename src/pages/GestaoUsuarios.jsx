import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Wrench, 
  User, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Key,
  Search
} from 'lucide-react';

export default function GestaoUsuarios() {
  const { usersList, addUser, removeUser, currentUser, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = usersList.filter(u => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.matricula && u.matricula.toLowerCase().includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    matricula: '',
    password: '',
    role: 'operador'
  });

  const [notification, setNotification] = useState(null);

  if (!isAdmin) {
    return (
      <div className="card text-center" style={{ padding: '3rem' }}>
        <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B91C1C' }}>Acesso Restrito ao Administrador</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          Seu perfil de usuário ({currentUser?.role}) não possui permissão para gerenciar contas de acesso da fábrica.
        </p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;

    addUser(formData);
    setNotification(`Usuário "${formData.name}" cadastrado com sucesso!`);
    
    setFormData({
      name: '',
      email: '',
      matricula: '',
      password: '',
      role: 'operador'
    });

    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Cabeçalho */}
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
            <Users size={32} color="var(--color-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Gestão de Usuários & Controle de Permissões (RBAC)
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              Painel exclusivo de Administrador para cadastro e gerenciamento das contas de acesso da Forvia Faurecia.
            </p>
          </div>
        </div>

        <span style={{ fontSize: '0.8rem', backgroundColor: '#EEF2FF', color: 'var(--color-primary)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontWeight: 800, border: '1px solid #C7D2FE' }}>
          👑 Logado como Administrador
        </span>
      </div>

      {notification && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', padding: '1rem', borderRadius: 'var(--radius-md)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={20} color="#10B981" />
          {notification}
        </div>
      )}

      <div className="grid grid-cols-3" style={{ gap: '1.5rem', alignItems: 'start' }}>
        
        {/* FORMULÁRIO DE NOVO USUÁRIO */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={20} color="var(--color-primary)" />
            Cadastrar Novo Usuário
          </h3>

          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            <div className="input-group">
              <label className="input-label">Nome Completo</label>
              <input 
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Ana Júlia Santos"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">E-mail Corporativo</label>
              <input 
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ana.santos@faurecia.com"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Matrícula Operacional</label>
              <input 
                type="text"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
                placeholder="Ex: ENG-204"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Senha Inicial</label>
              <input 
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Perfil de Permissão (Role)</label>
              <select name="role" value={formData.role} onChange={handleChange} className="input-field">
                <option value="operador">Operador (Apenas Assistir / Somente Leitura)</option>
                <option value="engenheiro">Engenheiro (Criar/Editar Instruções & Lançar Revisões)</option>
                <option value="admin">Administrador Geral (Acesso Total + Gestão Usuários)</option>
              </select>
            </div>

            <button 
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontWeight: 800, marginTop: '0.5rem' }}
            >
              ➕ Cadastrar Usuário
            </button>
          </form>
        </div>

        {/* TABELA DE USUÁRIOS CADASTRADOS */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                Contas de Acesso Cadastradas ({filteredUsers.length} de {usersList.length})
              </h3>

              {/* Lupa de Pesquisa 🔍 */}
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={16} color="var(--color-primary)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, e-mail, matrícula..."
                  className="input-field"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.2rem', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead style={{ backgroundColor: 'var(--color-bg-main)', borderBottom: '2px solid var(--color-border)' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Usuário</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Matrícula / E-mail</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Perfil (Role)</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        Nenhum usuário encontrado para a busca "{searchQuery}".
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'white' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {user.name} {user.id === currentUser?.id && ' (Você)'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>
                        <div><strong>{user.matricula || 'N/A'}</strong></div>
                        <span style={{ fontSize: '0.75rem' }}>{user.email}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {user.role === 'admin' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', borderRadius: '12px', backgroundColor: '#EEF2FF', color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.75rem' }}>
                            <ShieldCheck size={14} /> Administrador
                          </span>
                        )}
                        {user.role === 'engenheiro' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#047857', fontWeight: 800, fontSize: '0.75rem' }}>
                            <Wrench size={14} /> Engenheiro
                          </span>
                        )}
                        {user.role === 'operador' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', borderRadius: '12px', backgroundColor: '#FFFBEB', color: '#B45309', fontWeight: 800, fontSize: '0.75rem' }}>
                            <User size={14} /> Operador (Somente Leitura)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                        {user.id !== currentUser?.id ? (
                          <button
                            onClick={() => removeUser(user.id)}
                            style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444', padding: '0.35rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }}
                            title="Remover Conta"
                          >
                            <Trash2 size={15} />
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Ativo</span>
                        )}
                      </td>
                    </tr>
                  )))
                }
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

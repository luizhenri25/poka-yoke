import React, { useState } from 'react';
import { Mail, Search, CheckSquare, Square, X, Send, UserCheck, Shield, Wrench, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EmailRecipientSelectorModal({ isOpen, onClose, onConfirmSend, expiringCount, expiredCount }) {
  const { usersList } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Lista de e-mails selecionados (padrão: todos selecionados)
  const [selectedEmails, setSelectedEmails] = useState(() => usersList.map(u => u.email));

  if (!isOpen) return null;

  // Filtragem com Lupa de Pesquisa 🔍
  const filteredUsers = usersList.filter(u => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.matricula && u.matricula.toLowerCase().includes(term)) ||
      u.role.toLowerCase().includes(term)
    );
  });

  const toggleSelectUser = (email) => {
    setSelectedEmails(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleSelectAll = () => {
    setSelectedEmails(usersList.map(u => u.email));
  };

  const handleDeselectAll = () => {
    setSelectedEmails([]);
  };

  const handleSend = () => {
    if (selectedEmails.length === 0) {
      alert("Por favor, selecione pelo menos um usuário/e-mail para enviar a notificação.");
      return;
    }
    onConfirmSend(selectedEmails);
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return <span style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #FCA5A5', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><Shield size={12} /> Admin</span>;
    }
    if (role === 'engenheiro') {
      return <span style={{ backgroundColor: '#EEF2FF', color: '#2563EB', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #BFDBFE', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><Wrench size={12} /> Engenheiro</span>;
    }
    return <span style={{ backgroundColor: '#F0FDF4', color: '#16A34A', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #BBF7D0', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><User size={12} /> Operador</span>;
  };

  return (
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
        maxWidth: '640px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}>
        
        {/* Cabeçalho do Modal */}
        <div style={{
          backgroundColor: '#0A1B9F',
          color: 'white',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={22} />
              Selecionar Destinatários da Notificação
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#E2E8F0', margin: 0, marginTop: '0.2rem' }}>
              Alerta de Poka-Yoke ({expiredCount} Vencidos / {expiringCount} Vencendo)
            </p>
          </div>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div style={{ padding: '1.25rem 1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Lupa de Pesquisa de Usuários 🔍 */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search 
              size={18} 
              color="var(--color-primary)" 
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              type="text"
              className="input-field"
              placeholder="Pesquisar por nome, e-mail, matrícula ou perfil (ex: Caio, Operador, ENG-102)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.75rem', width: '100%', fontSize: '0.9rem' }}
            />
          </div>

          {/* Barra de Seleção Rápida */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              <UserCheck size={16} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'text-bottom' }} />
              {selectedEmails.length} de {usersList.length} destinatários selecionados
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button" 
                onClick={handleSelectAll} 
                style={{ backgroundColor: '#EEF2FF', color: 'var(--color-primary)', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Selecionar Todos
              </button>
              <button 
                type="button" 
                onClick={handleDeselectAll} 
                style={{ backgroundColor: '#F1F5F9', color: 'var(--color-text-muted)', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Desmarcar Todos
              </button>
            </div>
          </div>

          {/* Lista de Usuários com Checkbox */}
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {filteredUsers.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Nenhum usuário encontrado para a busca "{searchTerm}".
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedEmails.includes(user.email);
                return (
                  <div
                    key={user.id}
                    onClick={() => toggleSelectUser(user.email)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      padding: '0.85rem 1rem',
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isSelected ? '#F0F5FF' : 'white',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Tratado no onClick da div pai
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0A1B9F' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {user.name}
                          {user.matricula && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>({user.matricula})</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div>
                      {getRoleBadge(user.role)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Rodapé do Modal com Ação de Disparo */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSend}
            className="btn btn-primary"
            style={{ backgroundColor: '#0A1B9F', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.35rem', fontWeight: 800, fontSize: '0.85rem' }}
          >
            <Send size={16} /> Disparar E-mail ({selectedEmails.length})
          </button>
        </div>

      </div>
    </div>
  );
}

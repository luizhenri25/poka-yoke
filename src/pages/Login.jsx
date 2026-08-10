import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, UserCheck, ShieldCheck, Wrench, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login, DEFAULT_USERS } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const res = login(identifier, password);
    if (res.success) {
      navigate('/');
    } else {
      setErrorMessage(res.error);
    }
  };

  const handleQuickLogin = (email, pwd) => {
    setIdentifier(email);
    setPassword(pwd);
    const res = login(email, pwd);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg-main)',
      padding: '1.5rem',
      gap: '2rem'
    }}>
      {/* BONECO 3D MAIOR SEM FUNDO (BONECO2.MP4) NA LATERAL DA TELA DE LOGIN */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        position: 'relative'
      }}>
        {/* Balão de Fala do Assistente */}
        <div style={{
          backgroundColor: 'white',
          border: '2px solid var(--color-primary)',
          borderRadius: '16px',
          padding: '0.85rem 1.15rem',
          boxShadow: 'var(--shadow-md)',
          fontSize: '0.85rem',
          fontWeight: 800,
          color: 'var(--color-primary-dark)',
          textAlign: 'center',
          maxWidth: '220px',
          lineHeight: '1.4',
          borderBottomLeftRadius: '4px'
        }}>
          Olá! 👋 Seja bem-vindo ao POKA-YOKE. Faça seu login ao lado!
        </div>

        {/* Vídeo Maior do Boneco sem Fundo (boneco2.mp4) */}
        <div style={{
          width: '220px',
          height: '340px',
          display: 'flex',
          justify: 'center',
          alignItems: 'center'
        }}>
          <video
            src="/boneco2.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15))'
            }}
          />
        </div>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }}>
        
        {/* Logo & Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(10, 27, 159, 0.08)',
            color: 'var(--color-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center',
            marginBottom: '1rem'
          }}>
            <Lock size={32} color="var(--color-primary)" />
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-primary-dark)', margin: 0 }}>
            POKA-YOKE System
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Autenticação & Controle de Acesso — Forvia Faurecia
          </p>
        </div>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}>
            <AlertCircle size={18} color="#EF4444" />
            {errorMessage}
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="input-group">
            <label className="input-label">Matrícula ou E-mail da Fábrica</label>
            <input 
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Ex: ENG-102 ou caio.cabral@faurecia.com"
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Senha de Acesso</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          <button 
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontWeight: 800, fontSize: '1rem', marginTop: '0.5rem' }}
          >
            Entrar no Sistema <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
          </button>
        </form>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Search, Home, AudioLines, Rabbit, Lock, Moon, Sun, Grid, FileText, BarChart2, Box, Users, LogOut, ShieldCheck, Wrench, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { currentUser, logout, isAdmin, isOperador } = useAuth();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('poka_yoke_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('poka_yoke_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('poka_yoke_theme', 'light');
    }
  }, [isDarkMode]);

  let navItems = [
    { path: '/', label: '', icon: Home },
    { path: '/busca', label: 'Busca Global', icon: Search },
    { path: '/jit', label: 'Módulo JIT', icon: AudioLines },
    { path: '/matriz', label: 'Matriz de Versatilidade', icon: Grid },
    { path: '/gerador-documentos', label: 'Gerador PDF Oficial', icon: FileText },
    { path: '/analytics', label: 'Analytics & Pareto', icon: BarChart2 },
    { path: '/visualizador-3d', label: 'Visualizador 3D', icon: Box },
  ];

  if (isOperador) {
    // Sistema de Produção para Operadores: Apenas Módulo JIT, Busca e Treinamentos
    navItems = [
      { path: '/', label: 'Assinaturas & Treinos', icon: Home },
      { path: '/jit', label: 'Módulo JIT (Liberação/Backup/Placas/Treinos)', icon: AudioLines },
      { path: '/busca', label: 'Busca Global', icon: Search },
    ];
  } else if (isAdmin) {
    navItems.push({ path: '/gestao-usuarios', label: 'Gestão Usuários', icon: Users });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header className="header" style={{ borderBottom: '1px solid var(--color-border)', justifyContent: 'space-between' }}>
        {/* Left: Logo */}
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Lock size={22} color="var(--color-primary)" />
          <span className="logo-forvia" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-primary-dark)', letterSpacing: '-0.3px' }}>POKA-YOKE</span>
          <span style={{ color: 'var(--color-border)', fontSize: '1.4rem', fontWeight: 300, margin: '0 0.1rem' }}>|</span>
          <img 
            src="/Faurecia_logo.svg" 
            alt="FORVIA Faurecia" 
            style={{ height: '24px', objectFit: 'contain', verticalAlign: 'middle' }} 
          />
        </div>

        {/* Center: Search Bar */}
        <div style={{ flex: 1, maxWidth: '300px', margin: '0 1rem' }} className="hidden-mobile">
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Busca Global..." 
              style={{ width: '100%', padding: '0.55rem 1rem 0.55rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-main)', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Right: User Badge & Dark Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* User Info Badge */}
          {currentUser && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-bg-main)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              fontSize: '0.8rem'
            }}>
              {currentUser.role === 'admin' && <ShieldCheck size={16} color="var(--color-primary)" />}
              {currentUser.role === 'engenheiro' && <Wrench size={16} color="#10B981" />}
              {currentUser.role === 'operador' && <User size={16} color="#F59E0B" />}

              <div style={{ lineHeight: '1.2' }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-main)' }}>{currentUser.name}</strong>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {currentUser.role} {currentUser.matricula ? `(${currentUser.matricula})` : ''}
                </span>
              </div>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9',
              color: isDarkMode ? '#F8FAFC' : '#1E293B',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}
            title="Alternar Modo Noturno/Industrial"
          >
            {isDarkMode ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="var(--color-primary)" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #FCA5A5',
              backgroundColor: '#FEF2F2',
              color: '#EF4444',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.75rem'
            }}
            title="Trocar Usuário / Sair"
          >
            <LogOut size={15} /> Sair
          </button>

        </div>

      </header>

      {/* Faixa de Aviso no Modo Operador */}
      {isOperador && (
        <div style={{ backgroundColor: '#FFFBEB', borderBottom: '1px solid #FDE68A', padding: '0.4rem 2rem', fontSize: '0.8rem', color: '#B45309', fontWeight: 700, textAlign: 'center' }}>
          👁️ MODO OPERADOR ATIVO: Acesso restrito para consulta e visualização de instruções de trabalho.
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="nav-links" style={{ backgroundColor: 'white', padding: '0.75rem 2rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <item.icon size={18} />
            {item.label && <span className="hidden-mobile">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <main className="main-content animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}

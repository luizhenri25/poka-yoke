import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Usuários Pré-Cadastrados no Sistema (Sincronizados com o Backend Laravel)
export const DEFAULT_USERS = [
  {
    id: 1,
    name: 'Administrador Geral (Forvia)',
    email: 'admin@faurecia.com',
    matricula: 'ADM-001',
    role: 'admin',
    password: 'admin123'
  },
  {
    id: 2,
    name: 'Caio Cabral (Eng. Processos)',
    email: 'caio.cabral@faurecia.com',
    matricula: 'ENG-102',
    role: 'engenheiro',
    password: 'eng123'
  },
  {
    id: 3,
    name: 'Luiz Henrique (Operador BDIA)',
    email: 'luiz.henrique@faurecia.com',
    matricula: 'OP-504',
    role: 'operador',
    password: 'op123'
  }
];

export function AuthProvider({ children }) {
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('poka_yoke_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('poka_yoke_current_user');
    return saved ? JSON.parse(saved) : DEFAULT_USERS[1]; // Padrão: Engenheiro Caio Cabral
  });

  useEffect(() => {
    localStorage.setItem('poka_yoke_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('poka_yoke_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('poka_yoke_current_user');
    }
  }, [currentUser]);

  const login = (identifier, password) => {
    const term = identifier.trim().toLowerCase();
    const user = usersList.find(u => 
      (u.email.toLowerCase() === term || u.matricula.toLowerCase() === term) && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Matrícula/E-mail ou senha incorretos.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: Date.now()
    };
    setUsersList(prev => [...prev, userWithId]);
    return userWithId;
  };

  const removeUser = (id) => {
    setUsersList(prev => prev.filter(u => u.id !== id));
  };

  // Helper de Permissão
  const isAdmin = currentUser?.role === 'admin';
  const isEngenheiro = currentUser?.role === 'engenheiro' || currentUser?.role === 'admin';
  const isOperador = currentUser?.role === 'operador';

  return (
    <AuthContext.Provider value={{
      currentUser,
      usersList,
      login,
      logout,
      addUser,
      removeUser,
      isAdmin,
      isEngenheiro,
      isOperador
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

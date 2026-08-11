import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// PHP Backed Enums Sincronizados com o Backend Laravel (App\Enums\UserRole)
export const UserRole = {
  ADMIN: 'admin',
  ENGENHEIRO: 'engenheiro',
  OPERADOR: 'operador'
};

// PHP Backed Enums Sincronizados com o Backend Laravel (App\Enums\UserPermission)
export const UserPermission = {
  VIEW_INSTRUCTIONS: 'view_instructions',
  SIGN_TRAINING: 'sign_training',
  MANAGE_POKA_YOKES: 'manage_poka_yokes',
  MANAGE_USERS: 'manage_users',
  VIEW_ANALYTICS: 'view_analytics',
  GENERATE_DOCUMENTS: 'generate_documents'
};

// Mapeamento de Permissões por Perfil (Sincronizado com App\Enums\UserRole::permissions())
const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    UserPermission.VIEW_INSTRUCTIONS,
    UserPermission.SIGN_TRAINING,
    UserPermission.MANAGE_POKA_YOKES,
    UserPermission.MANAGE_USERS,
    UserPermission.VIEW_ANALYTICS,
    UserPermission.GENERATE_DOCUMENTS
  ],
  [UserRole.ENGENHEIRO]: [
    UserPermission.VIEW_INSTRUCTIONS,
    UserPermission.SIGN_TRAINING,
    UserPermission.MANAGE_POKA_YOKES,
    UserPermission.VIEW_ANALYTICS,
    UserPermission.GENERATE_DOCUMENTS
  ],
  [UserRole.OPERADOR]: [
    UserPermission.VIEW_INSTRUCTIONS,
    UserPermission.SIGN_TRAINING
  ]
};

// Usuários Pré-Cadastrados no Sistema (Sincronizados com o Backend Laravel DatabaseSeeder)
export const DEFAULT_USERS = [
  {
    id: 1,
    name: 'Administrador Geral (Forvia)',
    email: 'admin@faurecia.com',
    matricula: 'ADM-001',
    role: UserRole.ADMIN,
    password: 'admin123'
  },
  {
    id: 2,
    name: 'Caio Cabral (Eng. Processos)',
    email: 'caio.cabral@faurecia.com',
    matricula: 'ENG-102',
    role: UserRole.ENGENHEIRO,
    password: 'eng123'
  },
  {
    id: 3,
    name: 'Luiz Henrique (Operador BDIA)',
    email: 'luiz.henrique@faurecia.com',
    matricula: 'OP-504',
    role: UserRole.OPERADOR,
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

  // Helper de Permissão Baseado nos Enums Laravel
  const hasPermission = (permission) => {
    if (!currentUser?.role) return false;
    const permissions = ROLE_PERMISSIONS[currentUser.role] || [];
    return permissions.includes(permission);
  };

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isEngenheiro = currentUser?.role === UserRole.ENGENHEIRO || currentUser?.role === UserRole.ADMIN;
  const isOperador = currentUser?.role === UserRole.OPERADOR;

  return (
    <AuthContext.Provider value={{
      currentUser,
      usersList,
      login,
      logout,
      addUser,
      removeUser,
      hasPermission,
      isAdmin,
      isEngenheiro,
      isOperador,
      UserRole,
      UserPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

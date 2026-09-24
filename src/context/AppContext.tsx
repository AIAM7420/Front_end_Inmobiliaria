import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'public' | 'asesor' | 'admin' | null;

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  // Auth
  isAuthenticated: boolean;
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializamos leyendo de localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('inmo_theme');
    return saved === 'dark';
  });

  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('inmo_role');
    return (saved as UserRole) || null;
  });

  const isAuthenticated = role !== null;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('inmo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('inmo_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('inmo_role', role);
    } else {
      localStorage.removeItem('inmo_role');
    }
  }, [role]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  const login = (newRole: UserRole) => setRole(newRole);
  
  const logout = () => setRole(null);

  const contextValue = React.useMemo(() => ({ isDarkMode, toggleTheme, isAuthenticated, role, login, logout }), [isDarkMode, isAuthenticated, role]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

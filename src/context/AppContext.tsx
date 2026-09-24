import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getAccessToken, setAccessToken, setUnauthorizedHandler } from '../integrations/backend/axios.config';
import type { Cuenta } from '../integrations/backend/types';

export type UserRole = 'public' | 'asesor' | 'admin' | null;

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  // Auth
  isAuthenticated: boolean;
  role: UserRole;
  login: (account: Cuenta) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('inmo_theme');
    return saved === 'dark';
  });

  const [role, setRole] = useState<UserRole>(null);

  const isAuthenticated = role !== null && getAccessToken() !== null;

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
    setUnauthorizedHandler(() => { setRole(null); queryClient.clear(); });
    return () => setUnauthorizedHandler(null);
  }, [queryClient]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  const login = (account: Cuenta) => setRole(account.rol === 'ASESOR' ? 'asesor' : account.rol === 'SUPERADMINISTRADOR' ? 'admin' : 'public');
  
  const logout = () => { setAccessToken(null); setRole(null); queryClient.clear(); };

  return (
    <AppContext.Provider value={{ isDarkMode, toggleTheme, isAuthenticated, role, login, logout }}>
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

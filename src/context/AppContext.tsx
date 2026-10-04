import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getAccessToken, setAccessToken, setUnauthorizedHandler } from '../integrations/backend/axios.config';
import type { CriteriosBusqueda } from '../integrations/backend/types';
import type { Cuenta } from '../integrations/backend/types';
import { getPreferences, savePreferences } from '../integrations/backend/operations.service';
import { operationError } from '../integrations/backend/versioning';

export type UserRole = 'public' | 'asesor' | 'admin' | null;

interface AppContextType {
  globalSearchQuery: string;
  setGlobalSearchQuery: (value: string) => void;
  globalFilters: CriteriosBusqueda | null;
  setGlobalFilters: (value: CriteriosBusqueda | null) => void;
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  applyTheme: (theme: 'CLARO' | 'OSCURO' | 'SISTEMA') => void;
  themeError: string | null;
  // Auth
  isAuthenticated: boolean;
  role: UserRole;
  login: (account: Cuenta) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalFilters, setGlobalFilters] = useState<CriteriosBusqueda | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('inmo_theme');
    return saved === 'dark';
  });

  const [role, setRole] = useState<UserRole>(null);
  const [themeError, setThemeError] = useState<string | null>(null);
  const [themePreference, setThemePreference] = useState<'CLARO' | 'OSCURO' | 'SISTEMA' | null>(null);

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

  const applyTheme = (theme: 'CLARO' | 'OSCURO' | 'SISTEMA') => {
    setThemePreference(theme); setThemeError(null);
    setIsDarkMode(theme === 'OSCURO' || theme === 'SISTEMA' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  };
  useEffect(() => {
    if (!isAuthenticated) return;
    let current = true;
    void queryClient.fetchQuery({ queryKey: ['account', 'preferences'], queryFn: getPreferences }).then(value => { if (current) applyTheme(value.tema); }).catch(error => { if (current) setThemeError(operationError(error)); });
    return () => { current = false; };
  }, [isAuthenticated, queryClient]);
  useEffect(() => {
    if (themePreference !== 'SISTEMA') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)'), update = () => setIsDarkMode(media.matches);
    media.addEventListener('change', update); return () => media.removeEventListener('change', update);
  }, [themePreference]);
  const toggleTheme = () => {
    const next = isDarkMode ? 'CLARO' : 'OSCURO';
    if (!isAuthenticated) { applyTheme(next); return; }
    setThemeError(null);
    void queryClient.fetchQuery({ queryKey: ['account', 'preferences'], queryFn: getPreferences }).then(value => savePreferences({ tema: next, alertas_correo: value.alertas_correo }, value.version)).then(value => { queryClient.setQueryData(['account', 'preferences'], value); applyTheme(value.tema); }).catch(error => setThemeError(operationError(error)));
  };

  const login = (account: Cuenta) => setRole(account.rol === 'ASESOR' ? 'asesor' : account.rol === 'SUPERADMINISTRADOR' ? 'admin' : 'public');

  const logout = () => { setAccessToken(null); setRole(null); queryClient.clear(); };

  return (
    <AppContext.Provider value={{ globalSearchQuery, setGlobalSearchQuery, globalFilters, setGlobalFilters, isDarkMode, toggleTheme, applyTheme, themeError, isAuthenticated, role, login, logout }}>
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

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';
import { ToastProvider } from './context/ToastContext';
import { AppProvider } from './context/AppContext';
import { queryClient } from './integrations/backend/queryClient';
import { ApplicationUpdateNotice } from './components/organisms/ApplicationUpdateNotice';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ToastProvider><App /><ApplicationUpdateNotice /></ToastProvider>
      </AppProvider>
    </QueryClientProvider>
  </StrictMode>
);

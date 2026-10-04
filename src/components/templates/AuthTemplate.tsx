import { useSearchParams } from 'react-router-dom';
import React, { useState } from 'react';
import type { AuthView } from './auth/LoginView';
import { LoginView } from './auth/LoginView';
import { AccountTypeView } from './auth/AccountTypeView';
import { RegisterView } from './auth/RegisterView';
import { RecoveryView } from './auth/RecoveryView';
import type { Cuenta } from '../../integrations/backend/types';
import { localPilotNoEmail } from '../../integrations/backend/localPilot';

interface AuthTemplateProps {
  onLogin?: (account: Cuenta) => void;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({ onLogin }) => {
  const [params] = useSearchParams();
  const [currentView, setCurrentView] = useState<AuthView>(params.get('view') === 'recovery' ? 'recovery' : 'login');
  const [accountType, setAccountType] = useState<'prospecto' | 'asesor'>('prospecto');

  const handleLogin = (account: Cuenta) => {
    if (onLogin) onLogin(account);
  };

  const handleNavigate = (view: AuthView) => {
    setCurrentView(view);
  };

  const handleSelectAccountType = (type: 'prospecto' | 'asesor') => {
    setAccountType(type);
  };

  return (
    <>
      {currentView === 'login' && (
        <LoginView onLogin={handleLogin} onNavigate={handleNavigate} />
      )}

      {currentView === 'account-type' && (
        <AccountTypeView
          onNavigate={handleNavigate}
          onSelectAccountType={handleSelectAccountType}
        />
      )}

      {currentView === 'register' && (
        <RegisterView
          accountType={accountType}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'recovery' && !localPilotNoEmail && (
        <RecoveryView onNavigate={handleNavigate} />
      )}

    </>
  );
};

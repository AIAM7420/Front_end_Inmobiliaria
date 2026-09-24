import React from 'react';
import { AuthHeader } from '../../molecules/AuthHeader';
import { LoginForm } from '../../organisms/LoginForm';
import type { Cuenta } from '../../../integrations/backend/types';
export type AuthView = 'login' | 'account-type' | 'register' | 'recovery' | 'otp' | 'new-password' | 'advisor-profile' | 'advisor-pending' | 'payment-gateway';

interface LoginViewProps {
  onLogin: (account: Cuenta) => void;
  onNavigate: (view: AuthView) => void;
}

export const LoginView: React.FC<LoginViewProps> = React.memo(({ onLogin, onNavigate }) => {

  return (
    <div className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 justify-start pt-12 md:pt-20">
      <AuthHeader title=" ">
        <div className="relative w-full flex justify-center h-64 mt-4">
          <img src="/inmo.png" alt="INMO" className="h-64 w-auto object-contain dark:hidden" fetchPriority="high" loading="eager" decoding="sync" />
          <img src="/inmo white.png" alt="INMO" className="h-64 w-auto object-contain hidden dark:block" fetchPriority="high" loading="eager" decoding="sync" />
        </div>
      </AuthHeader>

      <LoginForm onLogin={onLogin} onNavigate={onNavigate} />
    </div>
  );
});

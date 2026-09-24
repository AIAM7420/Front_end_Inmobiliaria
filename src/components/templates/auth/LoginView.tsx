import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from 'lucide-react';
import { AuthHeader } from '../../molecules/AuthHeader';
import { LoginForm } from '../../organisms/LoginForm';
import { IconButton } from '../../atoms/IconButton';

export type AuthView = 'login' | 'account-type' | 'register' | 'recovery' | 'otp' | 'new-password' | 'advisor-profile' | 'advisor-pending' | 'payment-gateway';

interface LoginViewProps {
  onLogin: (role?: 'public' | 'asesor' | 'admin') => void;
  onNavigate: (view: AuthView) => void;
}

export const LoginView: React.FC<LoginViewProps> = React.memo(({ onLogin, onNavigate }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 justify-start pt-12 md:pt-20 relative">
      <div className="absolute top-4 right-4 z-50">
        <IconButton 
          variant="secondary" 
          size="md" 
          icon={<Book className="w-5 h-5" />} 
          title="Ver Catálogo de Componentes (UI Kit)"
          onClick={() => navigate('/ui-kit')}
          className="shadow-soft"
        />
      </div>

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

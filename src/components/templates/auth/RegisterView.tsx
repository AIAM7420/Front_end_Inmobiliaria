import React from 'react';
import { User, Mail, Phone, KeyRound, DoorOpen } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Badge } from '../../atoms/Badge';
import { AuthHeader } from '../../molecules/AuthHeader';
import type { AuthView } from './LoginView';

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

interface RegisterViewProps {
  accountType: 'prospecto' | 'asesor';
  onLogin: () => void;
  onNavigate: (view: AuthView) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  accountType,
  onLogin,
  onNavigate,
}) => {
  return (
    <div className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 justify-center py-10">
      {/* Header */}
      <AuthHeader 
        title="Únete a nosotros" 
        subtitle="Crea tu cuenta en segundos"
      >
        {accountType === 'prospecto' ? (
          <Badge variant="secondary" text="Prospecto" />
        ) : (
          <Badge variant="primary" text="Asesor Inmobiliario" />
        )}
      </AuthHeader>

      {/* Registration Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (accountType === 'prospecto') {
            onLogin();
          } else {
            onNavigate('advisor-profile');
          }
        }}
        className="w-full max-w-sm flex flex-col gap-5 animate-in fade-in"
      >
        <Input
          placeholder="Nombre completo"
          leftIcon={<User className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
        />
        <Input
          placeholder="Correo electrónico"
          leftIcon={<Mail className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
        />
        <Input
          placeholder="Teléfono"
          leftIcon={<Phone className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="password"
            placeholder="Contraseña"
            leftIcon={<KeyRound className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
          />
          <Input
            type="password"
            placeholder="Confirmar"
            leftIcon={<KeyRound className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
          />
        </div>

        <Button
          type="submit"
          variant="accent"
          className="w-full h-14 mt-2"
          icon={<DoorOpen className="w-5 h-5" strokeWidth={2} />}
        >
          Comenzar
        </Button>

        <div className="relative flex items-center py-2 w-full">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 dark:text-gray-400 text-sm font-inter">O registrarse con</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        <Button 
          type="button" 
          variant="secondary" 
          className="w-full h-14" 
          icon={<GoogleIcon className="w-6 h-6" />}
          onClick={() => console.log('Mock: Registrarse con Google')}
        >
          Registrarse con Google
        </Button>

        <div className="mt-2 flex justify-center">
          <Button
            type="button"
            variant="text"
            onClick={() => onNavigate('login')}
            className="text-sm font-bold"
          >
            Volver al login
          </Button>
        </div>
      </form>
    </div>
  );
};

import React from 'react';
import { User, Mail, Phone, KeyRound, DoorOpen } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Badge } from '../../atoms/Badge';
import { AuthHeader } from '../../molecules/AuthHeader';
import type { AuthView } from './LoginView';

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

        <div className="mt-4 flex justify-center">
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

import React from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { AuthHeader } from '../../molecules/AuthHeader';
import type { AuthView } from './LoginView';

interface RecoveryViewProps {
  onNavigate: (view: AuthView) => void;
}

export const RecoveryView: React.FC<RecoveryViewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 justify-center py-10">
      <AuthHeader 
        title="¡Ups!, permítenos ayudarte" 
        subtitle="Ingresa tu correo electrónico, enviaremos un código de verificación para poder ayudarte a recuperar tu cuenta." 
      />
      <form
        onSubmit={(e) => { e.preventDefault(); onNavigate('otp'); }}
        className="w-full max-w-sm flex flex-col gap-6 animate-in fade-in -mt-2"
      >
        <Input
          placeholder="Correo electrónico"
          leftIcon={<Mail className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
        />
        <Button
          type="submit"
          variant="accent"
          className="w-full h-14 mt-2"
          icon={<Send className="w-5 h-5" strokeWidth={2} />}
        >
          Enviar Correo
        </Button>
      </form>
    </div>
  );
};

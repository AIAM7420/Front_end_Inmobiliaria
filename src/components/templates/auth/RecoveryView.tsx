import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { AuthHeader } from '../../molecules/AuthHeader';
import type { AuthView } from './LoginView';
import { useRequestPasswordRecovery } from '../../../integrations/backend/hooks/useAuth';

interface RecoveryViewProps {
  onNavigate: (view: AuthView) => void;
}

export const RecoveryView: React.FC<RecoveryViewProps> = ({ onNavigate }) => {
  const [correo, setCorreo] = useState('');
  const recovery = useRequestPasswordRecovery();
  return (
    <div className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 justify-center py-10">
      <AuthHeader 
        title="¡Ups!, permítenos ayudarte" 
        subtitle="Ingresa tu correo electrónico para solicitar un enlace de recuperación."
      />
      <form
        onSubmit={(event) => { event.preventDefault(); recovery.mutate(correo.trim()); }}
        className="w-full max-w-sm flex flex-col gap-6 animate-in fade-in -mt-2"
      >
        <Input
          required
          type="email"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
          placeholder="Correo electrónico"
          leftIcon={<Mail className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
        />
        <Button
          type="submit"
          variant="accent"
          className="w-full h-14 mt-2"
          isLoading={recovery.isPending}
          icon={<Send className="w-5 h-5" strokeWidth={2} />}
        >
          Enviar Correo
        </Button>
        {recovery.isSuccess && <p role="status" className="font-inter text-sm text-gray-600 dark:text-gray-300">Si el correo está registrado, recibirás instrucciones de recuperación.</p>}
        {recovery.isError && <p role="alert" className="font-inter text-sm text-inmo-danger">No pudimos enviar la solicitud. Inténtalo de nuevo.</p>}
        <Button type="button" variant="text" onClick={() => onNavigate('login')}>Volver al login</Button>
      </form>
    </div>
  );
};

import React from 'react';
import { Button } from '../../atoms/Button';
import { AuthHeader } from '../../molecules/AuthHeader';
import { OtpInput } from '../../molecules/OtpInput';
import type { AuthView } from './LoginView';

interface OtpViewProps {
  onNavigate: (view: AuthView) => void;
}

export const OtpView: React.FC<OtpViewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 justify-center py-10">
      <AuthHeader 
        title="¡Revisa tu mail!" 
        subtitle="Por seguridad, necesitamos verificar tu correo electrónico, busca el código de verificación de 6 dígitos e ingrésalo a continuación." 
      />
      <form
        onSubmit={(e) => { e.preventDefault(); onNavigate('new-password'); }}
        className="w-full max-w-sm flex flex-col gap-6 animate-in fade-in -mt-2"
      >
        <OtpInput length={6} />
        
        <div className="flex justify-start">
          <Button type="button" variant="text" className="text-sm font-medium">
            Volver a enviar código
          </Button>
        </div>

        <Button type="submit" variant="accent" className="w-full h-14 mt-2">
          Verificar
        </Button>
        <p className="text-body text-center text-[10px] px-4 mt-2">
          Antes de reenviar el código, no olvides revisar tu bandeja de spam o correo no deseado.
        </p>
      </form>
    </div>
  );
};

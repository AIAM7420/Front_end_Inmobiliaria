import React from 'react';
import { Hourglass } from 'lucide-react';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { AuthHeader } from '../../molecules/AuthHeader';
import type { AuthView } from './LoginView';

interface AdvisorPendingViewProps {
  onNavigate: (view: AuthView) => void;
}

export const AdvisorPendingView: React.FC<AdvisorPendingViewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center justify-center px-6 transition-colors overflow-y-auto pb-12 py-10">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 animate-in fade-in">
        {/* Animated Hourglass Icon */}
        <Hourglass className="w-20 h-20 text-inmo-warning animate-pulse" strokeWidth={1.5} />

        <AuthHeader 
          title="Tu cuenta está en revisión" 
          subtitle="Nuestro equipo está validando tus datos profesionales y documentos. Te notificaremos por correo electrónico cuando tu cuenta esté lista." 
          className="mb-0"
        />

        {/* Badge */}
        <Badge variant="warning" text="Pendiente de Aprobación" />

        {/* Volver al Inicio */}
        <div className="mt-4">
          <Button
            type="button"
            variant="text"
            onClick={() => onNavigate('login')}
            className="text-sm font-bold"
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Home, Briefcase } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { AccountTypeCard } from '../../molecules/AccountTypeCard';
import { AuthHeader } from '../../molecules/AuthHeader';
import type { AuthView } from './LoginView';

interface AccountTypeViewProps {
  onNavigate: (view: AuthView) => void;
  onSelectAccountType: (type: 'prospecto' | 'asesor') => void;
}

export const AccountTypeView: React.FC<AccountTypeViewProps> = ({
  onNavigate,
  onSelectAccountType,
}) => {
  const [selectedType, setSelectedType] = useState<'prospecto' | 'asesor' | null>(null);

  return (
    <div className="bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 justify-center py-10">
      {/* Header */}
      <AuthHeader 
        title="¿Cómo deseas registrarte?" 
        subtitle="Selecciona el tipo de cuenta que mejor se adapte a ti." 
      />

      {/* Account Type Cards */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-sm animate-in fade-in">
        <AccountTypeCard
          icon={<Home className="w-8 h-8" strokeWidth={1.5} />}
          title="Prospecto"
          description="Busco comprar o rentar una propiedad"
          isSelected={selectedType === 'prospecto'}
          onClick={() => setSelectedType('prospecto')}
        />
        <AccountTypeCard
          icon={<Briefcase className="w-8 h-8" strokeWidth={1.5} />}
          title="Asesor Inmobiliario"
          description="Soy profesional y quiero publicar propiedades"
          isSelected={selectedType === 'asesor'}
          onClick={() => setSelectedType('asesor')}
        />
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-sm mt-6">
        <Button
          variant="accent"
          className="w-full h-14"
          disabled={selectedType === null}
          onClick={() => {
            onSelectAccountType(selectedType!);
            onNavigate('register');
          }}
        >
          Continuar
        </Button>
      </div>

      {/* Footer Link */}
      <div className="mt-6">
        <Button
          type="button"
          variant="text"
          onClick={() => onNavigate('login')}
          className="text-sm font-bold"
        >
          Volver al login
        </Button>
      </div>
    </div>
  );
};

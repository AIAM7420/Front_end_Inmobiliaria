import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { Home, Compass, Construction, ShieldAlert } from 'lucide-react';

interface PlaceholderTemplateProps {
  type?: '404' | 'coming-soon' | 'under-construction';
  title?: string;
  description?: string;
  showHomeButton?: boolean;
}

export const PlaceholderTemplate: React.FC<PlaceholderTemplateProps> = ({
  type = 'coming-soon',
  title,
  description,
  showHomeButton = true
}) => {
  const navigate = useNavigate();

  const config = {
    '404': {
      icon: <Compass className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" strokeWidth={1.5} />,
      defaultTitle: 'Página no encontrada',
      defaultDescription: 'Parece que te has perdido. La página que buscas no existe o ha sido movida.',
    },
    'coming-soon': {
      icon: <Construction className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" strokeWidth={1.5} />,
      defaultTitle: 'Próximamente',
      defaultDescription: 'Estamos construyendo esta sección para ofrecerte las mejores herramientas. ¡Vuelve pronto!',
    },
    'under-construction': {
      icon: <ShieldAlert className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" strokeWidth={1.5} />,
      defaultTitle: 'En Mantenimiento',
      defaultDescription: 'Estamos realizando mejoras en esta sección.',
    }
  };

  const currentConfig = config[type];

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full h-full min-h-[60vh] p-6 text-center animate-in fade-in duration-500">
      <div className="flex flex-col items-center justify-center max-w-sm w-full opacity-70">
        
        {currentConfig.icon}
        
        <h1 className="text-xl md:text-2xl font-montserrat font-bold text-gray-500 dark:text-gray-400 mb-3">
          {title || currentConfig.defaultTitle}
        </h1>
        
        <p className="text-gray-400 dark:text-gray-500 font-inter text-sm md:text-base leading-relaxed mb-6">
          {description || currentConfig.defaultDescription}
        </p>

        {showHomeButton && (
          <Button 
            onClick={() => navigate('/')} 
            variant="secondary" 
            icon={<Home className="w-4 h-4" />}
            className="rounded-full shadow-sm"
          >
            Volver al Inicio
          </Button>
        )}
      </div>
    </div>
  );
};

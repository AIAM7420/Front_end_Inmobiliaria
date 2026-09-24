import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Home, Heart, Bot, Globe, 
  Mail, Search, Check, Shield, Wifi, Dumbbell
} from 'lucide-react';

import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { IconButton } from '../atoms/IconButton';
import { Badge } from '../atoms/Badge';
import { NumberField } from '../atoms/NumberField';
import { AmenitySelector } from '../atoms/AmenitySelector';
import { Tag } from '../atoms/Tag';

import { SemanticToast } from '../molecules/SemanticToast';
import { PropertyCardSkeleton } from '../molecules/PropertyCardSkeleton';
import { SearchBar } from '../molecules/SearchBar';
import { ChatMessage } from '../molecules/ChatMessage';
import { ConnectedPropertyCard } from '../organisms/ConnectedPropertyCard';
import { useGetProperties } from '../../integrations/backend/hooks/useProperties';

export interface UIKitTemplateProps {
  onNavigate?: (route: string) => void;
}

export const UIKitTemplate: React.FC<UIKitTemplateProps> = ({ onNavigate }) => {
  const [isDark, setIsDark] = useState(false);

  // Estados interactivos globales para el UI Kit
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalDisabled, setGlobalDisabled] = useState(false);
  const [globalError, setGlobalError] = useState(false);

  // Estados locales para componentes interactivos
  const [numValue, setNumValue] = useState(1);
  const [amenitySelected, setAmenitySelected] = useState(false);
  const [tagSelected, setTagSelected] = useState(false);
  const catalogPreview = useGetProperties({ limit: 1 });

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-16">
      <h2 className="text-2xl font-montserrat font-black text-inmo-secondary dark:text-white mb-8 border-b-2 border-white/20 dark:border-white/10 pb-4">
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div className="bg-gray-400 dark:bg-inmo-darkbg min-h-screen w-full p-6 md:p-10 flex flex-col overflow-x-hidden transition-colors duration-500 font-inter">
      
      {/* Header */}
      <div className="flex-none flex justify-between items-center mb-8 max-w-[1500px] w-full mx-auto">
        <div className="flex items-center gap-4">
          <IconButton 
            variant="ghost" 
            size="sm" 
            className="text-white dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10" 
            icon={<Home className="w-6 h-6" />}
            onClick={() => onNavigate && onNavigate('landing')}
          />
          <h1 className="text-title text-white dark:text-gray-300 drop-shadow-md">
            INMO UI Kit
          </h1>
        </div>
        <Button 
          onClick={toggleTheme} 
          variant="secondary"
          className="group flex items-center gap-3 !bg-white dark:!bg-inmo-darkcard !text-inmo-secondary dark:!text-white !px-6 !py-2 !rounded-atom !shadow-soft hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer !w-auto !h-auto"
        >
          {isDark ? <Moon className="w-5 h-5 text-yellow-400" /> : <Sun className="w-5 h-5 text-orange-500" />}
          <span className="font-montserrat font-bold text-sm">Tema</span>
        </Button>
      </div>

      <div className="max-w-[1500px] w-full mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* PANEL DE CONTROL INTERACTIVO */}
        <div className="xl:col-span-1">
          <div className="sticky top-8 bg-white/80 dark:bg-inmo-darkcard/80 backdrop-blur-md p-6 rounded-card shadow-soft border border-white/40 dark:border-white/10">
            <h3 className="font-montserrat font-black text-xl mb-6 text-inmo-secondary dark:text-white">Panel de Control</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="font-inter font-medium text-inmo-secondary dark:text-gray-300 group-hover:text-inmo-accent transition-colors">Modo Loading</span>
                <Input 
                  type="checkbox" 
                  checked={globalLoading} 
                  onChange={(e) => setGlobalLoading(e.target.checked)}
                  wrapperClassName="!h-auto !p-0 !border-none !bg-transparent"
                  className="w-5 h-5 accent-inmo-accent rounded cursor-pointer"
                />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="font-inter font-medium text-inmo-secondary dark:text-gray-300 group-hover:text-inmo-accent transition-colors">Modo Disabled</span>
                <Input 
                  type="checkbox" 
                  checked={globalDisabled} 
                  onChange={(e) => setGlobalDisabled(e.target.checked)}
                  wrapperClassName="!h-auto !p-0 !border-none !bg-transparent"
                  className="w-5 h-5 accent-inmo-accent rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="font-inter font-medium text-inmo-secondary dark:text-gray-300 group-hover:text-inmo-accent transition-colors">Forzar Error</span>
                <Input 
                  type="checkbox" 
                  checked={globalError} 
                  onChange={(e) => setGlobalError(e.target.checked)}
                  wrapperClassName="!h-auto !p-0 !border-none !bg-transparent"
                  className="w-5 h-5 accent-inmo-danger rounded cursor-pointer"
                />
              </label>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-inmo-darkbg">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">
                Usa estos controles para forzar globalmente los estados de todos los componentes compatibles en el UI Kit.
              </p>
            </div>
          </div>
        </div>

        {/* CATÁLOGO DE COMPONENTES */}
        <div className="xl:col-span-3">
          
          <Section title="Design Tokens (Paleta)">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-inmo-accent rounded-[20px] shadow-soft p-6 aspect-square flex flex-col justify-end">
                <span className="text-white font-inter font-bold text-lg">Accent</span>
                <span className="text-white/70 text-xs font-mono mt-1">#FA003F</span>
              </div>
              <div className="bg-inmo-primary dark:bg-inmo-darkcard rounded-[20px] shadow-soft p-6 aspect-square flex flex-col justify-end">
                <span className="text-inmo-secondary dark:text-white font-inter font-bold text-lg">Primary</span>
                <span className="text-gray-400 text-xs font-mono mt-1">#FFFFFF / #333333</span>
              </div>
              <div className="bg-inmo-secondary dark:bg-white rounded-[20px] shadow-soft p-6 aspect-square flex flex-col justify-end">
                <span className="text-white dark:text-inmo-secondary font-inter font-bold text-lg">Secondary</span>
                <span className="text-gray-400 text-xs font-mono mt-1">#333333 / #FFFFFF</span>
              </div>
              <div className="bg-inmo-tertiary dark:bg-inmo-darktertiary rounded-[20px] shadow-soft p-6 aspect-square flex flex-col justify-end">
                <span className="text-inmo-secondary dark:text-white font-inter font-bold text-lg">Tertiary</span>
                <span className="text-gray-500 text-xs font-mono mt-1">#E6E6E6 / #474747</span>
              </div>
            </div>
          </Section>

          <Section title="Átomos: Botones (Button)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Accent</h4>
                <Button variant="accent" className="w-full !h-[70px]" isLoading={globalLoading} disabled={globalDisabled} icon={<Globe className="w-6 h-6 text-white" />}>Explorar</Button>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Secondary</h4>
                <Button variant="secondary" className="w-full !h-[70px]" isLoading={globalLoading} disabled={globalDisabled} icon={<Search className="w-6 h-6" />}>Buscar</Button>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tertiary</h4>
                <Button variant="tertiary" className="w-full !h-[70px]" isLoading={globalLoading} disabled={globalDisabled} icon={<Check className="w-6 h-6" />}>Aceptar</Button>
              </div>
            </div>
          </Section>

          <Section title="Átomos: Icon Buttons (IconButton)">
            <div className="flex flex-wrap gap-6 items-end">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">lg</h4>
                <IconButton variant="accent" size="lg" isLoading={globalLoading} disabled={globalDisabled} icon={<Globe className="w-8 h-8 text-white" />} />
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">md</h4>
                <IconButton variant="secondary" size="md" isLoading={globalLoading} disabled={globalDisabled} icon={<Home className="w-5 h-5" />} />
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">sm</h4>
                <IconButton variant="tertiary" size="sm" isLoading={globalLoading} disabled={globalDisabled} icon={<Heart className="w-4 h-4" />} />
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Ghost</h4>
                <IconButton variant="ghost" size="lg" isLoading={globalLoading} disabled={globalDisabled} icon={<Bot className="w-10 h-10 text-inmo-secondary dark:text-white" />} />
              </div>
            </div>
          </Section>

          <Section title="Átomos: Formularios y Entradas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Input Text</h4>
                <Input 
                  placeholder="Tu correo electrónico" 
                  leftIcon={<Mail className={`w-6 h-6 ${globalError ? 'text-inmo-danger' : 'text-gray-400'}`} />}
                  error={globalError ? "Formato de correo inválido" : undefined}
                  disabled={globalDisabled}
                />
              </div>
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Number Field</h4>
                <div className="bg-white dark:bg-inmo-darkcard p-4 rounded-card shadow-soft">
                  <NumberField 
                    label="Habitaciones" 
                    value={numValue} 
                    onChange={setNumValue}
                    min={1} 
                    max={10} 
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Átomos: Badges, Tags & Amenities">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Badges</h4>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="venta">Venta</Badge>
                  <Badge variant="renta">Renta</Badge>
                  <Badge variant="nuevo">Nuevo</Badge>
                  <Badge variant="success">Destacado</Badge>
                  <Badge variant="warning">Urgente</Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tags Interactivos</h4>
                <div className="flex flex-wrap gap-4">
                  <Tag label="Casa" variant="solid" selected={tagSelected} onClick={() => setTagSelected(!tagSelected)} />
                  <Tag label="Departamento" variant="outline" />
                  <Tag label="Terreno" variant="solid" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amenity Selectors</h4>
                <div className="flex flex-wrap gap-4">
                  <AmenitySelector icon={Wifi} label="Wi-Fi" selected={amenitySelected} onClick={() => setAmenitySelected(!amenitySelected)} />
                  <AmenitySelector icon={Dumbbell} label="Gimnasio" />
                  <AmenitySelector icon={Shield} label="Seguridad" selected={true} />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Moléculas: Search Bar">
            <div className="space-y-8 max-w-2xl bg-gray-200 dark:bg-inmo-darkbg p-6 rounded-card relative z-0">
              <div className="space-y-4 relative z-10">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Search Bar (Fat)</h4>
                <SearchBar placeholder="Buscar propiedades..." size="fat" />
              </div>
              <div className="space-y-4 relative z-10">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Search Bar (Slim)</h4>
                <SearchBar placeholder="Búsqueda rápida..." size="slim" />
              </div>
            </div>
          </Section>

          <Section title="Moléculas: Property Cards & Skeletons">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property Card</h4>
                {catalogPreview.isLoading ? <PropertyCardSkeleton />
                  : catalogPreview.isError ? <p role="alert" className="font-inter text-sm text-gray-600">No se pudo cargar la vista previa.</p>
                  : catalogPreview.data?.items[0] ? <ConnectedPropertyCard property={catalogPreview.data.items[0]} />
                  : <p className="font-inter text-sm text-gray-600">No hay propiedades disponibles para la vista previa.</p>}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property Card Skeleton</h4>
                <PropertyCardSkeleton layout="list" />
              </div>
            </div>
          </Section>

          <Section title="Moléculas: Feedback (Toasts & Chat)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semantic Toasts</h4>
                <SemanticToast type="success" title="Operación exitosa" message="La propiedad ha sido publicada." />
                <SemanticToast type="danger" title="Error de validación" message="Revisa los campos obligatorios." />
                <SemanticToast type="warning" title="Conexión inestable" message="Intentando reconectar al servidor..." />
                <SemanticToast type="info" title="Cuenta en revisión" message="Tus documentos están siendo validados." />
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chat Messages</h4>
                <div className="bg-white dark:bg-inmo-darkcard p-6 rounded-[30px] shadow-soft space-y-4">
                  <ChatMessage isBot={true} message="¡Hola! Soy tu asistente inmobiliario. ¿En qué te ayudo hoy?" />
                  <ChatMessage isBot={false} message="Busco un departamento de 2 habitaciones en la Condesa." />
                </div>
              </div>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
};

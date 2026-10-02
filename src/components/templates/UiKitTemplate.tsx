import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Moon, Sun, Home, Heart, Bot, Globe, 
  Mail, Search, Check, Shield, Wifi, Dumbbell, Smartphone, Monitor, Palette, Component, Layers, Box, LayoutTemplate
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
import { PropertyCard } from '../molecules/PropertyCard';
import { useToast } from '../../context/ToastContext';

export interface UIKitTemplateProps {
  onNavigate?: (route: string) => void;
}

const TABS = [
  { id: 'design-system', label: 'Sistema de Diseño', icon: Palette },
  { id: 'atoms', label: 'Átomos', icon: Component },
  { id: 'molecules', label: 'Moléculas', icon: Box },
  { id: 'organisms', label: 'Organismos', icon: Layers },
];

export const UIKitTemplate: React.FC<UIKitTemplateProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('design-system');
  const [isMobileSimulated, setIsMobileSimulated] = useState(false);
  const { addToast } = useToast();

  // Estados interactivos globales para el UI Kit
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalDisabled, setGlobalDisabled] = useState(false);
  const [globalError, setGlobalError] = useState(false);

  // Estados locales para componentes interactivos
  const [numValue, setNumValue] = useState(1);
  const [amenitySelected, setAmenitySelected] = useState(false);
  const [tagSelected, setTagSelected] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-16">
      <h2 className="text-2xl font-montserrat font-black text-inmo-secondary dark:text-white mb-8 border-b-2 border-gray-200 dark:border-white/10 pb-4">
        {title}
      </h2>
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );

  const renderDesignSystem = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Section title="Design Tokens (Paleta de Colores)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-inmo-accent rounded-atom shadow-soft p-6 aspect-square flex flex-col justify-end">
            <span className="text-white font-inter font-bold text-lg">Accent</span>
            <span className="text-white/70 text-xs font-mono mt-1">#FA003F</span>
          </div>
          <div className="bg-inmo-primary dark:bg-inmo-darkcard rounded-atom shadow-soft p-6 aspect-square flex flex-col justify-end border border-gray-200 dark:border-none">
            <span className="text-inmo-secondary dark:text-white font-inter font-bold text-lg">Primary</span>
            <span className="text-gray-400 text-xs font-mono mt-1">#FFFFFF / #333333</span>
          </div>
          <div className="bg-inmo-secondary dark:bg-white rounded-atom shadow-soft p-6 aspect-square flex flex-col justify-end">
            <span className="text-white dark:text-inmo-secondary font-inter font-bold text-lg">Secondary</span>
            <span className="text-gray-400 text-xs font-mono mt-1">#333333 / #FFFFFF</span>
          </div>
          <div className="bg-inmo-tertiary dark:bg-inmo-darktertiary rounded-atom shadow-soft p-6 aspect-square flex flex-col justify-end border border-gray-200 dark:border-none">
            <span className="text-inmo-secondary dark:text-white font-inter font-bold text-lg">Tertiary</span>
            <span className="text-gray-500 text-xs font-mono mt-1">#E6E6E6 / #474747</span>
          </div>
          
          {/* Status Colors */}
          <div className="bg-inmo-success rounded-atom shadow-soft p-6 aspect-square flex flex-col justify-end">
            <span className="text-white font-inter font-bold text-lg">Success</span>
            <span className="text-white/70 text-xs font-mono mt-1">#10B981</span>
          </div>
          <div className="bg-inmo-warning rounded-atom shadow-soft p-6 aspect-square flex flex-col justify-end">
            <span className="text-white font-inter font-bold text-lg">Warning</span>
            <span className="text-white/70 text-xs font-mono mt-1">#F59E0B</span>
          </div>
          <div className="bg-inmo-info rounded-atom shadow-soft p-6 aspect-square flex flex-col justify-end">
            <span className="text-white font-inter font-bold text-lg">Info</span>
            <span className="text-white/70 text-xs font-mono mt-1">#3B82F6</span>
          </div>
          <div className="bg-inmo-danger rounded-atom shadow-soft p-6 aspect-square flex flex-col justify-end">
            <span className="text-white font-inter font-bold text-lg">Danger</span>
            <span className="text-white/70 text-xs font-mono mt-1">#EF4444</span>
          </div>
        </div>
      </Section>

      <Section title="Tipografía Global">
        <div className="space-y-8 bg-white dark:bg-inmo-darkcard p-8 rounded-card shadow-soft border border-gray-100 dark:border-inmo-darktertiary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-inmo-darktertiary pb-2">Montserrat (Títulos)</h3>
               <div className="text-hero">.text-hero (3xl, Black)</div>
               <div className="text-title">.text-title (3xl, Bold)</div>
               <div className="text-subtitle">.text-subtitle (xl, Bold)</div>
               <div className="text-banner-title">.text-banner-title (2xl)</div>
            </div>
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-inmo-darktertiary pb-2">Inter (Cuerpos)</h3>
               <div className="text-body">.text-body (sm, Normal, Gray)</div>
               <div className="text-input">.text-input (base, Normal)</div>
               <div className="text-price">.text-price (2xl, Black)</div>
               <div className="text-nav">.text-nav (sm, Medium)</div>
               <div className="text-caption">.text-caption (xs, Normal)</div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  const renderAtoms = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Section title="Botones (Button)">
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

      <Section title="Icon Buttons (IconButton)">
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

      <Section title="Formularios y Entradas">
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
            <div className="bg-white dark:bg-inmo-darkcard p-4 rounded-card shadow-soft border border-gray-100 dark:border-inmo-darktertiary">
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

      <Section title="Badges, Tags & Amenities">
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
    </div>
  );

  const renderMolecules = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Section title="Buscadores (Search Bar)">
        <div className="space-y-8 max-w-2xl bg-gray-100 dark:bg-inmo-darkbg p-6 rounded-card relative z-0 border border-gray-200 dark:border-inmo-darktertiary">
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

      <Section title="Tarjetas de Propiedad">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property Card</h4>
            <PropertyCard 
              image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
              title="Residencia de Lujo"
              location="Polanco, CDMX"
              price={12500000}
              beds={4}
              baths={3}
              sqft={350}
              tags={[{ text: 'Venta', variant: 'venta' }, { text: 'Nuevo', variant: 'nuevo' }]}
              isFavorite={isFavorite}
              onToggleFavorite={() => setIsFavorite(!isFavorite)}
            />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property Card Skeleton</h4>
            <PropertyCardSkeleton layout="list" />
          </div>
        </div>
      </Section>

      <Section title="Feedback (Toasts & Chat)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semantic Toasts</h4>
              <div className="flex gap-2">
                <Button 
                  variant="tertiary" 
                  size="sm" 
                  onClick={() => addToast('success', 'Toast Automático', 'Se cerrará solo en 4 seg.')}
                >
                  Auto
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => addToast('info', 'Toast Manual', 'Este requiere que lo cierres.', false)}
                >
                  Manual
                </Button>
              </div>
            </div>
            <div className="space-y-2 relative h-[500px]">
              <div className="relative transform-none max-w-full"><SemanticToast type="success" title="Operación exitosa" message="La propiedad ha sido publicada." /></div>
              <div className="relative transform-none max-w-full"><SemanticToast type="danger" title="Error de validación" message="Revisa los campos obligatorios." /></div>
              <div className="relative transform-none max-w-full"><SemanticToast type="warning" title="Conexión inestable" message="Intentando reconectar al servidor..." /></div>
              <div className="relative transform-none max-w-full"><SemanticToast type="info" title="Cuenta en revisión" message="Tus documentos están siendo validados." /></div>
              <div className="relative transform-none max-w-full"><SemanticToast type="hide" title="Publicación pausada" message="La propiedad ya no será visible en las búsquedas." /></div>
              <div className="relative transform-none max-w-full"><SemanticToast type="show" title="Publicación activada" message="La propiedad vuelve a estar visible para los usuarios." /></div>
              <div className="relative transform-none max-w-full"><SemanticToast type="delete" title="Propiedad eliminada" message="La propiedad ha sido eliminada de tu inventario." /></div>
              <div className="relative transform-none max-w-full"><SemanticToast type="create" title="Propiedad publicada" message="Tu nueva propiedad ya está disponible en el catálogo." /></div>
              <div className="relative transform-none max-w-full"><SemanticToast type="update" title="Cambios guardados" message="La información de la propiedad ha sido actualizada con éxito." /></div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chat Messages</h4>
            <div className="bg-white dark:bg-inmo-darkcard p-6 rounded-card shadow-soft space-y-4 border border-gray-100 dark:border-inmo-darktertiary">
              <ChatMessage isBot={true} message="¡Hola! Soy tu asistente inmobiliario. ¿En qué te ayudo hoy?" />
              <ChatMessage isBot={false} message="Busco un departamento de 2 habitaciones en la Condesa." />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  const renderOrganisms = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Section title="Próximamente">
        <div className="bg-white dark:bg-inmo-darkcard p-12 rounded-card shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col items-center justify-center text-center">
          <Layers className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-inmo-secondary dark:text-white mb-2">Sección en Construcción</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Los organismos complejos como Header, Formularios de Login completos y Formularios de Propiedad se documentarán aquí pronto.
          </p>
        </div>
      </Section>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'design-system': return renderDesignSystem();
      case 'atoms': return renderAtoms();
      case 'molecules': return renderMolecules();
      case 'organisms': return renderOrganisms();
      default: return renderDesignSystem();
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-[#121212] min-h-screen w-full flex flex-col font-inter transition-colors duration-300 overflow-hidden">
      
      {/* Header Toolbar */}
      <header className="bg-white dark:bg-inmo-darkcard border-b border-gray-200 dark:border-white/10 h-16 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <IconButton 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 dark:text-gray-300" 
            icon={<Home className="w-5 h-5" />}
            onClick={() => {
              if (onNavigate) onNavigate('landing');
              else navigate('/');
            }}
            title="Volver al Inicio"
          />
          <div className="w-px h-6 bg-gray-200 dark:bg-white/10"></div>
          <h1 className="font-montserrat font-black text-lg text-inmo-secondary dark:text-white flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-inmo-accent" />
            <span className="hidden sm:inline">Catálogo UI Kit</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-inmo-darkbg p-1 rounded-xl items-center gap-1">
             <Button
               variant="ghost"
               onClick={() => setIsMobileSimulated(false)}
               className={`!px-3 !py-1.5 !h-auto !text-xs !rounded-lg flex items-center gap-2 transition-colors ${!isMobileSimulated ? '!bg-white dark:!bg-inmo-darkcard shadow-sm !text-inmo-secondary dark:!text-white' : '!text-gray-500 dark:!text-gray-400 hover:!bg-gray-200 dark:hover:!bg-white/5'}`}
             >
               <Monitor className="w-4 h-4" /> <span className="hidden sm:inline">Desktop</span>
             </Button>
             <Button
               variant="ghost"
               onClick={() => setIsMobileSimulated(true)}
               className={`!px-3 !py-1.5 !h-auto !text-xs !rounded-lg flex items-center gap-2 transition-colors ${isMobileSimulated ? '!bg-white dark:!bg-inmo-darkcard shadow-sm !text-inmo-secondary dark:!text-white' : '!text-gray-500 dark:!text-gray-400 hover:!bg-gray-200 dark:hover:!bg-white/5'}`}
             >
               <Smartphone className="w-4 h-4" /> <span className="hidden sm:inline">Mobile</span>
             </Button>
          </div>
          
          <Button 
            onClick={toggleTheme} 
            variant="secondary"
            className="!px-3 !py-2 !h-auto !rounded-xl !bg-gray-100 dark:!bg-inmo-darkbg hover:!bg-gray-200 dark:hover:!bg-white/10 !border-none flex items-center gap-2"
          >
            {isDark ? <Moon className="w-4 h-4 text-yellow-400" /> : <Sun className="w-4 h-4 text-orange-500" />}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white dark:bg-inmo-darkcard border-r border-gray-200 dark:border-white/10 flex-col py-6 shrink-0 overflow-y-auto hidden md:flex z-10">
          <div className="px-6 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Atomic Design</span>
          </div>
          <nav className="flex flex-col gap-1 px-3">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-inmo-accent/10 text-inmo-accent font-bold' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-inmo-secondary dark:hover:text-white'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-inmo-accent' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto px-6 pt-8 border-t border-gray-100 dark:border-white/5 mx-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Controles Globales</h4>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-inmo-secondary dark:group-hover:text-white transition-colors">Loading</span>
                <Input type="checkbox" checked={globalLoading} onChange={(e) => setGlobalLoading(e.target.checked)} wrapperClassName="!h-auto !p-0 !border-none !bg-transparent" className="w-4 h-4 accent-inmo-accent cursor-pointer" />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-inmo-secondary dark:group-hover:text-white transition-colors">Disabled</span>
                <Input type="checkbox" checked={globalDisabled} onChange={(e) => setGlobalDisabled(e.target.checked)} wrapperClassName="!h-auto !p-0 !border-none !bg-transparent" className="w-4 h-4 accent-inmo-accent cursor-pointer" />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-inmo-secondary dark:group-hover:text-white transition-colors">Error State</span>
                <Input type="checkbox" checked={globalError} onChange={(e) => setGlobalError(e.target.checked)} wrapperClassName="!h-auto !p-0 !border-none !bg-transparent" className="w-4 h-4 accent-inmo-danger cursor-pointer" />
              </label>
            </div>
          </div>
        </aside>

        {/* Mobile Tabs (Bottom or Top) */}
        <div className="md:hidden flex overflow-x-auto bg-white dark:bg-inmo-darkcard border-b border-gray-200 dark:border-white/10 shrink-0 absolute top-0 w-full z-10">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-3 min-w-[100px] border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-inmo-accent text-inmo-accent' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Canvas Area */}
        <main className="flex-1 overflow-y-auto relative bg-gray-50 dark:bg-[#121212] pt-[72px] md:pt-0">
          
          {isMobileSimulated ? (
            <div className="min-h-full flex items-center justify-center p-4 md:p-8">
              <div className="w-[375px] h-[812px] bg-white dark:bg-inmo-darkbg rounded-[40px] border-[14px] border-gray-900 shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-white/10 shrink-0 transform scale-[0.85] md:scale-100 origin-center transition-transform">
                {/* Fake Notch */}
                <div className="absolute top-0 inset-x-0 h-6 bg-transparent flex justify-center z-[60]">
                  <div className="w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
                </div>
                
                {/* Simulated Content Area */}
                <div className="flex-1 overflow-y-auto p-4 pt-10 pb-12 custom-scrollbar relative">
                  {renderContent()}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-12 max-w-5xl mx-auto pb-24">
              <div className="mb-12">
                <h2 className="text-3xl font-montserrat font-black text-inmo-secondary dark:text-white mb-2">
                  {TABS.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Explora los componentes y su comportamiento interactivo.</p>
              </div>
              
              {renderContent()}
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
};
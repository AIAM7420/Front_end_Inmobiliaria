import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Image as ImageIcon,
  EyeOff,
  Eye,
  Handshake,
  MoreVertical,
  MapPin,
  MessageSquare,
  Power,
  ChevronLeft,
  ChevronDown,
  Bed,
  Bath,
  Maximize,
  Dog,
  Sun,
  X,
  Save,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { Button } from '../../atoms/Button';
import { IconButton } from '../../atoms/IconButton';
import { Badge } from '../../atoms/Badge';
import { SearchBar } from '../../molecules/SearchBar';
import { PeriodDropdown } from '../../molecules/PeriodDropdown';
import { SplitViewLayout } from '../../templates/SplitViewLayout';
import { ModuleLayout } from '../../templates/ModuleLayout';
import { PropertyDetailView } from '../../organisms/PropertyDetailView';
import { ActionMenu } from '../../molecules/ActionMenu';
import { MOCK_PROPERTIES } from '../../../data/mockProperties';

export const AsesorInventoryView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Enriquecer datos con estados simulados y métricas
  const properties = MOCK_PROPERTIES.map((p, index) => {
    let status: 'Activa' | 'Pausada' | 'Borrador' = 'Activa';
    if (index % 3 === 1) status = 'Pausada';
    if (index % 3 === 2) status = 'Borrador';

    return {
      ...p,
      status,
      views: Math.floor(Math.random() * 500) + 50,
      messages: Math.floor(Math.random() * 20),
    };
  });

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || p.status.toLowerCase() === statusFilter.toLowerCase().replace(/es|s$/, '');
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activa':
        return <Badge variant="success" text="Activa" />;
      case 'Pausada':
        return <Badge variant="warning" text="Pausada" />;
      case 'Borrador':
        return <Badge variant="secondary" text="Borrador" />;
      default:
        return null;
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Activa': return 'bg-inmo-success';
      case 'Pausada': return 'bg-inmo-warning';
      case 'Borrador': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
  };

  const renderSideContent = () => {
    if (!selectedProperty) return null;

    if (isEditMode) {
      return (
        <div className="h-full w-full overflow-y-auto custom-scrollbar flex flex-col font-inter bg-white dark:bg-inmo-darkcard relative">
          
          <div className="flex flex-col md:flex-row p-2 md:p-4 overflow-hidden w-full h-full gap-6">
            
            {/* Left Side: Images */}
            <div className="w-full md:w-[50%] flex flex-col gap-3 shrink-0 h-full">
              {/* Hero Dropzone */}
              <div className="relative w-full flex-1 min-h-[200px] rounded-[24px] overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-inmo-darkbg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group">
                 <img src={selectedProperty.image} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-10 transition-opacity mix-blend-luminosity" alt="hero-placeholder" />
                 
                 {/* Editable Hero Tags */}
                 <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-auto pr-4">
                    {/* Status Dropdown Trigger */}
                    <button className="flex items-center gap-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-inmo-secondary dark:text-white shadow-sm border border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors group">
                      <div className={`w-2 h-2 rounded-full ${getStatusDotColor(selectedProperty.status)}`} />
                      <span className="hidden md:inline text-[11px] font-bold tracking-wide uppercase">{selectedProperty.status}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-inmo-accent" />
                    </button>
                    
                    {/* Transaction Type Dropdown Trigger */}
                    <button className="flex items-center gap-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-inmo-secondary dark:text-white shadow-sm border border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors group">
                      <span className="hidden md:inline text-[11px] font-bold tracking-wide uppercase">{selectedProperty.type === 'renta' ? 'Renta' : 'Venta'}</span>
                      <div className="md:hidden w-2 h-2 rounded-full bg-inmo-accent" />
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-inmo-accent" />
                    </button>

                    {/* Add Highlight Button */}
                    <button className="flex items-center gap-1.5 bg-white/50 dark:bg-black/50 backdrop-blur-md border border-dashed border-gray-400 dark:border-gray-500 px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:text-inmo-accent hover:border-inmo-accent transition-colors shadow-sm">
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden md:inline text-[11px] font-bold tracking-wide uppercase">Agregar</span>
                    </button>
                 </div>

                 <div className="z-10 flex flex-col items-center p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-inmo-darkcard shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                       <ImageIcon className="w-6 h-6 text-inmo-secondary dark:text-gray-400" />
                    </div>
                    <span className="font-bold text-inmo-secondary dark:text-white">Imagen Principal</span>
                    <span className="text-xs text-gray-500 mt-1">Arrastra o haz clic para cambiar</span>
                 </div>
              </div>
              
              {/* Carousel Dropzones */}
              <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-2 shrink-0">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="relative w-[140px] h-[100px] rounded-[20px] border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-inmo-darkbg shrink-0 snap-center flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-inmo-darkcard shadow-sm flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                         <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">Añadir foto</span>
                   </div>
                 ))}
                 <div className="w-[140px] h-[100px] rounded-[20px] border-2 border-dashed border-gray-200 dark:border-gray-800 bg-transparent shrink-0 snap-center flex flex-col items-center justify-center cursor-pointer hover:border-inmo-accent hover:text-inmo-accent transition-colors text-gray-400 group">
                    <Plus className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold">Más fotos</span>
                 </div>
              </div>
            </div>

            {/* Right Side: Content */}
            <div className="w-full md:w-[50%] flex flex-col pt-2 md:pt-2 md:pl-2 min-w-0 pb-6">
              
              <div className="flex flex-col gap-3 mb-3 relative group">
                {/* Title */}
                <textarea 
                  defaultValue={selectedProperty.title}
                  className="text-[22px] md:text-2xl font-bold font-montserrat text-inmo-secondary dark:text-white leading-tight bg-gray-50 dark:bg-inmo-darkbg/50 border border-gray-200 dark:border-inmo-darktertiary focus:border-inmo-accent focus:bg-white dark:focus:bg-inmo-darkcard rounded-xl outline-none resize-none overflow-hidden transition-all w-full px-4 py-3"
                  rows={2}
                />
                
                <div className="flex justify-between items-center w-full gap-4">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 min-w-0 flex-1 bg-gray-50 dark:bg-inmo-darkbg/50 border border-gray-200 dark:border-inmo-darktertiary focus-within:border-inmo-accent focus-within:bg-white dark:focus-within:bg-inmo-darkcard rounded-xl px-4 py-2.5 transition-all">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <input type="text" defaultValue={selectedProperty.location} className="text-sm font-inter font-medium truncate bg-transparent outline-none w-full text-inmo-secondary dark:text-gray-300" />
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center bg-gray-50 dark:bg-inmo-darkbg/50 border border-gray-200 dark:border-inmo-darktertiary focus-within:border-inmo-accent focus-within:bg-white dark:focus-within:bg-inmo-darkcard rounded-xl px-4 py-2.5 transition-all">
                      <span className="text-sm font-bold text-inmo-accent mr-1">$</span>
                      <input type="number" defaultValue={selectedProperty.price} className="text-lg font-bold font-inter text-inmo-secondary dark:text-white bg-transparent outline-none w-24 md:w-28 text-right" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 mt-1">
                <textarea 
                  defaultValue="Hermosa propiedad ubicada en una de las zonas mas exclusivas y de mayor plusvalia de la ciudad. Cuenta con amplios espacios excelentemente distribuidos, iluminacion natural abundante y acabados de lujo de primera calidad. Perfecta para familias que buscan comodidad absoluta."
                  className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium bg-gray-50 dark:bg-inmo-darkbg/50 border border-gray-200 dark:border-inmo-darktertiary focus:border-inmo-accent focus:bg-white dark:focus:bg-inmo-darkcard rounded-xl outline-none resize-none w-full min-h-[100px] p-4 transition-all"
                />
              </div>

              {/* Tags Editor */}
              <div className="flex flex-wrap gap-2 mb-5">
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-inmo-darktertiary px-2.5 py-1.5 rounded-lg text-inmo-secondary dark:text-white group pr-1">
                  <Dog className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold tracking-wide uppercase">Pet Friendly</span>
                  <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded ml-1 transition-opacity"><X className="w-3 h-3 text-red-500" /></button>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-inmo-darktertiary px-2.5 py-1.5 rounded-lg text-inmo-secondary dark:text-white group pr-1">
                  <Sun className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold tracking-wide uppercase">Luz Natural</span>
                  <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded ml-1 transition-opacity"><X className="w-3 h-3 text-red-500" /></button>
                </div>
                {/* Add Tag Button */}
                <button className="flex items-center gap-1.5 bg-transparent border border-dashed border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-lg text-gray-500 hover:text-inmo-accent hover:border-inmo-accent transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold tracking-wide uppercase">Nuevo Tag</span>
                </button>
              </div>

              {/* Amenities Editor */}
              <div className="flex flex-col gap-3 mb-3 w-full flex-1 min-h-0">
                <div className="flex flex-wrap gap-2 w-full">
                  <div className="flex-1 flex items-center justify-center gap-2 bg-gray-50 dark:bg-inmo-darkbg px-2 py-2.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary focus-within:border-inmo-accent focus-within:ring-2 focus-within:ring-inmo-accent/20 transition-all">
                    <Bed className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <input type="number" defaultValue={3} className="w-6 sm:w-8 text-center bg-transparent outline-none text-xs sm:text-sm font-bold text-inmo-secondary dark:text-white" />
                    <span className="font-medium text-xs text-gray-500">Beds</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-2 bg-gray-50 dark:bg-inmo-darkbg px-2 py-2.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary focus-within:border-inmo-accent focus-within:ring-2 focus-within:ring-inmo-accent/20 transition-all">
                    <Bath className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <input type="number" defaultValue={2} className="w-6 sm:w-8 text-center bg-transparent outline-none text-xs sm:text-sm font-bold text-inmo-secondary dark:text-white" />
                    <span className="font-medium text-xs text-gray-500">Baths</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-2 bg-gray-50 dark:bg-inmo-darkbg px-2 py-2.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary focus-within:border-inmo-accent focus-within:ring-2 focus-within:ring-inmo-accent/20 transition-all">
                    <Maximize className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <input type="number" defaultValue={120} className="w-8 sm:w-10 text-center bg-transparent outline-none text-xs sm:text-sm font-bold text-inmo-secondary dark:text-white" />
                    <span className="font-medium text-xs text-gray-500">m²</span>
                  </div>
                </div>
                
                {/* Map Wireframe Placeholder */}
                <div className="w-full flex-1 min-h-[120px] bg-gray-50 dark:bg-inmo-darkbg/50 rounded-[20px] overflow-hidden relative shrink border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-inmo-darkbg cursor-pointer transition-colors group">
                   <MapPin className="w-8 h-8 mb-2 opacity-50 group-hover:scale-110 transition-transform" />
                   <span className="font-bold text-sm text-inmo-secondary dark:text-gray-300">Próximamente</span>
                   <span className="text-xs font-medium mt-1 text-gray-500 max-w-[200px] text-center">Selector interactivo de ubicación en el mapa</span>
                </div>
              </div>

            </div>
          </div>
          
          {/* Action Row - Save/Cancel */}
          <div className="sticky bottom-0 mt-auto p-4 border-t border-gray-100 dark:border-inmo-darktertiary bg-white/90 dark:bg-inmo-darkcard/90 backdrop-blur-md flex flex-col sm:flex-row justify-end gap-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-20">
             <Button 
               variant="secondary" 
               className="w-full sm:w-auto px-6 py-3" 
               icon={<X className="w-5 h-5" />}
               onClick={() => setIsEditMode(false)}
             >
               Cancelar
             </Button>
             <Button 
               variant="accent" 
               className="w-full sm:w-auto px-6 py-3" 
               icon={<Save className="w-5 h-5" />}
               onClick={() => setIsEditMode(false)}
             >
               Guardar
             </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full w-full overflow-y-auto custom-scrollbar">
        <PropertyDetailView
          property={{
            ...selectedProperty,
            tags: selectedProperty.tags || [
              { text: selectedProperty.type === 'renta' ? 'Renta' : 'Venta', variant: 'primary' }
            ]
          }}
          layout="horizontal"
          customHeaderActions={
            <>
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                 {/* Status Pill */}
                 <div className="flex items-center gap-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-inmo-secondary dark:text-white shadow-sm transition-all">
                   <div className={`w-2 h-2 rounded-full ${getStatusDotColor(selectedProperty.status)}`} />
                   <span className="hidden md:inline text-[11px] font-bold tracking-wide uppercase">{selectedProperty.status}</span>
                 </div>
                 
                 {/* Type Pill */}
                 <div className="flex items-center gap-1.5 bg-inmo-accent/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-white shadow-sm transition-all">
                   <span className="hidden md:inline text-[11px] font-bold tracking-wide uppercase">{selectedProperty.type === 'renta' ? 'Renta' : 'Venta'}</span>
                   {/* Fallback dot para mobile */}
                   <div className="md:hidden w-2 h-2 rounded-full bg-white" />
                 </div>
              </div>
              <div className="absolute top-4 right-4 z-10">
                 <IconButton variant="secondary" size="md" icon={<Edit className="w-5 h-5 text-inmo-secondary dark:text-white" />} onClick={() => setIsEditMode(true)} className="!rounded-full !bg-white/90 dark:!bg-inmo-darkbg/90 backdrop-blur-md shadow-sm border border-white/20" title="Editar Publicación" />
              </div>
            </>
          }
          customBottomBar={
            <div className="bg-white/90 dark:bg-inmo-darkcard/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] h-[64px] rounded-full flex items-center justify-between px-6 w-full max-w-[400px]">
               <div className="flex w-full justify-between items-center px-2">
                 <div className="flex flex-col items-center">
                    <span className="font-montserrat font-black text-[22px] text-inmo-secondary dark:text-white leading-none tracking-tight">{selectedProperty.views}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Vistas</span>
                 </div>
                 
                 <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                 
                 <div className="flex flex-col items-center">
                    <span className="font-montserrat font-black text-[22px] text-inmo-secondary dark:text-white leading-none tracking-tight">{selectedProperty.messages}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Consultas</span>
                 </div>
                 
                 <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                 
                 <div className="flex flex-col items-center">
                    <span className="font-montserrat font-black text-[22px] text-inmo-success leading-none tracking-tight">12%</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">CTR</span>
                 </div>
               </div>
            </div>
          }
        />
      </div>
    );
  };

  // Agregar KPIs al estado inicial (renderKpiContent)
  const renderKpiContent = () => {
    // Simular nivel de cuenta
    const propertyLimit = 15;
    const currentCount = filteredProperties.length;
    const limitText = statusFilter === 'Todos' ? `de ${propertyLimit} disp.` : statusFilter;

    return (
      <>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
              <path d="M 0 40 L 0 25 Q 30 35 60 20 T 100 5 L 100 40 Z" fill="currentColor" />
              <path d="M 0 25 Q 30 35 60 20 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-secondary dark:text-white mb-1">
              {currentCount} <span className="text-base lg:text-lg text-gray-400 font-medium">{statusFilter === 'Todos' ? `/ ${propertyLimit}` : ''}</span>
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Publicaciones<br/>{limitText}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.03]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-accent" preserveAspectRatio="none">
              <path d="M 0 40 L 0 35 Q 20 20 40 25 T 80 15 L 100 5 L 100 40 Z" fill="currentColor" />
              <path d="M 0 35 Q 20 20 40 25 T 80 15 L 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-accent mb-1">
              {filteredProperties.reduce((acc, p) => acc + p.views, 0)}
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Visitas Totales</span>
          </div>
        </div>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.03]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-success" preserveAspectRatio="none">
              <path d="M 0 40 L 0 5 Q 30 20 60 10 T 100 25 L 100 40 Z" fill="currentColor" />
              <path d="M 0 5 Q 30 20 60 10 T 100 25" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-success mb-1">
              {filteredProperties.reduce((acc, p) => acc + p.messages, 0)}
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Leads (Contactos)</span>
          </div>
        </div>
      </>
    );
  };

  const mainContent = (
    <ModuleLayout
      title="Mis Propiedades"
      subtitle={`Tienes ${properties.length} propiedades en tu inventario.`}
      isFullScreen={true}
      showSearch={false}
    >
      <div className="flex flex-col md:flex-row w-full h-full gap-6 font-inter pb-6">
        
        {/* KPI Panel on the Left (Desktop Only) */}
        {!selectedProperty && (
          <div className="hidden md:flex flex-col w-[15%] lg:w-[12%] gap-4 h-full shrink-0">
             {renderKpiContent()}
          </div>
        )}

        {/* Right Panel: Search, Actions and Table */}
        <div className="flex flex-col h-full flex-1 min-w-0 gap-6">
           <div className="flex gap-3 w-full items-center">
             <SearchBar
                placeholder="Buscar por título o ubicación..."
                size="slim"
                className="flex-1 md:flex-none md:w-[30%] min-w-0"
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
              />
              <PeriodDropdown 
                selectedPeriod={statusFilter} 
                onChange={setStatusFilter}
                options={['Todos', 'Activas', 'Pausadas', 'Borradores']}
                className="!w-[44px] !h-[44px] shrink-0"
                iconOnly={true}
              />
              <div className="hidden md:block flex-1" />
              <IconButton 
                variant="secondary" 
                icon={<Bot className="w-5 h-5 shrink-0 text-inmo-secondary dark:text-white" />} 
                className="w-[44px] h-[44px] !rounded-[14px] shrink-0 !bg-white/90 dark:!bg-inmo-darkcard/90 border border-gray-100 dark:border-white/10 shadow-sm" 
                title="Abrir Chatbot"
                onClick={() => window.dispatchEvent(new Event('open-chatbot'))}
              />
              <IconButton 
                variant="accent" 
                icon={<Plus className="w-5 h-5 shrink-0" strokeWidth={2} />} 
                className="w-[44px] h-[44px] !rounded-[14px] shadow-glow shrink-0" 
                title="Añadir Propiedad"
              />
           </div>

           {/* Container List/Table */}
           <div className="bg-white dark:bg-inmo-darkcard rounded-card border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-2">
        
        {/* Desktop Table */}
        <div className="hidden md:block w-full flex-1 overflow-y-auto overflow-x-auto custom-scrollbar relative">
          <table className="w-full text-left border-collapse min-w-[900px] h-fit">
            <thead className="sticky top-0 z-10 shadow-sm">
              <tr className="border-b border-gray-100 dark:border-inmo-darktertiary bg-gray-50/95 dark:bg-inmo-darkbg/95 backdrop-blur-md text-inmo-secondary dark:text-gray-300 font-montserrat text-sm">
                <th className="p-4 font-bold">Propiedad</th>
                <th className="p-4 font-bold">Tipo / Precio</th>
                <th className="p-4 font-bold">Estado</th>
                <th className="p-4 font-bold">Métricas</th>
                <th className="p-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="font-inter">
              {filteredProperties.map(prop => (
                <tr 
                  key={prop.id} 
                  className={`border-b border-gray-50 dark:border-inmo-darktertiary hover:bg-gray-50 dark:hover:bg-inmo-darktertiary transition-colors cursor-pointer relative ${selectedProperty?.id === prop.id ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10' : ''} ${openMenuId === prop.id ? 'z-50' : 'z-0'}`}
                  onClick={() => { setSelectedProperty(prop); setIsEditMode(false); }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={prop.image} alt={prop.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex flex-col min-w-[200px]">
                        <span className="font-bold text-inmo-secondary dark:text-white line-clamp-1">{prop.title}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {prop.location}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="capitalize text-sm font-medium text-gray-600 dark:text-gray-300">{prop.type}</span>
                      <span className="font-montserrat font-bold text-inmo-accent mt-1">{formatPrice(prop.price)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(prop.status)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1 font-montserrat"><Eye className="w-4 h-4 text-gray-400" /> {prop.views}</span>
                      <span className="flex items-center gap-1 font-montserrat"><MessageSquare className="w-4 h-4 text-gray-400" /> {prop.messages}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {selectedProperty ? (
                      <div className="flex items-center justify-end">
                        {openMenuId === prop.id && (
                          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                        )}
                        <div 
                          className="relative"
                          onMouseLeave={() => setOpenMenuId(null)}
                        >
                          <button 
                            className="p-2 text-gray-400 hover:text-inmo-secondary dark:hover:text-white transition-colors"
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === prop.id ? null : prop.id); }}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          <ActionMenu
                            isOpen={openMenuId === prop.id}
                            onClose={() => setOpenMenuId(null)}
                            items={[
                              { label: 'Editar Propiedad', icon: <Edit className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setSelectedProperty(prop); setIsEditMode(true); } },
                              { label: 'Gestionar Fotos', icon: <ImageIcon className="w-4 h-4 shrink-0" />, onClick: (e) => e.stopPropagation() },
                              { label: prop.status === 'Activa' ? 'Pausar' : 'Activar Publicación', icon: prop.status === 'Activa' ? <EyeOff className="w-4 h-4 shrink-0" /> : <Power className="w-4 h-4 shrink-0" />, onClick: (e) => e.stopPropagation() },
                              { label: 'Colaboración', icon: <Handshake className="w-4 h-4 shrink-0" />, onClick: (e) => e.stopPropagation() }
                            ]}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <IconButton variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} title="Editar" onClick={(e) => { e.stopPropagation(); setSelectedProperty(prop); setIsEditMode(true); }} />
                        <IconButton variant="ghost" size="sm" icon={<ImageIcon className="w-4 h-4" />} title="Fotos" onClick={(e) => { e.stopPropagation(); }} />
                        <IconButton variant="ghost" size="sm" icon={prop.status === 'Activa' ? <EyeOff className="w-4 h-4" /> : <Power className="w-4 h-4" />} title={prop.status === 'Activa' ? 'Pausar' : 'Activar'} onClick={(e) => { e.stopPropagation(); }} />
                        <IconButton variant="ghost" size="sm" icon={<Handshake className="w-4 h-4" />} title="Colaboración" onClick={(e) => { e.stopPropagation(); }} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredProperties.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-inter">No se encontraron propiedades.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List Minimal */}
        <div className="flex flex-col md:hidden font-inter flex-1 overflow-y-auto custom-scrollbar">
          {filteredProperties.map((prop, index) => (
            <div 
              key={prop.id} 
              className={`flex items-center gap-3 p-3 relative cursor-pointer ${index !== filteredProperties.length - 1 ? 'border-b border-gray-100 dark:border-inmo-darktertiary' : ''} ${selectedProperty?.id === prop.id ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10' : ''} ${openMenuId === prop.id ? 'z-50' : 'z-0'}`}
              onClick={() => { setSelectedProperty(prop); setIsEditMode(false); }}
            >
              <div className="relative shrink-0">
                <img src={prop.image} alt={prop.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              </div>
              <div className="flex flex-col flex-1 min-w-0 justify-center">
                <span className="font-bold text-inmo-secondary dark:text-white line-clamp-1 text-sm leading-tight pr-6">
                  {prop.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {prop.location}
                </span>
                <span className="font-montserrat font-bold text-inmo-accent text-sm mt-1">
                  {formatPrice(prop.price)}
                </span>
              </div>
              
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(prop.status)} shrink-0`} title={prop.status} />
                
                {openMenuId === prop.id && (
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                )}

                <div 
                  className="relative"
                  onMouseLeave={() => setOpenMenuId(null)}
                >
                  <button 
                    className="p-1 text-gray-400 hover:text-inmo-secondary dark:hover:text-white transition-colors"
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === prop.id ? null : prop.id); }}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  <ActionMenu
                    isOpen={openMenuId === prop.id}
                    onClose={() => setOpenMenuId(null)}
                    items={[
                      { label: 'Editar Propiedad', icon: <Edit className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setSelectedProperty(prop); setIsEditMode(true); } },
                      { label: 'Gestionar Fotos', icon: <ImageIcon className="w-4 h-4 shrink-0" />, onClick: (e) => e.stopPropagation() },
                      { label: prop.status === 'Activa' ? 'Pausar' : 'Activar Publicación', icon: prop.status === 'Activa' ? <EyeOff className="w-4 h-4 shrink-0" /> : <Power className="w-4 h-4 shrink-0" />, onClick: (e) => e.stopPropagation() },
                      { label: 'Colaboración', icon: <Handshake className="w-4 h-4 shrink-0" />, onClick: (e) => e.stopPropagation() }
                    ]}
                  />
                </div>
              </div>
            </div>
          ))}
          {filteredProperties.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm font-inter">No se encontraron propiedades.</div>
          )}
        </div>
        </div>
      </div>
      </div>
    </ModuleLayout>
  );

  return (
    <SplitViewLayout
      isOpen={!!selectedProperty}
      onClose={() => setSelectedProperty(null)}
      sideTitle={isEditMode ? "Modo Edición" : "Detalle de Propiedad"}
      sideContent={renderSideContent()}
      sidePanelWidthClass="md:w-[50%]"
      mainPanelWidthClass="md:w-[50%]"
      mainContent={mainContent}
      bottomSheetNoPadding={true}
      bottomSheetHeightMode="fixed-85"
    />
  );
};

import React, { useState } from 'react';
import { Bell, Heart, TrendingUp, Podium, Home, Building2, MapPin, Briefcase, Activity, DollarSign, Eye, Clock, ArrowUpRight } from 'lucide-react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { BottomSheet } from '../../organisms/BottomSheet';
import { IconButton } from '../../atoms/IconButton';
import { Button } from '../../atoms/Button';
import { useAppContext } from '../../../context/AppContext';
import { PropertyCard } from '../../molecules/PropertyCard';
import { PeriodSelector } from '../../molecules/PeriodSelector';
import { PeriodDropdown } from '../../molecules/PeriodDropdown';
import { MOCK_PROPERTIES } from '../../../data/mockProperties';
import { ModuleLayout } from '../../templates/ModuleLayout';
import { SplitViewLayout } from '../../templates/SplitViewLayout';
import { generateChartData, type ChartViewMode } from '../../../utils/chartData';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Nuevo lead asignado', body: 'Carlos Slim está interesado en "Penthouse Polanco".', time: 'Hace 2 min', unread: true },
  { id: 2, title: 'Visita agendada', body: 'Mañana a las 10:00 AM en "Casa Bosques".', time: 'Hace 1 hora', unread: true },
  { id: 3, title: 'Mensaje de Ana', body: '¿Sigue disponible la propiedad de Lomas?', time: 'Hace 3 horas', unread: false },
  { id: 4, title: 'Propiedad pausada', body: 'El anuncio de "Terreno Tulum" ha expirado.', time: 'Ayer', unread: false },
];

export const AsesorOverview: React.FC = () => {
  const { isDarkMode } = useAppContext();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [activeSidePanel, setActiveSidePanel] = useState<'ranking' | 'portafolio' | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Mes');
  const [chartViewMode, setChartViewMode] = useState<ChartViewMode>('dias');
  const [activeZone, setActiveZone] = useState<number | null>(null);

  const currentChartData = generateChartData(selectedPeriod, chartViewMode);

  const darkStyles = [
    { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] }
  ];
  
  const lightStyles = [
    { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    // Silver / Grayscale aesthetic
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] }
  ];

  const renderMainContent = () => (
    <ModuleLayout
      title="Hola, Asesor"
      subtitle="Tu resumen del día"
      isFullScreen={true}
      showSearch={false}
      showFilters={false}
      headerEndContent={
        <>
          {/* Selector de Periodo Desktop - CENTRADO */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-30 w-full max-w-[400px] xl:max-w-[450px]">
            <PeriodSelector 
              selectedPeriod={selectedPeriod} 
              onChange={setSelectedPeriod} 
            />
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            {/* Selector de Periodo Mobile */}
            <PeriodDropdown
              selectedPeriod={selectedPeriod}
              onChange={setSelectedPeriod}
              options={['Semana', 'Mes', '3 Meses', '6 Meses', 'Año']}
              className="md:hidden"
            />

            <div className="relative z-20">
              <IconButton 
                icon={<Bell className="w-5 h-5 md:w-6 md:h-6 text-inmo-secondary dark:text-white" strokeWidth={2} />} 
                variant="secondary"
                className="relative shrink-0 md:!w-12 md:!h-12 md:bg-white md:dark:bg-inmo-darkcard shadow-soft"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <span className="absolute top-2 right-2 md:top-3 md:right-3 w-2 h-2 md:w-2.5 md:h-2.5 bg-inmo-accent rounded-full border border-white dark:border-inmo-darkcard"></span>
              </IconButton>

              {/* Desktop Notifications Dropdown (Hidden on Mobile) */}
              {isNotificationsOpen && (
                <div className="hidden md:block fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)}></div>
              )}
              
              <div 
                className={`hidden md:block absolute right-0 top-full mt-4 w-[340px] bg-white dark:bg-inmo-darkcard rounded-2xl shadow-xl border border-gray-100 dark:border-inmo-darktertiary z-20 overflow-hidden transition-all duration-200 origin-top-right ${
                  isNotificationsOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
                }`}
              >
                <div className="p-4 border-b border-gray-100 dark:border-inmo-darktertiary flex justify-between items-center">
                  <span className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Notificaciones</span>
                  <span 
                    className="text-xs text-inmo-accent font-bold cursor-pointer hover:underline"
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    Marcar leídas
                  </span>
                </div>
                <div className="flex flex-col max-h-[360px] overflow-y-auto">
                   {MOCK_NOTIFICATIONS.map(n => (
                     <div key={n.id} className="p-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                       <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${n.unread ? 'bg-inmo-accent' : 'bg-transparent'}`} />
                       <div className="flex flex-col">
                         <span className="text-xs font-bold text-inmo-secondary dark:text-white">{n.title}</span>
                         <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.body}</span>
                         <span className="text-[10px] text-gray-400 mt-2">{n.time}</span>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-4 md:gap-6 animate-in fade-in h-full">

      {/* 3. KPIs Unificados + Botones Laterales */}
      {/* Mobile: 12-col grid | Desktop: flex row so button column can auto-shrink */}
      <div className="grid grid-cols-12 md:flex md:flex-row gap-3 md:gap-4 shrink-0">
        
        {/* Nuevos Leads */}
        <div className="col-span-4 md:flex-1 order-1 md:order-1 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-card p-3 md:p-5 shadow-sm flex flex-col items-center justify-center text-center group transition-all duration-300 relative overflow-hidden hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 delay-[100ms] fill-mode-both min-w-0">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
              <path d="M 0 40 L 0 30 Q 25 15 50 25 T 100 10 L 100 40 Z" fill="currentColor" />
              <path d="M 0 30 Q 25 15 50 25 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 justify-center relative z-10">
            <span className="font-inter text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Nuevos Leads</span>
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          </div>
          <div className="mt-1.5 md:mt-3 relative z-10">
            <span className="font-montserrat font-bold text-2xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">12</span>
          </div>
          <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
            <div className="px-1.5 md:px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-1 group-hover:bg-inmo-secondary group-hover:text-white transition-colors">
              <span className="font-inter text-[9px] md:text-caption font-bold">Últimos 7 días</span>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="col-span-4 md:flex-1 order-2 md:order-2 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-card p-3 md:p-5 shadow-sm flex flex-col items-center justify-center text-center group transition-all duration-300 relative overflow-hidden hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 delay-[200ms] fill-mode-both min-w-0">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
              <path d="M 0 40 L 0 25 Q 30 35 60 20 T 100 5 L 100 40 Z" fill="currentColor" />
              <path d="M 0 25 Q 30 35 60 20 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 justify-center relative z-10">
            <span className="font-inter text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Mensajes</span>
            <Bell className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          </div>
          <div className="mt-1.5 md:mt-3 relative z-10">
            <span className="font-montserrat font-bold text-2xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">4</span>
          </div>
          <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
            <div className="px-1.5 md:px-2 py-0.5 rounded bg-inmo-warning/10 dark:bg-inmo-warning/20 text-inmo-warning flex items-center gap-1">
              <span className="font-inter text-[9px] md:text-caption font-bold">Pendientes</span>
            </div>
          </div>
        </div>

        {/* Botones Interactivos Desktop (Stacked on Mobile too) */}
        <div className={`col-span-4 order-3 md:order-5 flex flex-col gap-2 md:gap-3 h-full animate-in fade-in slide-in-from-bottom-4 delay-[500ms] fill-mode-both transition-[width,flex,min-width] ease-[cubic-bezier(0.4,0,0.2,1)] duration-500 ${
          activeSidePanel !== null ? 'md:flex-none md:w-[64px]' : 'md:flex-1 md:min-w-0 delay-500'
        }`}>
          <button 
            onClick={() => setActiveSidePanel('ranking')}
            className={`bg-inmo-accent text-white font-inter font-bold overflow-hidden flex flex-col md:flex-row items-center justify-center flex-1 rounded-[16px] md:rounded-[20px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] w-full ${
              activeSidePanel === 'ranking'
                ? 'opacity-50 cursor-default'
                : 'shadow-glow hover:bg-red-600 active:scale-95 cursor-pointer hover:scale-[1.02]'
            } ${
              activeSidePanel !== null 
                ? 'gap-0 p-0' 
                : 'gap-1 md:gap-3 px-1 md:px-5 py-2 md:py-0 delay-500'
            }`}
          >
            <Podium className="w-4 h-4 md:w-6 md:h-6 text-white shrink-0" strokeWidth={1.5} />
            <span className={`font-inter font-medium text-[9px] md:text-sm lg:text-base text-white whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              activeSidePanel !== null 
                ? 'md:max-w-0 md:opacity-0 md:w-0 md:hidden' 
                : 'max-w-[120px] opacity-100 delay-[800ms]'
            }`}>Ranking</span>
          </button>

          <button 
            onClick={() => setActiveSidePanel('portafolio')}
            className={`font-inter font-bold overflow-hidden flex flex-col md:flex-row items-center justify-center flex-1 bg-white dark:bg-inmo-darkcard text-inmo-secondary dark:text-white shadow-soft rounded-[16px] md:rounded-[20px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] w-full ${
              activeSidePanel === 'portafolio'
                ? 'opacity-50 cursor-default'
                : 'hover:bg-gray-100 dark:hover:bg-inmo-darkbg active:scale-95 cursor-pointer hover:scale-[1.02]'
            } ${
              activeSidePanel !== null 
                ? 'gap-0 p-0' 
                : 'gap-1 md:gap-3 px-1 md:px-5 py-2 md:py-0 delay-500'
            }`}
          >
            <Briefcase className="w-4 h-4 md:w-6 md:h-6 shrink-0 text-inmo-secondary dark:text-white" strokeWidth={1.5} />
            <span className={`font-inter font-medium text-[9px] md:text-sm lg:text-base text-inmo-secondary dark:text-white whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              activeSidePanel !== null 
                ? 'md:max-w-0 md:opacity-0 md:w-0 md:hidden' 
                : 'max-w-[120px] opacity-100 delay-[800ms]'
            }`}>Portafolio</span>
          </button>
        </div>

        {/* Visitas */}
        <div className="col-span-6 md:flex-1 order-4 md:order-3 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-card p-3 md:p-5 shadow-sm flex flex-col items-center justify-center text-center group transition-all duration-300 relative overflow-hidden hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 delay-[300ms] fill-mode-both min-w-0">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
              <path d="M 0 40 L 0 35 Q 20 20 40 25 T 80 15 L 100 5 L 100 40 Z" fill="currentColor" />
              <path d="M 0 35 Q 20 20 40 25 T 80 15 L 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 justify-center relative z-10">
            <span className="font-inter text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Visitas</span>
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          </div>
          <div className="mt-1.5 md:mt-3 relative z-10">
            <span className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">1.2k</span>
          </div>
          <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
            <div className="px-1.5 md:px-2 py-0.5 rounded bg-inmo-success/10 dark:bg-inmo-success/20 text-inmo-success flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span className="font-inter text-caption md:text-caption font-bold">+15%</span>
            </div>
          </div>
        </div>

        {/* Favoritos */}
        <div className="col-span-6 md:flex-1 order-5 md:order-4 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-card p-3 md:p-5 shadow-sm flex flex-col items-center justify-center text-center group transition-all duration-300 relative overflow-hidden hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 delay-[400ms] fill-mode-both min-w-0">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
              <path d="M 0 40 L 0 5 Q 30 20 60 10 T 100 25 L 100 40 Z" fill="currentColor" />
              <path d="M 0 5 Q 30 20 60 10 T 100 25" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 justify-center relative z-10">
            <span className="font-inter text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Favoritos</span>
            <Heart className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          </div>
          <div className="mt-1.5 md:mt-3 relative z-10">
            <span className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-inmo-secondary dark:text-white">142</span>
          </div>
          <div className="mt-1.5 md:mt-3 flex justify-center w-full relative z-10">
            <div className="px-1.5 md:px-2 py-0.5 rounded bg-inmo-success/10 dark:bg-inmo-success/20 text-inmo-success flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span className="font-inter text-caption md:text-caption font-bold">+8%</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Mapa Interactivo y Gráfica */}
      <div className="flex-auto min-h-[160px] flex flex-col md:flex-row gap-4 relative shrink animate-in fade-in slide-in-from-bottom-8 duration-700 delay-[600ms] fill-mode-both -mb-[112px] md:mb-0">

        {/* Mapa Interactivo (70%) */}
        <div className="flex-1 md:flex-none md:w-[70%] w-full bg-gray-100 dark:bg-inmo-darktertiary rounded-[32px] relative overflow-hidden shadow-soft border-4 border-white dark:border-inmo-darkcard">
           
           {apiKey ? (
             <div className="absolute inset-0 pointer-events-none">
               <APIProvider apiKey={apiKey}>
                 <Map
                   defaultCenter={{ lat: 21.135, lng: -101.680 }}
                   defaultZoom={11}
                   disableDefaultUI={true}
                   gestureHandling="none"
                   styles={isDarkMode ? darkStyles : lightStyles}
                   className="w-full h-full"
                 />
               </APIProvider>
             </div>
           ) : (
             <div className="absolute inset-0 bg-gray-200 dark:bg-inmo-darktertiary/50" />
           )}

           {/* Overlays de Afluencia / Densidad (Interactivos) */}
           {/* Dismiss Backdrop */}
           {activeZone !== null && (
             <div className="absolute inset-0 z-10 pointer-events-auto" onClick={() => setActiveZone(null)} />
           )}

           <div className="absolute inset-0 z-20 pointer-events-none">
             
             {/* Zona de Alta Afluencia */}
             <div className="absolute top-[30%] left-[25%] md:left-[35%] flex flex-col items-center justify-center">
               <div className="absolute w-36 h-36 bg-inmo-accent/60 rounded-full blur-2xl animate-pulse pointer-events-none"></div>
               
               {/* Nodo (Texto simple) */}
               <div 
                 className="relative flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-110 transition-all duration-300 z-10"
                 onClick={() => setActiveZone(activeZone === 1 ? null : 1)}
               >
                 <span className={`font-montserrat font-black text-3xl text-white drop-shadow-md transition-transform ${activeZone === 1 ? 'scale-110' : ''}`}>+85</span>
               </div>

               {/* Popover */}
               <div className={`absolute top-14 bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-xl border border-white dark:border-white/10 rounded-2xl p-4 shadow-soft w-[180px] pointer-events-auto transition-all duration-300 z-20 ${activeZone === 1 ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95 origin-top'}`}>
                 <h4 className="font-montserrat font-bold text-[13px] text-inmo-secondary dark:text-white leading-tight">Zona Bosques</h4>
                 <p className="font-inter text-[10px] text-inmo-accent font-bold mt-0.5">Tráfico Alto</p>
                 <p className="font-inter text-[10px] text-gray-500 mt-1 leading-snug">Gran volumen de visitas orgánicas por hora.</p>
                 
                 <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
                    <span className="text-[10px] text-gray-500 font-medium">Interesados</span>
                    <span className="font-bold text-xs text-inmo-secondary dark:text-white">24</span>
                 </div>
               </div>
             </div>

             {/* Zona de Media Afluencia */}
             <div className="absolute top-[55%] left-[55%] md:left-[55%] flex flex-col items-center justify-center">
               <div className="absolute w-28 h-28 bg-gray-800/50 dark:bg-gray-200/50 rounded-full blur-xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
               
               {/* Nodo (Texto simple) */}
               <div 
                 className="relative flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-110 transition-all duration-300 z-10"
                 onClick={() => setActiveZone(activeZone === 2 ? null : 2)}
               >
                 <span className={`font-montserrat font-black text-2xl text-white drop-shadow-md transition-transform ${activeZone === 2 ? 'scale-110' : ''}`}>42</span>
               </div>

               {/* Popover */}
               <div className={`absolute top-12 bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-xl border border-white dark:border-white/10 rounded-2xl p-4 shadow-soft w-[160px] pointer-events-auto transition-all duration-300 z-20 ${activeZone === 2 ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95 origin-top'}`}>
                 <h4 className="font-montserrat font-bold text-[13px] text-inmo-secondary dark:text-white leading-tight">Zona Sur</h4>
                 <p className="font-inter text-[10px] text-gray-500 font-bold mt-0.5">Estable</p>
                 
                 <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
                    <span className="text-[10px] text-gray-500 font-medium">Interesados</span>
                    <span className="font-bold text-xs text-inmo-secondary dark:text-white">8</span>
                 </div>
               </div>
             </div>
             
             {/* Zona de Baja Afluencia */}
             <div className="absolute bottom-[22%] right-[15%] md:right-[25%] flex flex-col items-center justify-center">
               <div className="absolute w-24 h-24 bg-gray-600/50 dark:bg-gray-400/40 rounded-full blur-xl pointer-events-none"></div>
               
               {/* Nodo (Texto simple) */}
               <div 
                 className="relative flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-110 transition-all duration-300 z-10"
                 onClick={() => setActiveZone(activeZone === 3 ? null : 3)}
               >
                 <span className={`font-montserrat font-black text-xl text-white drop-shadow-md transition-transform ${activeZone === 3 ? 'scale-110' : ''}`}>12</span>
               </div>

               {/* Popover */}
               <div className={`absolute bottom-10 right-0 md:-left-16 bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-xl border border-white dark:border-white/10 rounded-2xl p-4 shadow-soft w-[160px] pointer-events-auto transition-all duration-300 z-20 ${activeZone === 3 ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95 origin-bottom md:origin-bottom-left'}`}>
                 <h4 className="font-montserrat font-bold text-[13px] text-inmo-secondary dark:text-white leading-tight">Periferia</h4>
                 <p className="font-inter text-[10px] text-gray-500 font-bold mt-0.5">Tráfico Bajo</p>
                 
                 <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
                    <span className="text-[10px] text-gray-500 font-medium">Interesados</span>
                    <span className="font-bold text-xs text-inmo-secondary dark:text-white">2</span>
                 </div>
               </div>
             </div>
             
           </div>
        </div>

        {/* Gráfica de Tráfico (30%) */}
        <div className="hidden md:flex w-[30%] bg-white dark:bg-inmo-darkcard rounded-card border-4 border-white dark:border-inmo-darkcard shadow-soft p-5 relative flex-col justify-between gap-4 transition-all duration-300">
          <div className="flex justify-between items-start relative z-20 w-full">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-gray-400" />
                <h4 className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Tráfico</h4>
              </div>
              <p className="font-inter text-caption text-gray-400 mt-0.5">Visitas a tu portafolio</p>
            </div>
            {['6 Meses', 'Año'].includes(selectedPeriod) && (
              <div className="flex bg-gray-100 dark:bg-inmo-darkbg rounded-lg p-0.5 ml-auto">
                <button
                  onClick={() => setChartViewMode('dias')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${chartViewMode === 'dias' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >Días</button>
                <button
                  onClick={() => setChartViewMode('semanas')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${chartViewMode === 'semanas' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >Semanas</button>
                <button
                  onClick={() => setChartViewMode('meses')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${chartViewMode === 'meses' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >Meses</button>
              </div>
            )}
          </div>
          
          <div className="flex-1 w-full h-full relative pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="currentColor" className="text-inmo-accent" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="currentColor" className="text-inmo-accent" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-white/5" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', className: 'text-gray-400 font-inter text-[11px]' }} 
                  dy={10} 
                  minTickGap={30}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', className: 'text-gray-400 font-inter text-[11px]' }} 
                  tickFormatter={(value) => `${value}`}
                />
                <RechartsTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-white/10 rounded-xl p-3 shadow-soft font-inter">
                          <p className="font-montserrat font-bold text-inmo-secondary dark:text-gray-200 mb-1">{label}</p>
                          <p className="text-inmo-accent font-bold text-xs">
                            Visitas: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ stroke: 'currentColor', className: 'text-gray-100 dark:text-white/5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="none" 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                  activeDot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="currentColor" 
                  strokeWidth={3} 
                  dot={false}
                  className="text-inmo-accent [filter:drop-shadow(0px_8px_8px_theme(colors.inmo.accent))]"
                  activeDot={{ r: 6, strokeWidth: 0, fill: "currentColor", className: "text-inmo-accent" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
      </div>
    </ModuleLayout>
  );

  const renderSideContent = () => {
    if (activeSidePanel === 'ranking') {
      return (
        <div className="grid gap-4 grid-cols-1">
          {MOCK_PROPERTIES.slice(0, 3).map((property, idx) => (
            <div key={property.id} className="relative w-full">
              <div className="absolute -top-3 -left-3 z-20 w-8 h-8 rounded-full bg-inmo-secondary dark:bg-white text-white dark:text-inmo-secondary flex items-center justify-center font-montserrat font-bold text-sm shadow-md border-2 border-white dark:border-inmo-darkbg">
                #{idx + 1}
              </div>
              <PropertyCard
                image={property.image}
                title={property.title}
                location={property.location}
                price={property.price}
                beds={property.beds}
                baths={property.baths}
                sqft={property.sqft}
                variant="asesor"
                views={Math.max(10, 450 - (idx * 45))}
                messages={Math.max(1, 12 - idx)}
              />
            </div>
          ))}
        </div>
      );
    }

    if (activeSidePanel === 'portafolio') {
      return (
        <div className="flex flex-col gap-3 h-full">
          {/* Card 1: Valor del Portafolio */}
          <div className="bg-white dark:bg-inmo-darkcard rounded-card p-5 shadow-soft border border-gray-100 dark:border-inmo-darktertiary">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <p className="font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">Valor del Portafolio</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-montserrat font-black text-3xl md:text-4xl text-inmo-secondary dark:text-white">$24.5M</span>
              <span className="font-inter text-xs font-bold text-inmo-success flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />+12%
              </span>
            </div>
            <p className="font-inter text-[11px] text-gray-400 mt-1">15 propiedades activas</p>
          </div>

          {/* Card 2: Estado de Propiedades */}
          <div className="bg-white dark:bg-inmo-darkcard rounded-card p-5 shadow-soft border border-gray-100 dark:border-inmo-darktertiary">
            <p className="font-inter text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Estado de Propiedades</p>
            
            {/* Progress bar */}
            <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex mb-3">
              <div className="h-full bg-inmo-success rounded-l-full" style={{ width: '60%' }} />
              <div className="h-full bg-inmo-warning" style={{ width: '20%' }} />
              <div className="h-full bg-gray-300 dark:bg-gray-600 rounded-r-full" style={{ width: '20%' }} />
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-inmo-success" />
                  <span className="font-inter text-sm text-inmo-secondary dark:text-white">Activas</span>
                </div>
                <span className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-inmo-warning" />
                  <span className="font-inter text-sm text-inmo-secondary dark:text-white">Pausadas</span>
                </div>
                <span className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="font-inter text-sm text-inmo-secondary dark:text-white">Borradores</span>
                </div>
                <span className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">3</span>
              </div>
            </div>
          </div>

          {/* Cards 3 & 4: Mini KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-4 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col">
              <div className="flex items-center gap-1.5 mb-2">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                <p className="font-inter text-[10px] font-bold text-gray-400 uppercase tracking-wider">Visitas / sem</p>
              </div>
              <span className="font-montserrat font-black text-2xl md:text-3xl text-inmo-secondary dark:text-white">847</span>
              <span className="font-inter text-[10px] font-bold text-inmo-success mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" />+23%
              </span>
            </div>

            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-4 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <p className="font-inter text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tiempo prom.</p>
              </div>
              <span className="font-montserrat font-black text-2xl md:text-3xl text-inmo-secondary dark:text-white">18d</span>
              <span className="font-inter text-[10px] text-gray-400 mt-1">en el mercado</span>
            </div>
          </div>

          {/* Card 5: Desglose por Tipo — 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-[220px]">
            {/* Casas */}
            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-3 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
                <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
                  <path d="M 0 40 L 0 30 Q 25 15 50 25 T 100 10 L 100 40 Z" fill="currentColor" />
                  <path d="M 0 30 Q 25 15 50 25 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 justify-center relative z-10 mb-1">
                <span className="font-inter text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Casas</span>
                <Home className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
              </div>
              <span className="font-montserrat font-black text-2xl md:text-3xl text-inmo-secondary dark:text-white relative z-10">8</span>
              <div className="mt-1 flex justify-center w-full relative z-10">
                <div className="px-1.5 py-0.5 rounded bg-gray-50 dark:bg-gray-800 text-gray-500 flex items-center gap-1">
                  <span className="font-inter text-[9px] font-bold">$14.2M</span>
                </div>
              </div>
            </div>

            {/* Deptos */}
            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-3 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
                <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
                  <path d="M 0 40 L 0 25 Q 30 35 60 20 T 100 5 L 100 40 Z" fill="currentColor" />
                  <path d="M 0 25 Q 30 35 60 20 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 justify-center relative z-10 mb-1">
                <span className="font-inter text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Deptos</span>
                <Building2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
              </div>
              <span className="font-montserrat font-black text-2xl md:text-3xl text-inmo-secondary dark:text-white relative z-10">5</span>
              <div className="mt-1 flex justify-center w-full relative z-10">
                <div className="px-1.5 py-0.5 rounded bg-gray-50 dark:bg-gray-800 text-gray-500 flex items-center gap-1">
                  <span className="font-inter text-[9px] font-bold">$8.1M</span>
                </div>
              </div>
            </div>

            {/* Terrenos */}
            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-3 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
                <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
                  <path d="M 0 40 L 0 35 Q 20 20 40 25 T 80 15 L 100 5 L 100 40 Z" fill="currentColor" />
                  <path d="M 0 35 Q 20 20 40 25 T 80 15 L 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 justify-center relative z-10 mb-1">
                <span className="font-inter text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Terrenos</span>
                <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
              </div>
              <span className="font-montserrat font-black text-2xl md:text-3xl text-inmo-secondary dark:text-white relative z-10">2</span>
              <div className="mt-1 flex justify-center w-full relative z-10">
                <div className="px-1.5 py-0.5 rounded bg-gray-50 dark:bg-gray-800 text-gray-500 flex items-center gap-1">
                  <span className="font-inter text-[9px] font-bold">$2.2M</span>
                </div>
              </div>
            </div>

            {/* Comercial */}
            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-3 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
                <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
                  <path d="M 0 40 L 0 5 Q 30 20 60 10 T 100 25 L 100 40 Z" fill="currentColor" />
                  <path d="M 0 5 Q 30 20 60 10 T 100 25" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 justify-center relative z-10 mb-1">
                <span className="font-inter text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Comercial</span>
                <Briefcase className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
              </div>
              <span className="font-montserrat font-black text-2xl md:text-3xl text-inmo-secondary dark:text-white relative z-10">3</span>
              <div className="mt-1 flex justify-center w-full relative z-10">
                <div className="px-1.5 py-0.5 rounded bg-gray-50 dark:bg-gray-800 text-gray-500 flex items-center gap-1">
                  <span className="font-inter text-[9px] font-bold">$4.8M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <SplitViewLayout
      isOpen={activeSidePanel !== null}
      onClose={() => setActiveSidePanel(null)}
      sideTitle={activeSidePanel === 'ranking' ? 'Ranking Inmuebles' : 'Análisis de Portafolio'}
      sidePosition="left"
      sideContent={renderSideContent()}
      mainContent={renderMainContent()}
      sidePanelWidthClass="w-full md:w-[30%]"
      mainPanelWidthClass="md:w-[70%]"
      bottomSheetNoPadding={false}
      desktopNoPadding={false}
    />
  );
};

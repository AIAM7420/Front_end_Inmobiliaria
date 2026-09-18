import React, { useState } from 'react';
import { Bell, Heart, TrendingUp, Podium, Home, Building2, MapPin, Briefcase } from 'lucide-react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { BottomSheet } from '../../organisms/BottomSheet';
import { IconButton } from '../../atoms/IconButton';
import { Button } from '../../atoms/Button';
import { useAppContext } from '../../../context/AppContext';
import { PropertyCard } from '../../molecules/PropertyCard';
import { PeriodSelector } from '../../molecules/PeriodSelector';
import { PeriodDropdown } from '../../molecules/PeriodDropdown';
import { MOCK_PROPERTIES } from '../../../data/mockProperties';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Nuevo lead asignado', body: 'Carlos Slim está interesado en "Penthouse Polanco".', time: 'Hace 2 min', unread: true },
  { id: 2, title: 'Visita agendada', body: 'Mañana a las 10:00 AM en "Casa Bosques".', time: 'Hace 1 hora', unread: true },
  { id: 3, title: 'Mensaje de Ana', body: '¿Sigue disponible la propiedad de Lomas?', time: 'Hace 3 horas', unread: false },
  { id: 4, title: 'Propiedad pausada', body: 'El anuncio de "Terreno Tulum" ha expirado.', time: 'Ayer', unread: false },
];

export const AsesorOverview: React.FC = () => {
  const { isDarkMode } = useAppContext();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [isTopSheetOpen, setIsTopSheetOpen] = useState(false);
  const [isPortafolioSheetOpen, setIsPortafolioSheetOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Mes');
  const [activeZone, setActiveZone] = useState<number | null>(null);

  const darkStyles = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
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
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] }
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6 h-full w-full pt-[100px] pb-4 md:pb-6 px-4 md:px-6 animate-in fade-in">
      
      {/* 1. Header Flotante */}
      <header className="flex justify-between items-center mb-1 shrink-0 relative">
        <div className="ml-4 md:ml-6 flex-1 flex flex-row items-baseline gap-4 md:gap-6 flex-wrap sm:flex-nowrap truncate">
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-inmo-secondary dark:text-white shrink-0">Hola, Asesor</h1>
          <p className="font-inter text-sm md:text-base text-gray-500 dark:text-gray-400 truncate">Tu resumen del día</p>
        </div>
        
        {/* Selector de Periodo Desktop - CENTRADO */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-30 w-full max-w-[400px] xl:max-w-[450px]">
          <PeriodSelector 
            selectedPeriod={selectedPeriod} 
            onChange={setSelectedPeriod} 
          />
        </div>

        <div className="flex items-center gap-2 mr-4 md:mr-6 flex-1 justify-end">
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
      </header>

      {/* 3. KPIs Unificados + Botones Laterales */}
      <div className="grid grid-cols-12 md:grid-cols-[2fr_2fr_2fr_2fr_1.1fr] gap-3 md:gap-4 shrink-0">
        
        {/* Nuevos Leads */}
        <div className="col-span-4 md:col-span-1 bg-white dark:bg-inmo-darkcard rounded-card p-3 md:py-4 md:pl-4 md:pr-12 lg:pr-16 shadow-soft flex flex-col items-center text-center h-full min-h-[96px] md:min-h-[110px] relative overflow-hidden">
          <div className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 text-gray-100 dark:text-white/[0.03] pointer-events-none z-0">
             <TrendingUp className="w-24 h-24 lg:w-32 lg:h-32" strokeWidth={2} />
          </div>
          <div className="flex-1 flex items-center justify-center w-full relative z-10">
            <span className="font-montserrat font-black text-4xl lg:text-5xl text-inmo-secondary dark:text-white">12</span>
          </div>
          <div className="mt-2 w-full flex flex-col items-center justify-end relative z-10">
            <p className="font-inter text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-tight">Nuevos Leads</p>
            <p className="font-inter text-[9px] md:text-[10px] font-bold text-inmo-accent uppercase tracking-wider leading-tight">Últimos 7 días</p>
          </div>
        </div>

        {/* Mensajes */}
        <div className="col-span-4 md:col-span-1 bg-white dark:bg-inmo-darkcard rounded-card p-3 md:py-4 md:pl-4 md:pr-12 lg:pr-16 shadow-soft flex flex-col items-center text-center h-full min-h-[96px] md:min-h-[110px] relative overflow-hidden">
          <div className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 text-gray-100 dark:text-white/[0.03] pointer-events-none z-0">
             <Bell className="w-24 h-24 lg:w-32 lg:h-32" strokeWidth={2} />
          </div>
          <div className="flex-1 flex items-center justify-center w-full relative z-10">
            <span className="font-montserrat font-black text-4xl lg:text-5xl text-inmo-secondary dark:text-white">4</span>
          </div>
          <div className="mt-2 w-full flex flex-col items-center justify-end relative z-10">
            <p className="font-inter text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-tight">Mensajes</p>
            <p className="font-inter text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-tight">Pendientes</p>
          </div>
        </div>

        {/* Botones Interactivos Mobile (Ocultos en Desktop) */}
        <div className="col-span-4 flex flex-col gap-2 md:hidden">
          <Button 
            onClick={() => setIsTopSheetOpen(true)}
            variant="accent"
            className="flex-1 !rounded-[20px] !flex-col !gap-1 !py-2 !h-auto"
            icon={<Podium className="w-7 h-7 text-white" strokeWidth={1.5} />}
          >
            <span className="font-inter font-medium text-xs text-white leading-tight text-center">Ranking</span>
          </Button>

          <Button 
            onClick={() => setIsPortafolioSheetOpen(true)}
            variant="secondary"
            className="flex-1 !rounded-[20px] !flex-col !gap-1 !py-2 !h-auto"
            icon={<Briefcase className="w-7 h-7 text-inmo-secondary dark:text-white" strokeWidth={1.5} />}
          >
            <span className="font-inter font-medium text-xs text-inmo-secondary dark:text-white leading-tight text-center">Portafolio</span>
          </Button>
        </div>

        {/* Visitas */}
        <div className="col-span-6 md:col-span-1 bg-white dark:bg-inmo-darkcard rounded-card p-4 md:py-4 md:pl-4 md:pr-12 lg:pr-16 shadow-soft flex flex-col relative h-full min-h-[96px] md:min-h-[110px] overflow-hidden">
          {/* Mobile view */}
          <div className="flex md:hidden flex-col justify-between h-full w-full relative z-10">
            <p className="text-body text-xs">Visitas</p>
            <div className="mt-1 flex items-center">
              <span className="font-montserrat font-black text-3xl text-inmo-secondary dark:text-white">1.2k</span>
              <div className="flex-1 flex flex-col items-center justify-center text-inmo-success">
                <TrendingUp className="w-7 h-7" />
                <p className="font-inter text-[10px] font-semibold mt-0.5">+15%</p>
              </div>
            </div>
          </div>
          {/* Desktop view */}
          <div className="hidden md:flex flex-col items-center text-center h-full w-full">
            <div className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 text-gray-100 dark:text-white/[0.03] pointer-events-none z-0">
              <TrendingUp className="w-24 h-24 lg:w-32 lg:h-32" strokeWidth={2} />
            </div>
            <div className="flex-1 flex items-center justify-center w-full relative z-10">
              <span className="font-montserrat font-black text-4xl lg:text-5xl text-inmo-secondary dark:text-white">1.2k</span>
            </div>
            <div className="mt-2 w-full flex flex-col items-center justify-end relative z-10">
              <p className="font-inter text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-tight">Visitas</p>
              <p className="font-inter text-[9px] md:text-[10px] font-bold text-inmo-success uppercase tracking-wider leading-tight">+15%</p>
            </div>
          </div>
        </div>

        {/* Favoritos */}
        <div className="col-span-6 md:col-span-1 bg-white dark:bg-inmo-darkcard rounded-card p-4 md:py-4 md:pl-4 md:pr-12 lg:pr-16 shadow-soft flex flex-col relative h-full min-h-[96px] md:min-h-[110px] overflow-hidden">
          {/* Mobile view */}
          <div className="flex md:hidden flex-col justify-between h-full w-full relative z-10">
            <p className="text-body text-xs">Favoritos</p>
            <div className="mt-1 flex items-center">
              <span className="font-montserrat font-black text-3xl text-inmo-secondary dark:text-white">142</span>
              <div className="flex-1 flex flex-col items-center justify-center text-inmo-accent">
                <Heart className="w-7 h-7 fill-inmo-accent" />
                <p className="font-inter text-[10px] font-semibold mt-0.5">+8%</p>
              </div>
            </div>
          </div>
          {/* Desktop view */}
          <div className="hidden md:flex flex-col items-center text-center h-full w-full">
            <div className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 text-gray-100 dark:text-white/[0.03] pointer-events-none z-0">
              <Heart className="w-24 h-24 lg:w-32 lg:h-32" strokeWidth={2} />
            </div>
            <div className="flex-1 flex items-center justify-center w-full relative z-10">
              <span className="font-montserrat font-black text-4xl lg:text-5xl text-inmo-secondary dark:text-white">142</span>
            </div>
            <div className="mt-2 w-full flex flex-col items-center justify-end relative z-10">
              <p className="font-inter text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-tight">Favoritos</p>
              <p className="font-inter text-[9px] md:text-[10px] font-bold text-inmo-accent uppercase tracking-wider leading-tight">+8%</p>
            </div>
          </div>
        </div>

        {/* Botones Interactivos Desktop (Lado Derecho) */}
        <div className="hidden md:flex flex-col gap-2 md:gap-3 md:col-span-1 h-full">
          <Button 
            onClick={() => setIsTopSheetOpen(true)}
            variant="accent"
            className="flex-1 !rounded-[20px] !flex-row !items-center !justify-center !gap-2 !py-0 shadow-glow hover:scale-[1.02] transition-transform w-full"
            icon={<Podium className="w-6 h-6 lg:w-7 lg:h-7 text-white" strokeWidth={1.5} />}
          >
            <span className="font-inter font-medium text-sm lg:text-base text-white">Ranking</span>
          </Button>

          <Button 
            onClick={() => setIsPortafolioSheetOpen(true)}
            variant="secondary"
            className="flex-1 !rounded-[20px] !flex-row !items-center !justify-center !gap-2 !py-0 shadow-soft bg-white dark:bg-inmo-darkcard hover:scale-[1.02] transition-transform w-full"
            icon={<Briefcase className="w-6 h-6 lg:w-7 lg:h-7 text-inmo-secondary dark:text-white" strokeWidth={1.5} />}
          >
            <span className="font-inter font-medium text-sm lg:text-base text-inmo-secondary dark:text-white">Portafolio</span>
          </Button>
        </div>
      </div>

      {/* 4. Mapa Interactivo (Crecido) */}
      <div className="flex-auto min-h-[160px] flex flex-col relative shrink">

        <div className="flex-1 w-full bg-gray-100 dark:bg-inmo-darktertiary rounded-[32px] relative overflow-hidden shadow-soft border-4 border-white dark:border-inmo-darkcard">
           
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
      </div>

      {/* BOTTOM SHEETS */}
      <BottomSheet isOpen={isTopSheetOpen} onClose={() => setIsTopSheetOpen(false)} title="Ranking Inmuebles">
        <div className="grid gap-4 grid-cols-1">
          {MOCK_PROPERTIES.map((property, idx) => (
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
      </BottomSheet>

      <BottomSheet isOpen={isPortafolioSheetOpen} onClose={() => setIsPortafolioSheetOpen(false)} title="Análisis de Portafolio">
        <div className="flex flex-col gap-3">
          
          {/* Card 1: Gauge (Venta vs Renta) */}
          <div className="bg-white dark:bg-inmo-darkcard rounded-card p-6 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col items-center">
            <p className="font-inter text-sm font-semibold text-gray-500 dark:text-gray-400 mb-8">Distribución del Inventario</p>
            
            <div className="relative w-full max-w-[260px] aspect-[2/1] flex justify-center items-end">
              <svg viewBox="0 0 100 50" className="absolute top-0 left-0 w-full h-full overflow-visible">
                {/* Background track */}
                <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="10" strokeLinecap="round" />
                {/* Foreground fill (80%) */}
                <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="currentColor" className="text-inmo-accent" strokeWidth="10" strokeLinecap="round" 
                  strokeDasharray="141.37" strokeDashoffset="28.27" /> 
              </svg>
              <div className="z-10 flex flex-col items-center mb-1">
                <span className="font-montserrat font-black text-5xl text-inmo-secondary dark:text-white leading-none">80%</span>
                <span className="font-inter text-xs font-bold text-inmo-accent mt-2 uppercase tracking-wide">Venta</span>
              </div>
            </div>
            
            <div className="w-full flex justify-between items-center mt-8 px-4">
              <div className="flex flex-col items-center">
                <span className="font-montserrat font-bold text-xl text-inmo-secondary dark:text-white">12</span>
                <span className="font-inter text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Activas Hoy</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-montserrat font-bold text-xl text-gray-400 dark:text-gray-500">15</span>
                <span className="font-inter text-[10px] font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-wider">Meta</span>
              </div>
            </div>
          </div>

          {/* Cards 2 & 3: Sparklines (Activas vs Pausadas) */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-4 md:p-5 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col justify-center relative overflow-hidden">
              <p className="font-inter text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Activas</p>
              <div className="flex items-center justify-between w-full">
                <span className="font-montserrat font-black text-3xl md:text-4xl text-inmo-secondary dark:text-white">12</span>
                <div className="flex-1 ml-3 relative h-14 md:h-16 flex items-center justify-center">
                  <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                    <path d="M 0 25 C 20 25, 30 10, 50 15 C 70 20, 80 5, 100 10" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span className="absolute -top-4 right-0 font-inter text-[9px] font-bold text-inmo-success">+15%</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-4 md:p-5 shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col justify-center relative overflow-hidden">
              <p className="font-inter text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Pausadas</p>
              <div className="flex items-center justify-between w-full">
                <span className="font-montserrat font-black text-3xl md:text-4xl text-inmo-secondary dark:text-white">3</span>
                <div className="flex-1 ml-3 relative h-14 md:h-16 flex items-center justify-center">
                  <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                    <path d="M 0 15 C 20 20, 40 10, 60 25 C 80 15, 90 25, 100 5" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span className="absolute -top-4 right-0 font-inter text-[9px] font-bold text-blue-500">-2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-1">
            <div className="bg-white dark:bg-inmo-darkcard rounded-card p-5 border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                    <Home className="w-5 h-5"/>
                  </div>
                  <span className="font-inter text-sm font-semibold text-inmo-secondary dark:text-white">Casas</span>
                </div>
                <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">8</span>
              </div>
              <div className="w-full h-px bg-gray-50 dark:bg-inmo-darktertiary"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
                    <Building2 className="w-5 h-5"/>
                  </div>
                  <span className="font-inter text-sm font-semibold text-inmo-secondary dark:text-white">Departamentos</span>
                </div>
                <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">5</span>
              </div>
              <div className="w-full h-px bg-gray-50 dark:bg-inmo-darktertiary"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                    <MapPin className="w-5 h-5"/>
                  </div>
                  <span className="font-inter text-sm font-semibold text-inmo-secondary dark:text-white">Terrenos</span>
                </div>
                <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">2</span>
              </div>
            </div>
          </div>

        </div>
      </BottomSheet>

      {/* Notificaciones Bottom Sheet (Mobile Only) */}
      <div className="md:hidden">
        <BottomSheet isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} title="Notificaciones">
          <div className="flex flex-col">
            {MOCK_NOTIFICATIONS.map(n => (
              <div key={n.id} className="py-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${n.unread ? 'bg-inmo-accent' : 'bg-transparent'}`} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-inmo-secondary dark:text-white">{n.title}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.body}</span>
                  <span className="text-[10px] text-gray-400 mt-2">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </BottomSheet>
      </div>

    </div>
  );
};

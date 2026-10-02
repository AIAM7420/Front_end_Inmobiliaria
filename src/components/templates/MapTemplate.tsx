import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Globe, Ghost, SlidersHorizontal, Search, MapPin } from 'lucide-react';
import { APIProvider, Map, Marker, useApiLoadingStatus, APILoadingStatus } from '@vis.gl/react-google-maps';
import { SearchBar } from '../molecules/SearchBar';
import { FloatingFilterButton } from '../atoms/FloatingFilterButton';
import { IconButton } from '../atoms/IconButton';
import { Button } from '../atoms/Button';
import { PropertyCard } from '../molecules/PropertyCard';
import { CategoryPills } from '../molecules/CategoryPills';
import type { PropertyCategory } from '../molecules/CategoryPills';
import { FilterDropdown, type FilterState } from '../molecules/FilterDropdown';
import { BottomSheet } from '../organisms/BottomSheet';
import { SidePanel } from '../organisms/SidePanel';
import { PropertyDetailView } from '../organisms/PropertyDetailView';
import { PropertyCardSkeleton } from '../molecules/PropertyCardSkeleton';
import { AsesorChat } from '../organisms/AsesorChat';
import { useAppContext } from '../../context/AppContext';
import { MOCK_PROPERTIES } from '../../data/mockProperties';
import { LocationTag } from '../molecules/LocationTag';
import { createSvgIcon, mapStyles } from '../../utils/mapStyles';


import { useMap } from '@vis.gl/react-google-maps';

export interface MapTemplateProps {}

const CustomOverlay = ({ position, children, zIndex = 0 }: { position: google.maps.LatLngLiteral, children: React.ReactNode, zIndex?: number }) => {
  const map = useMap();
  const [container] = useState(() => {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    return div;
  });

  useEffect(() => {
    if (!map || !window.google) return;
    let overlay: any;
    
    class HTMLOverlay extends window.google.maps.OverlayView {
      onAdd() {
        const panes = this.getPanes();
        if (panes) {
          panes.overlayMouseTarget.appendChild(container);
          container.style.zIndex = String(zIndex);
        }
      }
      draw() {
        const projection = this.getProjection();
        if (projection) {
          const pos = projection.fromLatLngToDivPixel(new window.google.maps.LatLng(position));
          if (pos) {
            container.style.left = pos.x + 'px';
            container.style.top = pos.y + 'px';
            container.style.transform = 'translate(-50%, -100%)';
          }
        }
      }
      onRemove() {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }
    }
    
    overlay = new HTMLOverlay();
    overlay.setMap(map);
    return () => overlay.setMap(null);
  }, [map, position.lat, position.lng, zIndex, container]);

  return createPortal(
    <div onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>, 
    container
  );
};

const InnerMap = React.memo(({ properties, onMarkerClick, isDarkMode, isWireframeMode }: { properties: typeof MOCK_PROPERTIES, onMarkerClick: (id: number) => void, isDarkMode?: boolean, isWireframeMode?: boolean }) => {
  const status = useApiLoadingStatus();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [zoom, setZoom] = useState(() => window.innerWidth < 768 ? 14 : 13);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-inmo-darkbg p-6 text-center pt-24 relative z-0">
        <Globe className="w-16 h-16 text-inmo-accent mb-4 opacity-50" />
        <h2 className="text-subtitle mb-2">Falta API Key</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Añade tu <b>Maps Demo Key</b> en el archivo <code>.env</code> como <code>VITE_GOOGLE_MAPS_API_KEY</code> para visualizar el mapa interactivo.
        </p>
      </div>
    );
  }

  const showOverlay = status !== APILoadingStatus.LOADED || isWireframeMode;

  

  

  return (
    <div className="relative w-full h-full bg-gray-100 dark:bg-inmo-darkbg">
      {status === APILoadingStatus.LOADED && (
        <Map
          defaultCenter={{ lat: 21.135, lng: -101.680 }}
          defaultZoom={isMobile ? 14 : 13}
          onCameraChanged={(ev: any) => setZoom(ev.detail.zoom)}
          disableDefaultUI={true}
          gestureHandling="greedy"
          styles={isDarkMode ? mapStyles.dark : mapStyles.light}
          padding={{ bottom: 100 }}
          className="w-full h-full"
        >
          {properties.map(p => {
            const minicardThreshold = isMobile ? 14 : 13;
            if (zoom >= minicardThreshold) {
              return (
                <CustomOverlay 
                  key={`custom-${p.id}`} 
                  position={{ lat: p.lat, lng: p.lng }} 
                  zIndex={10}
                >
                  <div 
                    onClick={() => onMarkerClick(p.id)}
                    className="bg-white dark:bg-inmo-darkcard p-1.5 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 flex flex-row w-[170px] items-center gap-2 hover:scale-105 transition-transform cursor-pointer relative"
                  >
                    <img src={p.image} alt={p.title} className="w-14 h-14 object-cover rounded-[10px] shrink-0" />
                    <div className="flex-1 flex flex-col gap-0.5 justify-center pr-1 min-w-0">
                      <p className="text-[10px] font-bold text-inmo-secondary dark:text-white line-clamp-2 leading-tight text-left font-inter">
                        {p.title}
                      </p>
                      <div className="flex justify-start items-baseline gap-0.5 mt-0.5">
                        <span className="text-[9px] font-bold text-inmo-accent">$</span>
                        <span className="text-xs font-black text-inmo-secondary dark:text-white tracking-tight truncate">{p.price.toLocaleString('es-MX')}</span>
                      </div>
                    </div>
                  </div>
                </CustomOverlay>
              );
            }
            return (
              <Marker 
                key={p.id} 
                position={{ lat: p.lat, lng: p.lng }} 
                onClick={() => onMarkerClick(p.id)}
                icon={{ url: createSvgIcon(p.type, zoom) }}
              />
            );
          })}
        </Map>
      )}

      {/* OVERLAY DE CARGA */}
      <div 
        className={`absolute inset-0 z-50 bg-gray-100 dark:bg-inmo-darkbg flex flex-col items-center justify-center pt-24 transition-opacity duration-700 pointer-events-none ${showOverlay ? 'opacity-100' : 'opacity-0'}`}
      >
        <style>{`
          @keyframes slideLoading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
        <img
          src={isDarkMode ? "/inmo white.png" : "/inmo.png"}
          alt="INMO"
          className="h-12 mb-8 object-contain animate-pulse"
        />
        <div className="w-48 h-1 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden relative">
          <div 
            className="absolute top-0 bottom-0 w-1/2 bg-inmo-accent rounded-full"
            style={{ animation: 'slideLoading 1.5s ease-in-out infinite' }}
          ></div>
        </div>
      </div>
    </div>
  );
});

InnerMap.displayName = 'InnerMap';

export const MapTemplate: React.FC<MapTemplateProps> = () => {
  const { isDarkMode } = useAppContext();
  
  const [isWireframeMode, setIsWireframeMode] = useState(true);

  useEffect(() => {
    // La animaciÃ³n de la barra dura 1.5s, asÃ­ que le damos tiempo de terminar
    // para que la espera se sienta "Ãºtil"
    const timer = setTimeout(() => setIsWireframeMode(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<PropertyCategory | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setIsMobileSearchOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);
  
  const [isViewingProfile, setIsViewingProfile] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  const { globalSearchQuery, setGlobalSearchQuery, globalFilters, setGlobalFilters } = useAppContext();

  const filteredProperties = MOCK_PROPERTIES.filter(p => {
    // 1. Tipo de propiedad
    if (activeFilter !== null && p.type !== activeFilter) return false;
    
    // 2. Búsqueda por texto (título, ubicación)
    if (globalSearchQuery) {
      const q = globalSearchQuery.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) {
        return false;
      }
    }

    // 3. Filtros avanzados
    if (globalFilters) {
      if (globalFilters.location && !p.location.toLowerCase().includes(globalFilters.location.toLowerCase())) {
        return false;
      }
      
      if (globalFilters.priceRange) {
        // Lógica súper básica para mock (convertir price string a num)
        const priceNum = parseInt(p.price.replace(/\D/g, '')) || 0;
        if (globalFilters.priceRange === '0-1M' && priceNum > 1000000) return false;
        if (globalFilters.priceRange === '1M-3M' && (priceNum < 1000000 || priceNum > 3000000)) return false;
        if (globalFilters.priceRange === '3M+' && priceNum < 3000000) return false;
      }
    }

    return true;
  });

  // Ordenamiento
  if (globalFilters?.sortBy) {
    filteredProperties.sort((a, b) => {
      const pA = parseInt(a.price.replace(/\D/g, '')) || 0;
      const pB = parseInt(b.price.replace(/\D/g, '')) || 0;
      if (globalFilters.sortBy === 'price-asc') return pA - pB;
      if (globalFilters.sortBy === 'price-desc') return pB - pA;
      return 0; // recent/relevance mock
    });
  }

  const displayedProperties = selectedPropertyId ? filteredProperties.filter(p => p.id === selectedPropertyId) : filteredProperties;

  // Mostrar estado vacío automáticamente si no hay propiedades tras el filtrado
  useEffect(() => {
    if (!isWireframeMode && filteredProperties.length === 0) {
      setIsSheetOpen(true);
      setSelectedPropertyId(null);
    }
  }, [filteredProperties.length, isWireframeMode]);

  const handleFilterChange = (newFilter: PropertyCategory | null) => {
    setActiveFilter(newFilter);
    if (selectedPropertyId) {
      setSelectedPropertyId(null);
      setIsViewingProfile(false);
      setIsChatting(false);
    }
  };

  const handleMarkerClick = (id: number) => {
    setSelectedPropertyId(id);
    setIsViewingProfile(false);
    setIsChatting(false);
    setIsSheetOpen(true);
  };

  const handleCoincidenciasClick = () => {
    setSelectedPropertyId(null);
    setIsViewingProfile(false);
    setIsChatting(false);
    setIsSheetOpen(true);
  };

  const renderSheetContent = () => (
    selectedPropertyId ? (
      isChatting ? (
        <div className="w-full h-full bg-white dark:bg-inmo-darkcard overflow-hidden">
          <AsesorChat hideHeader={true} asesorName="Daniel Ayomide" initialMessage="¡Hola! Veo que te interesa la propiedad, ¿en qué te puedo ayudar?" />
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden flex flex-col">
          <PropertyDetailView 
            property={displayedProperties[0]} 
            layout="vertical"
            showAsesorProfile={isViewingProfile}
            onShowAsesorProfileChange={setIsViewingProfile}
            onContactClick={() => setIsChatting(true)}
          />
        </div>
      )
    ) : (
      <>
        <div className={`transition-all duration-500 ${
          displayedProperties.length === 0 && !isWireframeMode
            ? 'flex flex-col items-center justify-center py-10 pb-12 w-full'
            : 'grid gap-4 grid-cols-1'
        }`}>
          {isWireframeMode ? (
            Array.from({ length: 4 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))
          ) : displayedProperties.length > 0 ? (
            displayedProperties.map((p, i) => (
              <div key={p.id} className="animate-in fade-in zoom-in-95" style={{ animationDelay: `${i * 50}ms` }}>
                <PropertyCard
                  image={p.image}
                  title={p.title}
                  location={p.location}
                  price={p.price}
                  beds={p.beds}
                  baths={p.baths}
                  sqft={p.sqft}
                  tags={(p as any).tags}
                  onClick={() => setSelectedPropertyId(p.id)}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500 max-w-sm mx-auto px-4 mt-10">
              <div className="w-20 h-20 mb-5 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center shadow-sm">
                <Ghost className="w-8 h-8 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-inmo-secondary dark:text-white mb-2">Sin resultados</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Prueba explorando otra área del mapa o modificando tus filtros actuales.</p>
            </div>
          )}
        </div>
      </>
    )
  );

  return (
    <>
      {/* INTERACTIVE MAP BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-auto [&_.gm-style]:!font-inter">
        {!apiKey ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-inmo-darkbg p-6 text-center pt-24 relative z-0">
            <Globe className="w-16 h-16 text-inmo-accent mb-4 opacity-50" />
            <h2 className="text-subtitle mb-2">No API Key Found</h2>
          </div>
        ) : (
          <APIProvider apiKey={apiKey}>
            <InnerMap properties={filteredProperties} onMarkerClick={handleMarkerClick} isDarkMode={isDarkMode} isWireframeMode={isWireframeMode} />
          </APIProvider>
        )}
      </div>

      {/* TOP OVERLAYS (ALL SCREENS) */}
      <div className="fixed top-4 left-4 right-4 md:top-28 md:left-6 md:right-auto md:w-[350px] z-50 flex flex-col items-center md:items-start gap-3 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-full flex flex-col items-center md:items-start gap-3 pointer-events-auto">
          
          {/* Fila principal (Filtros / Buscador) */}
          <div ref={searchContainerRef} className="relative flex items-stretch gap-2 w-full max-w-md transition-all duration-300">
            
            {/* Contenido en Móvil cuando NO hay búsqueda, y SIEMPRE en Desktop */}
            <div className={`flex items-stretch gap-2 w-full transition-all duration-300 ${isMobileSearchOpen ? 'opacity-0 scale-95 pointer-events-none absolute inset-0' : 'opacity-100 scale-100 relative'}`}>
              <CategoryPills 
                activeFilter={activeFilter} 
                onSelectFilter={handleFilterChange} 
                className="flex-1 m-0"
              />



              {/* Botón de Búsqueda (Solo Móvil) */}
              <div className="relative md:hidden flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-full w-[52px] shrink-0">
                <IconButton 
                  onClick={() => setIsMobileSearchOpen(true)}
                  icon={<Search className="w-5 h-5 text-inmo-secondary dark:text-white" strokeWidth={2.5} />}
                  variant="ghost"
                  className="w-full h-full hover:!bg-transparent !rounded-full"
                />
              </div>
            </div>

            {/* Barra de Búsqueda (Solo Móvil) */}
            <div className={`md:hidden flex items-stretch gap-2 w-full transition-all duration-300 ${isMobileSearchOpen ? 'opacity-100 scale-100 relative' : 'opacity-0 scale-95 pointer-events-none absolute inset-0'}`}>
               <div className="flex-1 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-[32px] p-1.5 transition-all duration-300 h-[52px]">
                 <SearchBar 
                   value={globalSearchQuery}
                   onSubmit={setGlobalSearchQuery}
                   autoFocus={isMobileSearchOpen} 
                   placeholder="Buscar..." 
                   size="slim" 
                   glass={false} 
                   className="w-full !h-[40px] !shadow-none !border-none !bg-transparent dark:!bg-transparent" 
                 />
               </div>
               
               <div className="relative shrink-0">
                 <IconButton 
                   onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                   icon={<SlidersHorizontal className="w-5 h-5" strokeWidth={2} />}
                   variant="secondary"
                   className={`w-[52px] h-[52px] !bg-white/60 dark:!bg-black/60 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] !rounded-full ${isFiltersOpen ? 'text-inmo-accent' : 'text-gray-500 dark:text-gray-400'}`}
                 />
                 <div className="absolute right-0 top-full mt-2 z-50">
                   <FilterDropdown 
                     isOpen={isFiltersOpen && isMobileSearchOpen && !isSheetOpen} 
                     onApply={(filters) => {
                       if (filters) setGlobalFilters(filters);
                       setIsFiltersOpen(false);
                     }}
                     onClose={() => setIsFiltersOpen(false)} 
                   />
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* LOCATION TAG (TOP RIGHT DESKTOP) */}
      <div className="hidden md:flex fixed top-28 right-6 z-40 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
        <div className="pointer-events-auto flex flex-col justify-center w-[250px] shrink-0">
          <LocationTag city="León" state="Guanajuato, México" />
        </div>
      </div>

      {/* DESKTOP SEARCH BAR (HUGE) - EN LA PARTE INFERIOR */}
      <div className="hidden md:flex fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl z-20 px-6 pointer-events-none">
         <div className="w-full pointer-events-auto flex gap-4 items-center">
           <SearchBar 
              value={globalSearchQuery}
              onSubmit={setGlobalSearchQuery}
              placeholder="Encuentra propiedades en cualquier ubicacion..." 
              size="xl" 
              glass 
              className="flex-1 shadow-2xl" 
            />
            <div className="relative shrink-0">
               <FloatingFilterButton 
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)} 
                  size="large"
                />
               <FilterDropdown 
                  isOpen={isFiltersOpen && !isSheetOpen && !isMobileSearchOpen} 
                  onApply={(filters) => {
                    if (filters) setGlobalFilters(filters);
                    setIsFiltersOpen(false);
                  }}
                  onClose={() => setIsFiltersOpen(false)}
                  className="!top-auto !bottom-full !mb-4 !mt-0 !origin-bottom-right"
                />
            </div>
         </div>
      </div>

      {/* BOTTOM OVERLAYS */}
      <div className="fixed bottom-[130px] left-0 right-0 z-10 flex flex-col items-center gap-3 px-6 pointer-events-none">
        {/* Results Pill */}
        <div className="flex justify-center w-full pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
          <Button 
            onClick={filteredProperties.length === 0 ? undefined : handleCoincidenciasClick}
            disabled={filteredProperties.length === 0}
            className={`px-6 py-2.5 !text-xs !shadow-lg transition-all duration-300 ${filteredProperties.length === 0 ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300 border-none' : ''}`}
          >
            {filteredProperties.length === 0 ? 'Sin resultados' : `Ver ${filteredProperties.length} coincidencia${filteredProperties.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>

      {/* BOTTOM SHEET (Results) */}
      <div className="md:hidden">
        <BottomSheet 
          isOpen={isSheetOpen} 
          onClose={(isViewingProfile || isChatting) ? undefined : () => setIsSheetOpen(false)}
          onBack={isChatting ? () => setIsChatting(false) : isViewingProfile ? () => setIsViewingProfile(false) : undefined}
          title={isChatting ? "Chat con Asesor" : isViewingProfile ? "Perfil del Asesor" : selectedPropertyId 
            ? undefined 
            : filteredProperties.length === 0 ? undefined : `${filteredProperties.length} Coincidencia${filteredProperties.length !== 1 ? 's' : ''}`
          }
          noPadding={!!selectedPropertyId || isChatting}
          isHero={!!selectedPropertyId && !isViewingProfile && !isChatting}
          fullHeight={!!selectedPropertyId}
        >
          {renderSheetContent()}
        </BottomSheet>
      </div>

      {/* DESKTOP SIDE PANEL */}
      <SidePanel 
        isOpen={isSheetOpen} 
        onClose={(isViewingProfile || isChatting) ? undefined : () => setIsSheetOpen(false)}
        onBack={isChatting ? () => setIsChatting(false) : isViewingProfile ? () => setIsViewingProfile(false) : undefined}
        title={isChatting ? "Chat con Asesor" : isViewingProfile ? "Perfil del Asesor" : selectedPropertyId 
          ? undefined 
          : filteredProperties.length === 0 ? undefined : `${filteredProperties.length} Coincidencia${filteredProperties.length !== 1 ? 's' : ''}`
        }
        noPadding={!!selectedPropertyId || isChatting}
        compact={filteredProperties.length === 0 && !selectedPropertyId}
      >
        {renderSheetContent()}
      </SidePanel>
    </>
  );
};








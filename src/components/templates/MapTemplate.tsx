import React, { useState, useEffect } from 'react';
import { Globe, Ghost, SlidersHorizontal } from 'lucide-react';
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

export interface MapTemplateProps {}

const createSvgIcon = (priceText: string, propertyType: string) => {
  const bgColor = '%23FA003F';
  const textColor = '%23FFFFFF';
  const borderColor = '%23FA003F';
  
  let iconPaths = '';
  if (propertyType === 'casa') {
    iconPaths = '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>';
  } else if (propertyType === 'departamento') {
    iconPaths = '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>';
  } else if (propertyType === 'terreno') {
    iconPaths = '<path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L14 3l-1.4 2.5"/>';
  } else {
    iconPaths = '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="35"><rect x="0" y="0" width="100" height="35" rx="17.5" fill="${bgColor}" stroke="${borderColor}" stroke-width="1.25"/><g transform="translate(12, 9.5) scale(0.666)" fill="none" stroke="${textColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPaths}</g><text x="32" y="23.5" font-family="sans-serif" font-size="15" font-weight="bold" fill="${textColor}" text-anchor="start">${priceText}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${svg}`;
};

const formatMarkerPrice = (price: number) => {
  if (price >= 1000000) {
    const formatted = (price / 1000000).toFixed(1);
    return `$${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}M`;
  }
  if (price >= 1000) {
    const formatted = (price / 1000).toFixed(1);
    return `$${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}k`;
  }
  return `$${price}`;
};

const InnerMap = React.memo(({ properties, onMarkerClick, isDarkMode, isWireframeMode }: { properties: typeof MOCK_PROPERTIES, onMarkerClick: (id: number) => void, isDarkMode?: boolean, isWireframeMode?: boolean }) => {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-inmo-darkbg p-6 text-center pt-24 relative z-0">
        <Globe className="w-16 h-16 text-inmo-accent mb-4 opacity-50" />
        <h2 className="text-subtitle mb-2">Falta API Key</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          AÃ±ade tu <b>Maps Demo Key</b> en el archivo <code>.env</code> como <code>VITE_GOOGLE_MAPS_API_KEY</code> para visualizar el mapa interactivo.
        </p>
      </div>
    );
  }

  const showOverlay = status !== APILoadingStatus.LOADED || isWireframeMode;

  const lightStyles = [
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] }
  ];

  const darkStyles = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
    { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
  ];

  return (
    <div className="relative w-full h-full bg-gray-100 dark:bg-inmo-darkbg">
      {status === APILoadingStatus.LOADED && (
        <Map
          defaultCenter={{ lat: 21.135, lng: -101.680 }}
          defaultZoom={13}
          disableDefaultUI={true}
          gestureHandling="greedy"
          styles={isDarkMode ? darkStyles : lightStyles}
          padding={{ bottom: 100 }}
          className="w-full h-full"
        >
          {properties.map(p => (
            <Marker 
              key={p.id} 
              position={{ lat: p.lat, lng: p.lng }} 
              onClick={() => onMarkerClick(p.id)}
              icon={{ url: createSvgIcon(formatMarkerPrice(p.price), p.type) }}
            />
          ))}
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
            ? 'flex flex-col items-center justify-center py-20 w-full h-full'
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

              {/* Botón de Filtro (Solo Desktop) */}
              <div className="relative hidden md:block">
                <FloatingFilterButton 
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)} 
                  size="small"
                />
                <FilterDropdown 
                  isOpen={isFiltersOpen && !isSheetOpen && !isMobileSearchOpen} 
                  onApply={(filters) => {
                    if (filters) setGlobalFilters(filters);
                    setIsFiltersOpen(false);
                  }}
                  onClose={() => setIsFiltersOpen(false)}
                />
              </div>

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

      {/* DESKTOP SEARCH BAR (HUGE) - EN LA PARTE INFERIOR */}
      <div className="hidden md:flex fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl z-20 px-6 pointer-events-none">
         <div className="w-full pointer-events-auto">
           <SearchBar 
              value={globalSearchQuery}
              onSubmit={setGlobalSearchQuery}
              placeholder="Encuentra propiedades en cualquier ubicacion..." 
              size="xl" 
              glass 
              className="w-full shadow-2xl" 
            />
         </div>
      </div>

      {/* BOTTOM OVERLAYS */}
      <div className="fixed bottom-[130px] left-0 right-0 z-10 flex flex-col items-center gap-3 px-6 pointer-events-none">
        {/* Results Pill */}
        <div className="flex justify-center w-full pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
          <Button 
            onClick={handleCoincidenciasClick}
            className={`px-6 py-2.5 !text-xs !shadow-lg transition-all duration-300`}
          >
            Ver {filteredProperties.length} coincidencia{filteredProperties.length !== 1 ? 's' : ''}
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
            : `${filteredProperties.length} Coincidencia${filteredProperties.length !== 1 ? 's' : ''}`
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
          : `${filteredProperties.length} Coincidencia${filteredProperties.length !== 1 ? 's' : ''}`
        }
        noPadding={!!selectedPropertyId || isChatting}
      >
        {renderSheetContent()}
      </SidePanel>
    </>
  );
};

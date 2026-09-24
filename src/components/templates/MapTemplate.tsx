import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { APIProvider, Map, Marker, useApiLoadingStatus, APILoadingStatus } from '@vis.gl/react-google-maps';
import { SearchBar } from '../molecules/SearchBar';
import { FloatingFilterButton } from '../atoms/FloatingFilterButton';
import { Button } from '../atoms/Button';
import { PropertyCard } from '../molecules/PropertyCard';
import { CategoryPills } from '../molecules/CategoryPills';
import type { PropertyCategory } from '../molecules/CategoryPills';
import { FilterDropdown } from '../molecules/FilterDropdown';
import { BottomSheet } from '../organisms/BottomSheet';
import { SidePanel } from '../organisms/SidePanel';
import { PropertyDetailView } from '../organisms/PropertyDetailView';
import { PropertyCardSkeleton } from '../molecules/PropertyCardSkeleton';
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
  const [activeFilter, setActiveFilter] = useState<PropertyCategory>('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const filteredProperties = MOCK_PROPERTIES.filter(p => activeFilter === 'all' || p.type === activeFilter);
  const displayedProperties = selectedPropertyId ? filteredProperties.filter(p => p.id === selectedPropertyId) : filteredProperties;

  const handleFilterChange = (newFilter: PropertyCategory) => {
    setActiveFilter(newFilter);
    if (selectedPropertyId) {
      setSelectedPropertyId(null);
    }
  };

  const handleMarkerClick = (id: number) => {
    setSelectedPropertyId(id);
    setIsSheetOpen(true);
  };

  const handleCoincidenciasClick = () => {
    setSelectedPropertyId(null);
    setIsSheetOpen(true);
  };

  const renderSheetContent = () => (
    selectedPropertyId ? (
      <PropertyDetailView property={displayedProperties[0]} />
    ) : (
      <>
        <div className="grid gap-4 grid-cols-1">
          {isWireframeMode ? (
            Array.from({ length: 4 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))
          ) : (
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
      <div className="absolute top-4 left-4 right-4 md:top-28 md:left-6 md:right-auto md:w-[350px] z-50 flex flex-col items-center md:items-start gap-3 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-full flex flex-col items-center md:items-start gap-3 pointer-events-auto">
          <div className={`flex items-stretch gap-2 w-full max-w-md transition-all duration-300 ${isSheetOpen ? '-translate-y-24 opacity-0 md:translate-y-0 md:opacity-100' : 'translate-y-0 opacity-100'}`}>
            <CategoryPills 
              activeFilter={activeFilter} 
              onSelectFilter={handleFilterChange} 
              className="flex-1 m-0"
            />
            <FloatingFilterButton 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)} 
              size="small"
            />
          </div>

          <FilterDropdown isOpen={isFiltersOpen && !isSheetOpen} onApply={() => setIsFiltersOpen(false)} className="max-w-md md:origin-top-left" />
        </div>
      </div>

      {/* DESKTOP SEARCH BAR (HUGE) - EN LA PARTE INFERIOR */}
      <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl z-20 px-6 pointer-events-none">
         <div className="w-full pointer-events-auto">
           <SearchBar 
              placeholder="Encuentra propiedades en cualquier ubicacion..." 
              size="xl" 
              glass 
              className="w-full shadow-2xl" 
            />
         </div>
      </div>

      {/* BOTTOM OVERLAYS */}
      <div className="absolute bottom-[130px] left-0 right-0 z-10 flex flex-col items-center gap-3 px-6 transition-all pointer-events-none">
        {/* Results Pill */}
        <div className="flex justify-center w-full pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
          <Button 
            onClick={handleCoincidenciasClick}
            className={`px-6 py-2.5 !text-xs !shadow-lg ${isSheetOpen ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
          >
            Ver {filteredProperties.length} coincidencia{filteredProperties.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>

      {/* BOTTOM SHEET (Results) */}
      <div className="md:hidden">
        <BottomSheet 
          isOpen={isSheetOpen} 
          onClose={() => setIsSheetOpen(false)}
          title={selectedPropertyId 
            ? undefined 
            : `${filteredProperties.length} Coincidencia${filteredProperties.length !== 1 ? 's' : ''}`
          }
          noPadding={!!selectedPropertyId}
          isHero={!!selectedPropertyId}
        >
          {renderSheetContent()}
        </BottomSheet>
      </div>

      {/* DESKTOP SIDE PANEL */}
      <SidePanel 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)}
        title={selectedPropertyId 
          ? undefined 
          : `${filteredProperties.length} Coincidencia${filteredProperties.length !== 1 ? 's' : ''}`
        }
      >
        {renderSheetContent()}
      </SidePanel>
    </>
  );
};

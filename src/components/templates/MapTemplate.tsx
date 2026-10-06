import { useEffect, useMemo, useRef, useState } from 'react';
import { useDesktopViewport } from '../../hooks/useDesktopViewport';
import { usePropertySelection } from '../../hooks/usePropertySelection';
import { createPortal } from 'react-dom';
import { Globe, CloudOff, RefreshCw, MapPinOff } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { CatalogoItem, CriteriosBusqueda, PropiedadPublica } from '../../integrations/backend/types';
import { chatbotCriteria } from '../../integrations/backend/chatbotCriteria';
import { useThemedMap } from '../molecules/useThemedMap';
import { approximateZoneCenter } from '../../integrations/backend/zoneGeometry';
import { useChatbotQuery } from '../../integrations/backend/hooks/useNlp';
import { useGetCatalog, useGetPhotos, useGetPhotoUrl } from '../../integrations/backend/hooks/useProperties';
import { useSearchInfinite } from '../../integrations/backend/hooks/useSearch';
import { useAppContext } from '../../context/AppContext';
import { SearchBar } from '../molecules/SearchBar';
import { FloatingFilterButton } from '../atoms/FloatingFilterButton';
import { Button } from '../atoms/Button';
import { Skeleton } from '../atoms/Skeleton';
import { CategoryPills } from '../molecules/CategoryPills';
import type { PropertyCategory } from '../molecules/CategoryPills';
import { CategorySelector } from '../molecules/CategorySelector';
import { FilterDropdown } from '../molecules/FilterDropdown';
import { BottomSheet } from '../organisms/BottomSheet';
import { SidePanel } from '../organisms/SidePanel';
import { PropertyDetailView } from '../organisms/PropertyDetailView';
import { ConnectedPropertyCard } from '../organisms/ConnectedPropertyCard';
import { PropertyCardSkeleton } from '../molecules/PropertyCardSkeleton';
import { EmptyState } from '../molecules/EmptyState';

export interface MapTemplateProps {}



const createSvgIcon = (propertyType: string, zoom: number = 13) => {
  const bgColor = '#FA003F';
  const textColor = '#FFFFFF';
  const borderColor = '#FA003F';
  
  let iconPaths = '';
  const type = propertyType.toLowerCase().replace(/[-_ ]/g, '');

  if (type === 'inmo') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="30" viewBox="0 0 60 30"> <rect x="2" y="2" width="56" height="20" rx="10" fill="${bgColor}" stroke="${borderColor}" stroke-width="2"/> <polygon points="30,28 25,22 35,22" fill="${bgColor}" /> <text x="30" y="16" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="${textColor}" text-anchor="middle">INMO</text> </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  } else if (type === 'casa') {
    iconPaths = '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>';
  } else if (type === 'departamento') {
    iconPaths = '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>';
  } else if (type === 'terreno') {
    iconPaths = '<path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L14 3l-1.4 2.5"/>';
  } else if (type === 'localcomercial' || type === 'local') {
    iconPaths = '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>';
  } else if (type === 'oficina') {
    iconPaths = '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>';
  } else if (type === 'bodega') {
    iconPaths = '<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect width="12" height="12" x="6" y="10"/>';
  } else {
    iconPaths = '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>';
  }

  if (zoom < 12) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="6" fill="${bgColor}" stroke="${textColor}" stroke-width="2"/></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <path d="M24 44s14-14 14-24a14 14 0 0 0-28 0c0 10 14 24 14 24z" fill="${bgColor}" stroke="${borderColor}" stroke-width="2"/>
    <g transform="translate(12, 8)" fill="none" stroke="${textColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${iconPaths}
    </g>
  </svg>`;
  
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};


function PropertyMarker({ property, propertyType, position, map, onMarkerClick }: { property: PropiedadPublica, propertyType: string, position: { lat: number, lng: number }, map: mapboxgl.Map, onMarkerClick: (id: string) => void }) {
  const [element] = useState(() => {
    const el = document.createElement('button');
    el.type = 'button';
    el.setAttribute('aria-label', `${property.titulo} · zona aproximada`);
    // Mapbox owns this element's transform; animate only its inner content.
    el.className = 'cursor-pointer z-10';
    return el;
  });

  useEffect(() => {
    const select = (event: MouseEvent) => { event.stopPropagation(); onMarkerClick(property.id); };
    element.addEventListener('click', select);
    return () => element.removeEventListener('click', select);
  }, [element, property.id, onMarkerClick]);

  useEffect(() => {
    const marker = new mapboxgl.Marker({ element })
      .setLngLat([position.lng, position.lat])
      .addTo(map);
    element.setAttribute('role', 'button');
    return () => { marker.remove(); };
  }, [map, element, position.lat, position.lng]);

  const [isZoomed, setIsZoomed] = useState(() => map.getZoom() >= 10);
  useEffect(() => {
    const handleZoom = () => setIsZoomed(map.getZoom() >= 10);
    map.on('zoom', handleZoom);
    return () => { map.off('zoom', handleZoom); };
  }, [map]);

  const publicPhotos = useGetPhotos(property.id, true);
  const firstPhotoId = publicPhotos.data?.[0]?.id ?? '';
  const publicCover = useGetPhotoUrl(property.id, firstPhotoId, true);
  const priceFmt = Number(property.precio).toLocaleString('es-MX');

  return createPortal(
    <div className="hover:scale-105 transition-transform origin-bottom">
      {isZoomed ? (
        <div className="bg-white dark:bg-inmo-darkcard p-1.5 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 flex flex-row w-[170px] items-center gap-2 relative">
        {publicCover.data?.url ? (
           <img src={publicCover.data.url} alt={property.titulo} className="w-14 h-14 object-cover rounded-[10px] shrink-0" />
        ) : (
           <div className="w-14 h-14 bg-gray-200 dark:bg-inmo-darktertiary rounded-[10px] shrink-0 animate-pulse" />
        )}
        <div className="flex-1 flex flex-col gap-0.5 justify-center pr-1 min-w-0">
          <p className="text-[10px] font-bold text-inmo-secondary dark:text-white line-clamp-2 leading-tight text-left font-inter">
            {property.titulo}
          </p>
          <div className="flex justify-start items-baseline gap-0.5 mt-0.5">
            <span className="text-[9px] font-bold text-inmo-accent">$</span>
            <span className="text-xs font-black text-inmo-secondary dark:text-white tracking-tight truncate">{priceFmt}</span>
          </div>
        </div>
      </div>
        ) : (
      <img src={createSvgIcon(propertyType, map.getZoom())} alt={property.titulo} title={`${property.titulo} · zona aproximada`} className="w-12 h-12 drop-shadow-md" style={{ transform: 'translate(0, -25%)' }} />
      )}
    </div>,
    element
  );
}


function InnerMap({ properties, typesData, onMarkerClick, isDarkMode, token }: {
  properties: PropiedadPublica[];
  typesData: CatalogoItem[];
  onMarkerClick: (id: string) => void;
  isDarkMode: boolean;
  token: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { map, status, styleRevision, retry } = useThemedMap(containerRef, token, isDarkMode);
  const markerProperties = useMemo(() => properties.flatMap((property) => {
    const position = approximateZoneCenter(property.zona_geojson);
    return position ? [{ property, position }] : [];
  }), [properties]);


  useEffect(() => {
    if (!map || status !== 'ready' || !map.isStyleLoaded()) return;
    const areas = {
      type: 'FeatureCollection' as const,
      features: properties.flatMap((property) => property.zona_geojson?.type === 'Polygon'
        ? [{ type: 'Feature' as const, properties: { id: property.id }, geometry: property.zona_geojson }]
        : []),
    } as Parameters<mapboxgl.GeoJSONSource['setData']>[0];
    const source = map.getSource('approximate-property-areas') as mapboxgl.GeoJSONSource | undefined;
    if (source) source.setData(areas);
    else {
      map.addSource('approximate-property-areas', { type: 'geojson', data: areas });
    }
  }, [properties, status, map, styleRevision]);
  return <div aria-label="Mapa de inmuebles" aria-busy={status === 'loading'} className="relative w-full h-full bg-gray-100 dark:bg-inmo-darkbg">
    <div ref={containerRef} className="w-full h-full" />
    {map && markerProperties.map(({ property, position }) => (
      <PropertyMarker key={property.id} property={property} propertyType={typesData?.find(t => t.id === property.tipo_id)?.codigo?.toLowerCase() || 'inmo'} position={position} map={map} onMarkerClick={onMarkerClick} />
    ))}
    {status === 'loading' && <Skeleton className="absolute inset-0" />}

    {status === 'error' && <div role="alert" className="absolute inset-0 p-4 md:p-6 pt-32 md:pt-32 pb-[140px] md:pb-6 flex bg-gray-100 dark:bg-inmo-darkbg z-10 pointer-events-auto">
      <EmptyState className="w-full h-full" icon={<Globe />} title="No pudimos cargar el mapa" description="Los resultados siguen disponibles en la lista." actions={<Button variant="secondary" onClick={retry}>Reintentar mapa</Button>} />
    </div>}
    {status === 'ready' && markerProperties.length === 0 && properties.length > 0 &&
      <p className="absolute bottom-28 left-4 right-4 bg-white/90 dark:bg-inmo-darkcard/90 rounded-2xl p-3 text-xs font-inter text-inmo-secondary dark:text-white text-center shadow-soft">
        Estas propiedades no tienen una zona cartográfica pública; consúltalas en la lista.
      </p>}
  </div>;
}

export function MapTemplate(_props: MapTemplateProps) {
  const { isDarkMode, globalFilters, setGlobalFilters, setGlobalSearchQuery } = useAppContext();

  const [selectedPropertyId, setSelectedPropertyId] = usePropertySelection();
  const desktop = useDesktopViewport();
  const [searchMode, setSearchMode] = useState<'filters' | 'text'>('filters');

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [profileFor, setProfileFor] = useState<string | null>(null);
  const isViewingProfile = Boolean(selectedPropertyId && profileFor === selectedPropertyId);
  const setIsViewingProfile = (show: boolean) => setProfileFor(show ? selectedPropertyId : null);
  const panelOpen = isSheetOpen || Boolean(selectedPropertyId);
  const [lastText, setLastText] = useState('');


  const types = useGetCatalog('tipos');
  const activeFilter = (types.data?.find(item => item.id === globalFilters?.tipo_id)?.codigo.toLowerCase() ?? null) as PropertyCategory | null;
  const criteria = globalFilters ?? {};
  const search = useSearchInfinite(criteria, searchMode === 'filters');
  const chatbot = useChatbotQuery();
  const textSearch = useSearchInfinite(chatbotCriteria(chatbot.data), searchMode === 'text' && chatbot.data?.estado === 'RESULTADOS' && !chatbot.isPending);
  const resultSearch = searchMode === 'text' ? textSearch : search;
  const properties = searchMode === 'text' ? textSearch.data?.pages.flatMap(page => page.items) ?? chatbot.data?.resultados ?? [] : search.data?.pages.flatMap(page => page.items) ?? [];
  const isLoading = searchMode === 'text' ? chatbot.isPending || textSearch.isLoading : search.isLoading || types.isLoading;
  const isError = searchMode === 'text' ? chatbot.isError || textSearch.isError : search.isError || types.isError;
  const selected = properties.find((item) => item.id === selectedPropertyId);
  const mapboxToken: string | undefined = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

  const handleFilterChange = (category: PropertyCategory | null) => {
    setGlobalFilters({ ...globalFilters, tipo_id: category === null ? undefined : types.data?.find(item => item.codigo.toLowerCase().replace(/[-_ ]/g, '') === category.replace(/[-_ ]/g, ''))?.id });
    setGlobalSearchQuery('');
    setSearchMode('filters');
    setSelectedPropertyId(null);
  };
  const applyFilters = (value: CriteriosBusqueda) => {
    setGlobalFilters(value);
    setGlobalSearchQuery('');
    setSearchMode('filters');
    setSelectedPropertyId(null);
    setIsFiltersOpen(false);
  };
  const handleTextSearch = (texto: string) => {
    setSelectedPropertyId(null);
    if (!texto.trim()) { setSearchMode('filters'); return; }
    setSearchMode('text');
    setLastText(texto);
    chatbot.mutate(texto);
  };
  const hasCriteria = searchMode === 'text' || activeFilter !== null || Object.values(criteria).some(value => value !== undefined && value !== null && value !== '');
  const clearCriteria = () => {
    setGlobalFilters({});
    setGlobalSearchQuery('');
    setSearchMode('filters');
    setSelectedPropertyId(null);
  };
  const retry = () => {
    if (searchMode === 'text' && chatbot.isError) chatbot.mutate(lastText);
    else if (types.isError) void types.refetch();
    else void resultSearch.refetch();
  };
  const showResults = () => {
    setSelectedPropertyId(null);
    setIsViewingProfile(false);
    setIsSheetOpen(true);

  };
  const showDetail = (id: string) => {
    setSelectedPropertyId(id);
    setIsViewingProfile(false);

  };
  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedPropertyId(null);
    setIsViewingProfile(false);

  };
  const panelTitle = isViewingProfile ? 'Perfil del Asesor'
    : selectedPropertyId ? undefined
    : properties.length === 0 ? undefined
    : `${properties.length}${resultSearch.hasNextPage ? '+' : ''} Coincidencia${properties.length === 1 ? '' : 's'}`;
  const sheetContent = selectedPropertyId
    ? <div className="w-full h-full overflow-hidden flex flex-col"><PropertyDetailView propertyId={selectedPropertyId} preview={selected} layout="vertical" showAsesorProfile={isViewingProfile} onShowAsesorProfileChange={setIsViewingProfile} /></div>
    : <div className="grid gap-4 grid-cols-1">
        {isLoading ? Array.from({ length: 4 }).map((_, index) => <PropertyCardSkeleton key={index} />)
          : properties.map((property, index) => <div key={property.id} className="animate-in fade-in zoom-in-95" style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}><ConnectedPropertyCard
            property={property} onClick={() => showDetail(property.id)}
          /></div>)}
        {!isLoading && isError && <EmptyState compact icon={<CloudOff />} title="No pudimos cargar las propiedades"
          description="Hubo un problema al consultar el catálogo. Inténtalo de nuevo más tarde."
          actions={<Button icon={<RefreshCw className="w-4 h-4" />} onClick={retry}>Reintentar</Button>} />}
        {!isLoading && !isError && properties.length === 0 && <EmptyState compact icon={<MapPinOff />}
          title={hasCriteria ? 'Sin propiedades en esta búsqueda' : 'Aún no hay propiedades en el mapa'}
          description={hasCriteria ? 'Prueba con otra categoría, amplía el rango de precio o describe tu búsqueda con otras palabras.' : 'Cuando los asesores publiquen nuevas propiedades aparecerán aquí con su zona aproximada.'}
          actions={hasCriteria ? <Button variant="secondary" onClick={clearCriteria}>Limpiar filtros</Button> : undefined} />}
        {resultSearch.hasNextPage && <Button variant="secondary" isLoading={resultSearch.isFetchingNextPage} onClick={() => void resultSearch.fetchNextPage()}>Cargar más propiedades</Button>}
        {resultSearch.isFetchNextPageError && <p role="alert" className="text-inmo-danger text-sm">No pudimos consultar más resultados. Reintenta cargar la siguiente página.</p>}
      </div>;

  return <>
    <div className="absolute inset-0 z-0 pointer-events-auto bg-gray-100 dark:bg-inmo-darkbg">
      {!mapboxToken ? (
        <div className="absolute inset-0 w-full h-full p-4 md:p-6 pt-32 md:pt-32 pb-[140px] md:pb-6 flex">
          <EmptyState className="w-full h-full" icon={<Globe />} title="El mapa no está configurado" description="Puedes consultar las propiedades en la lista." />
        </div>
      ) : <>
        <InnerMap properties={properties} typesData={types.data || []} onMarkerClick={showDetail} isDarkMode={isDarkMode} token={mapboxToken} />
        {(!isLoading && isError) ? (
        <div className="absolute inset-0 w-full h-full p-4 md:p-6 pt-32 md:pt-32 pb-[140px] md:pb-6 flex">
          <EmptyState className="w-full h-full" icon={<CloudOff />} title="No pudimos cargar las propiedades" description="Hubo un problema al consultar el catálogo del mapa. Inténtalo de nuevo." actions={<Button icon={<RefreshCw className="w-4 h-4" />} onClick={retry}>Reintentar</Button>} />
        </div>
      ) : (
        <>
          {!isLoading && properties.length === 0 && (
            <div className="absolute top-24 md:top-40 left-1/2 -translate-x-1/2 z-20 pointer-events-auto bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 flex items-center gap-3 animate-in fade-in zoom-in-95 max-w-[90vw]">
              <MapPinOff className="w-4 h-4 text-inmo-accent shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-inmo-secondary dark:text-white font-montserrat">
                  {hasCriteria ? 'Sin propiedades para este filtro' : 'Aún no hay propiedades en el mapa'}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-inter">
                  {hasCriteria ? 'Prueba con otra categoría o limpia los filtros' : 'Aparecerán aquí conforme se publiquen'}
                </span>
              </div>
              {hasCriteria && (
                <button
                  type="button"
                  onClick={clearCriteria}
                  className="ml-2 text-xs font-bold text-inmo-accent hover:underline cursor-pointer shrink-0"
                >
                  Limpiar
                </button>
              )}
            </div>
          )}
        </>
      )}</>}
    </div>

    {/* DESKTOP TOP CATEGORY PILLS (CENTERED & EXTENDED) */}
    <div className="hidden md:flex absolute top-24 lg:top-28 left-1/2 -translate-x-1/2 w-full max-w-5xl xl:max-w-6xl z-40 px-6 justify-center pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="pointer-events-auto flex items-center justify-center w-full">
        <CategoryPills
          showAllOption
          activeFilter={activeFilter}
          onSelectFilter={handleFilterChange}
          className="w-full justify-center md:justify-around"
        />
      </div>
    </div>

    {/* MOBILE TOP CONTROLS (SELECTOR + FILTER BUTTON) */}
    <div className="md:hidden absolute top-4 left-4 right-4 z-40 flex flex-col gap-2.5 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="w-full flex items-center gap-2 pointer-events-auto">
        <CategorySelector
          activeFilter={activeFilter}
          onSelectFilter={handleFilterChange}
          className="flex-1 min-w-0"
        />
        <FloatingFilterButton
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          isActive={isFiltersOpen}
          size="small"
        />
      </div>

      {searchMode === 'text' && chatbot.data?.aclaracion && (
        <p role="status" className="bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-2xl p-3 font-inter text-xs text-gray-700 dark:text-gray-200 shadow-sm border border-white/50 dark:border-white/10 pointer-events-auto">
          {chatbot.data.aclaracion}
        </p>
      )}
    </div>

    {/* DESKTOP BOTTOM SEARCH BAR + FLOATING FILTER BUTTON (UPWARD DROPDOWN) */}
    <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl z-30 px-6 pointer-events-none">
      <div className="w-full pointer-events-auto flex gap-3 items-center">
        <div className="flex-1 relative" data-property-search>
          <SearchBar
            placeholder="Busca propiedades en León..."
            onSubmit={handleTextSearch}
            size="xl"
            glass
            className="w-full"
          />
          {searchMode === 'text' && chatbot.data?.aclaracion && (
            <div className="absolute left-0 bottom-full mb-3 z-30 max-w-lg pointer-events-auto">
              <p role="status" className="bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-2xl p-3.5 font-inter text-xs text-gray-700 dark:text-gray-200 shadow-sm border border-white/50 dark:border-white/10">
                {chatbot.data.aclaracion}
              </p>
            </div>
          )}
        </div>

        <div className="relative shrink-0">
          <FloatingFilterButton
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            isActive={isFiltersOpen}
            size="xl"
          />
        </div>
      </div>
    </div>

    <div className={`fixed md:absolute bottom-[136px] left-0 right-0 z-40 flex flex-col items-center gap-3 px-6 pointer-events-none transition-all duration-300 ease-out ${
      isFiltersOpen ? 'md:-translate-x-32 lg:-translate-x-36' : ''
    }`}>
      <Button
        onClick={showResults}
        className={`px-6 py-2.5 !text-xs !shadow-lg pointer-events-auto transition-all duration-300 ${
          panelOpen ? 'opacity-0 pointer-events-none' : ''
        }`}
      >
        {isLoading ? 'Cargando coincidencias...' : `Ver ${properties.length}${resultSearch.hasNextPage ? '+' : ''} coincidencia${properties.length === 1 ? '' : 's'}`}
      </Button>
    </div>

    <FilterDropdown direction="auto" isOpen={isFiltersOpen} onApply={applyFilters} onClose={() => setIsFiltersOpen(false)} />
    <div className="md:hidden"><BottomSheet
      isOpen={!desktop && panelOpen} onClose={isViewingProfile ? undefined : handleCloseSheet}
      onBack={isViewingProfile ? () => setIsViewingProfile(false) : undefined}
      title={panelTitle}
      noPadding={Boolean(selectedPropertyId)} isHero={Boolean(selectedPropertyId) && !isViewingProfile}
      fullHeight={Boolean(selectedPropertyId)}
    >{!desktop ? sheetContent : null}</BottomSheet></div>
    <SidePanel
      isOpen={panelOpen} onClose={isViewingProfile ? undefined : handleCloseSheet}
      onBack={isViewingProfile ? () => setIsViewingProfile(false) : undefined}
      title={panelTitle}
      noPadding={Boolean(selectedPropertyId)}
      compact={!selectedPropertyId && !isLoading && properties.length === 0}
    >
      {desktop ? sheetContent : null}
    </SidePanel>
  </>;
}

import { useEffect, useMemo, useRef, useState } from 'react';
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
  if (propertyType === 'inmo') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="30" viewBox="0 0 60 30"> <rect x="2" y="2" width="56" height="20" rx="10" fill="${bgColor}" stroke="${borderColor}" stroke-width="2"/> <polygon points="30,28 25,22 35,22" fill="${bgColor}" /> <text x="30" y="16" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="${textColor}" text-anchor="middle">INMO</text> </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  } else if (propertyType === 'casa') {
    iconPaths = '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>';
  } else if (propertyType === 'departamento') {
    iconPaths = '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>';
  } else if (propertyType === 'terreno') {
    iconPaths = '<path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L14 3l-1.4 2.5"/>';
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

  const [isZoomed, setIsZoomed] = useState(() => map.getZoom() >= 13);
  useEffect(() => {
    const handleZoom = () => setIsZoomed(map.getZoom() >= 13);
    map.on('zoom', handleZoom);
    return () => { map.off('zoom', handleZoom); };
  }, [map]);

  const publicPhotos = useGetPhotos(property.id, true);
  const firstPhotoId = publicPhotos.data?.[0]?.id ?? '';
  const publicCover = useGetPhotoUrl(property.id, firstPhotoId, true);
  const priceFmt = Number(property.precio).toLocaleString('es-MX');

  return createPortal(
    isZoomed ? (
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
    ),
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
      map.addLayer({
        id: 'approximate-property-areas-fill', type: 'fill', source: 'approximate-property-areas',
        paint: { 'fill-color': '#fe0a52', 'fill-opacity': 0.14 },
      });
      map.addLayer({
        id: 'approximate-property-areas-outline', type: 'line', source: 'approximate-property-areas',
        paint: { 'line-color': '#fe0a52', 'line-width': 1.5 },
      });
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

  const [searchMode, setSearchMode] = useState<'filters' | 'text'>('filters');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
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
    setGlobalFilters({ ...globalFilters, tipo_id: category === null ? undefined : types.data?.find(item => item.codigo.toLowerCase() === category)?.id });
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
    setIsSheetOpen(true);
  };
  const showDetail = (id: string) => {
    setSelectedPropertyId(id);
    setIsSheetOpen(true);
  };
  const sheetContent = selectedPropertyId && selected
    ? <PropertyDetailView propertyId={selectedPropertyId} preview={selected} />
    : <div className="flex flex-col gap-4 flex-1 h-full">
        {isLoading ? Array.from({ length: 4 }).map((_, index) => <PropertyCardSkeleton key={index} />)
          : properties.map((property) => <ConnectedPropertyCard
            key={property.id} property={property} onClick={() => showDetail(property.id)}
          />)}
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
      ) : (!isLoading && properties.length === 0) ? (
        <div className="absolute inset-0 w-full h-full p-4 md:p-6 pt-32 md:pt-32 pb-[140px] md:pb-6 flex">
          <EmptyState className="w-full h-full" icon={<MapPinOff />} title={hasCriteria ? 'Sin propiedades en esta búsqueda' : 'Aún no hay propiedades en el mapa'} description={hasCriteria ? 'Prueba con otra categoría, amplía el rango de precio o describe tu búsqueda con otras palabras.' : 'Cuando los asesores publiquen nuevas propiedades aparecerán aquí con su zona aproximada.'} actions={hasCriteria ? <Button variant="secondary" onClick={clearCriteria}>Limpiar filtros</Button> : undefined} />
        </div>
      ) : null}</>}
    </div>

    <div className="absolute top-4 left-4 right-4 md:top-28 md:left-6 md:right-auto md:w-[350px] z-50 flex flex-col items-center md:items-start gap-3 pointer-events-none">
      <div className="w-full flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-stretch gap-2 w-full max-w-md">
          <CategoryPills activeFilter={activeFilter} onSelectFilter={handleFilterChange} className="flex-1 m-0" />
          <FloatingFilterButton onClick={() => setIsFiltersOpen(!isFiltersOpen)} size="small" />
        </div>
        <FilterDropdown onClose={() => setIsFiltersOpen(false)} isOpen={isFiltersOpen && !isSheetOpen} onApply={applyFilters} className="max-w-md md:origin-top-left" />
        {searchMode === 'text' && chatbot.data?.aclaracion && <p role="status" className="bg-white dark:bg-inmo-darkcard rounded-2xl p-3 font-inter text-xs text-gray-600 dark:text-gray-300 shadow-soft">{chatbot.data.aclaracion}</p>}
      </div>
    </div>

    <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl z-20 px-6 pointer-events-none">
      <div className="w-full pointer-events-auto"><SearchBar placeholder="Busca propiedades en León..." onSubmit={handleTextSearch} size="xl" glass className="w-full shadow-2xl" /></div>
    </div>

    <div className="absolute bottom-[130px] left-0 right-0 z-10 flex flex-col items-center gap-3 px-6 pointer-events-none">
      <Button onClick={showResults} className={`px-6 py-2.5 !text-xs !shadow-lg pointer-events-auto ${isSheetOpen ? 'opacity-0 pointer-events-none' : ''}`}>
        {isLoading ? 'Cargando propiedades...' : `Ver ${properties.length}${resultSearch.hasNextPage ? '+' : ''} resultado${properties.length === 1 ? '' : 's'}`}
      </Button>
    </div>

    <div className="md:hidden"><BottomSheet
      isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}
      title={selectedPropertyId ? 'Detalle de Propiedad' : `${properties.length} resultados`}
      noPadding={Boolean(selectedPropertyId)} isHero={Boolean(selectedPropertyId)}
    >{sheetContent}</BottomSheet></div>
    <SidePanel isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title={selectedPropertyId ? 'Detalle de Propiedad' : `${properties.length} resultados`}>
      {sheetContent}
    </SidePanel>
  </>;
}

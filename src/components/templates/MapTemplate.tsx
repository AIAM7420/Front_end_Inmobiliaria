import { useEffect, useMemo, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { CriteriosBusqueda, PropiedadPublica } from '../../integrations/backend/types';
import { chatbotCriteria } from '../../integrations/backend/chatbotCriteria';
import { useThemedMap } from '../molecules/useThemedMap';
import { approximateZoneCenter } from '../../integrations/backend/zoneGeometry';
import { useChatbotQuery } from '../../integrations/backend/hooks/useNlp';
import { useGetCatalog } from '../../integrations/backend/hooks/useProperties';
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

export interface MapTemplateProps {}

const markerLabel = (price: string) => {
  const amount = Number(price);
  const label = amount >= 1_000_000
    ? `$${(amount / 1_000_000).toFixed(1)}M`
    : amount >= 1_000
      ? `$${(amount / 1_000).toFixed(0)}k`
      : `$${amount}`;
  return label;
};

function InnerMap({ properties, onMarkerClick, isDarkMode, token }: {
  properties: PropiedadPublica[];
  onMarkerClick: (id: string) => void;
  isDarkMode: boolean;
  token: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
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
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = markerProperties.map(({ property, position }) => {
      const element = document.createElement('button');
      element.type = 'button';
      element.className = 'rounded-full bg-inmo-accent px-3 py-1 text-sm font-bold text-white shadow-lg';
      element.textContent = markerLabel(property.precio);
      element.title = `${property.titulo} · zona aproximada`;
      element.setAttribute('aria-label', element.title);
      element.addEventListener('click', () => onMarkerClick(property.id));
      const marker = new mapboxgl.Marker({ element })
        .setLngLat([position.lng, position.lat])
        .addTo(map);
      // Mapbox assigns role=img; these interactive markers are keyboard buttons.
      element.setAttribute('role', 'button');
      return marker;
    });
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [markerProperties, onMarkerClick, properties, status, map, styleRevision]);

  return <div aria-label="Mapa de inmuebles" aria-busy={status === 'loading'} className="relative w-full h-full bg-gray-100 dark:bg-inmo-darkbg">
    <div ref={containerRef} className="w-full h-full" />
    {status === 'loading' && <Skeleton className="absolute inset-0" />}
    {status === 'error' && <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-inmo-darkbg p-6 text-center pt-24">
      <Globe className="w-14 h-14 text-inmo-accent mb-4" strokeWidth={1.5} />
      <p className="font-inter text-sm text-gray-600 dark:text-gray-300">No pudimos cargar el mapa. Los resultados siguen disponibles en la lista.</p><Button variant="secondary" onClick={retry}>Reintentar mapa</Button>
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
    chatbot.mutate(texto);
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
    : <div className="grid gap-4 grid-cols-1">
        {isLoading ? Array.from({ length: 4 }).map((_, index) => <PropertyCardSkeleton key={index} />)
          : properties.map((property) => <ConnectedPropertyCard
            key={property.id} property={property} onClick={() => showDetail(property.id)}
          />)}
        {!isLoading && isError && <p role="alert" className="font-inter text-sm text-inmo-danger p-4 text-center">No pudimos cargar las propiedades.</p>}
        {!isLoading && !isError && properties.length === 0 && <p className="font-inter text-sm text-gray-500 dark:text-gray-400 p-4 text-center">No encontramos propiedades con esos criterios.</p>}
        {resultSearch.hasNextPage && <Button variant="secondary" isLoading={resultSearch.isFetchingNextPage} onClick={() => void resultSearch.fetchNextPage()}>Cargar más propiedades</Button>}
        {resultSearch.isFetchNextPageError && <p role="alert" className="text-inmo-danger text-sm">No pudimos consultar más resultados. Reintenta cargar la siguiente página.</p>}
      </div>;

  return <>
    <div className="absolute inset-0 z-0 pointer-events-auto">
      {mapboxToken ? <InnerMap properties={properties} onMarkerClick={showDetail} isDarkMode={isDarkMode} token={mapboxToken} /> : <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-inmo-darkbg p-6 text-center pt-24">
        <Globe className="w-14 h-14 text-inmo-accent mb-4" strokeWidth={1.5} />
        <p className="font-inter text-sm text-gray-600 dark:text-gray-300">El mapa no está configurado. Puedes consultar las propiedades en la lista.</p>
      </div>}
    </div>

    <div className="absolute top-4 left-4 right-4 md:top-28 md:left-6 md:right-auto md:w-[350px] z-50 flex flex-col items-center md:items-start gap-3 pointer-events-none">
      <div className="w-full flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-stretch gap-2 w-full max-w-md">
          <CategoryPills activeFilter={activeFilter} onSelectFilter={handleFilterChange} className="flex-1 m-0" />
          <FloatingFilterButton onClick={() => setIsFiltersOpen(!isFiltersOpen)} size="small" />
        </div>
        <FilterDropdown onClose={() => setIsFiltersOpen(false)} isOpen={isFiltersOpen && !isSheetOpen} onApply={applyFilters} className="max-w-md md:origin-top-left" />
        {isError && <p role="alert" className="bg-white dark:bg-inmo-darkcard rounded-2xl p-3 font-inter text-xs text-inmo-danger shadow-soft">No pudimos cargar las propiedades.</p>}
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

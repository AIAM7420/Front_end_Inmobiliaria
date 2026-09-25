import { useEffect, useMemo, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { CriteriosBusqueda, PropiedadPublica } from '../../integrations/backend/types';
import { approximateZoneCenter } from '../../integrations/backend/zoneGeometry';
import { useChatbotQuery } from '../../integrations/backend/hooks/useNlp';
import { useGetCatalog } from '../../integrations/backend/hooks/useProperties';
import { useSearchQuery } from '../../integrations/backend/hooks/useSearch';
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
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const markerProperties = useMemo(() => properties.flatMap((property) => {
    const position = approximateZoneCenter(property.zona_geojson);
    return position ? [{ property, position }] : [];
  }), [properties]);

  useEffect(() => {
    if (!containerRef.current) return;
    setStatus('loading');
    const map = new mapboxgl.Map({
      container: containerRef.current,
      accessToken: token,
      style: isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
      center: [-101.680, 21.135],
      zoom: 12,
      attributionControl: true,
    });
    mapRef.current = map;
    map.on('load', () => setStatus('ready'));
    map.on('error', () => setStatus('error'));
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current = null;
      map.remove();
    };
  }, [token, isDarkMode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== 'ready') return;
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
      return new mapboxgl.Marker({ element })
        .setLngLat([position.lng, position.lat])
        .addTo(map);
    });
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [markerProperties, onMarkerClick, properties, status]);

  return <div className="relative w-full h-full bg-gray-100 dark:bg-inmo-darkbg">
    <div ref={containerRef} className="w-full h-full" />
    {status === 'loading' && <Skeleton className="absolute inset-0" />}
    {status === 'error' && <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-inmo-darkbg p-6 text-center pt-24">
      <Globe className="w-14 h-14 text-inmo-accent mb-4" strokeWidth={1.5} />
      <p className="font-inter text-sm text-gray-600 dark:text-gray-300">No pudimos cargar el mapa. Los resultados siguen disponibles en la lista.</p>
    </div>}
    {status === 'ready' && markerProperties.length === 0 && properties.length > 0 &&
      <p className="absolute bottom-28 left-4 right-4 bg-white/90 dark:bg-inmo-darkcard/90 rounded-2xl p-3 text-xs font-inter text-inmo-secondary dark:text-white text-center shadow-soft">
        Estas propiedades no tienen una zona cartográfica pública; consúltalas en la lista.
      </p>}
  </div>;
}

export function MapTemplate(_props: MapTemplateProps) {
  const { isDarkMode } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<PropertyCategory>('all');
  const [extraCriteria, setExtraCriteria] = useState<CriteriosBusqueda>({});
  const [searchMode, setSearchMode] = useState<'filters' | 'text'>('filters');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const types = useGetCatalog('tipos');
  const typeId = activeFilter === 'all'
    ? undefined
    : types.data?.find((item) => item.codigo.toLowerCase() === activeFilter)?.id;
  const criteria: CriteriosBusqueda = {
    ...extraCriteria,
    ...(typeId ? { tipo_id: typeId } : {}),
  };
  const search = useSearchQuery(criteria, { limit: 100 });
  const chatbot = useChatbotQuery();
  const properties = searchMode === 'text' ? chatbot.data?.resultados ?? [] : search.data?.items ?? [];
  const isLoading = searchMode === 'text' ? chatbot.isPending : search.isLoading || types.isLoading;
  const isError = searchMode === 'text' ? chatbot.isError : search.isError || types.isError;
  const selected = properties.find((item) => item.id === selectedPropertyId);
  const mapboxToken: string | undefined = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

  const handleFilterChange = (category: PropertyCategory) => {
    setActiveFilter(category);
    setSearchMode('filters');
    setSelectedPropertyId(null);
  };
  const applyFilters = (value: CriteriosBusqueda) => {
    setExtraCriteria(value);
    setSearchMode('filters');
    setSelectedPropertyId(null);
    setIsFiltersOpen(false);
  };
  const handleTextSearch = (texto: string) => {
    setSelectedPropertyId(null);
    chatbot.mutate(texto, { onSuccess: () => setSearchMode('text') });
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
        <FilterDropdown isOpen={isFiltersOpen && !isSheetOpen} onApply={applyFilters} className="max-w-md md:origin-top-left" />
        {isError && <p role="alert" className="bg-white dark:bg-inmo-darkcard rounded-2xl p-3 font-inter text-xs text-inmo-danger shadow-soft">No pudimos cargar las propiedades.</p>}
        {searchMode === 'text' && chatbot.data?.aclaracion && <p role="status" className="bg-white dark:bg-inmo-darkcard rounded-2xl p-3 font-inter text-xs text-gray-600 dark:text-gray-300 shadow-soft">{chatbot.data.aclaracion}</p>}
      </div>
    </div>

    <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl z-20 px-6 pointer-events-none">
      <div className="w-full pointer-events-auto"><SearchBar placeholder="Busca propiedades en León..." onSubmit={handleTextSearch} size="xl" glass className="w-full shadow-2xl" /></div>
    </div>

    <div className="absolute bottom-[130px] left-0 right-0 z-10 flex flex-col items-center gap-3 px-6 pointer-events-none">
      <Button onClick={showResults} className={`px-6 py-2.5 !text-xs !shadow-lg pointer-events-auto ${isSheetOpen ? 'opacity-0 pointer-events-none' : ''}`}>
        {isLoading ? 'Cargando propiedades...' : `Ver ${properties.length} resultado${properties.length === 1 ? '' : 's'}`}
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

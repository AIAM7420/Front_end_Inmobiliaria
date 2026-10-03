import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SplitViewLayout } from './SplitViewLayout';

import { useAppContext } from '../../context/AppContext';
import { useGetCatalog, useGetProperties } from '../../integrations/backend/hooks/useProperties';
import { useSearchQuery } from '../../integrations/backend/hooks/useSearch';
import { useChatbotQuery } from '../../integrations/backend/hooks/useNlp';
import { ConnectedPropertyCard } from '../organisms/ConnectedPropertyCard';
import { ConnectedHero } from '../organisms/ConnectedHero';
import { PropertyDetailView } from '../organisms/PropertyDetailView';
import { Footer } from '../organisms/Footer';
import { PropertyCardSkeleton } from '../molecules/PropertyCardSkeleton';
import { FilterDropdown } from '../molecules/FilterDropdown';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { SearchBar } from '../molecules/SearchBar';
export function SplitLandingTemplate() {
  const { globalSearchQuery, setGlobalSearchQuery, globalFilters, setGlobalFilters } = useAppContext();
  const [cursor, setCursor] = useState<string | undefined>();
  const [selectedId, setSelectedId] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState(globalSearchQuery);
  const row = useRef<HTMLDivElement>(null);
  const hasFilters = Boolean(globalFilters && Object.values(globalFilters).some(value => value !== undefined && value !== null && value !== ''));
  const publicCatalog = useGetProperties({ limit: 20, cursor }, !hasFilters && !globalSearchQuery.trim());
  const filteredCatalog = useSearchQuery(globalFilters ?? {}, { limit: 20, cursor }, hasFilters && !globalSearchQuery.trim());
  const catalog = hasFilters ? filteredCatalog : publicCatalog;
  const types = useGetCatalog('tipos');
  const chatbot = useChatbotQuery();
  const search = chatbot.mutate;
  useEffect(() => {
    if (globalSearchQuery.trim()) search(globalSearchQuery.trim());
  }, [globalSearchQuery, search]);
  useEffect(() => { setCursor(undefined); setSelectedId(''); }, [globalFilters, globalSearchQuery]);
  const textMode = Boolean(globalSearchQuery.trim());
  const properties = textMode ? chatbot.data?.resultados ?? [] : catalog.data?.items ?? [];
  const busy = textMode ? chatbot.isPending : catalog.isLoading;
  const failed = textMode ? chatbot.isError : catalog.isError;
  const selected = properties.find(property => property.id === selectedId);
  const catalogCards = <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
    {busy ? Array.from({length:4},(_,i)=><PropertyCardSkeleton key={i} />)
      : properties.map(property => <ConnectedPropertyCard key={property.id} property={property} onClick={() => setSelectedId(property.id)} />)}
  </div>;
  const content = <main className="px-4 md:px-6 pt-[104px] pb-32 flex flex-col gap-8">
    <ConnectedHero propertyId={properties[0]?.id} />
    <div className="flex gap-3 items-center">
      <SearchBar placeholder="Buscar propiedades..." value={searchDraft} onChange={setSearchDraft} onSubmit={setGlobalSearchQuery} glass size="slim" className="flex-1" />
      <IconButton aria-label="Abrir filtros" icon={<SlidersHorizontal className="w-5 h-5" />} onClick={() => setFiltersOpen(!filtersOpen)} />
    </div>
    <FilterDropdown isOpen={filtersOpen} onApply={criteria => { setGlobalFilters(criteria); setGlobalSearchQuery(''); setFiltersOpen(false); }} />
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Button variant={!globalFilters?.tipo_id ? 'accent' : 'secondary'} onClick={() => { setGlobalFilters({}); setGlobalSearchQuery(''); }}>Todos</Button>
      {types.data?.map(type => <Button key={type.id} variant={globalFilters?.tipo_id === type.id ? 'accent' : 'secondary'} onClick={() => { setGlobalFilters({...globalFilters,tipo_id:type.id}); setGlobalSearchQuery(''); }}>{type.nombre}</Button>)}
    </div>
    {!selectedId && !busy && properties.length > 0 && <section>
      <div className="flex justify-between items-center mb-4"><h2 className="font-montserrat font-bold text-xl">Explora propiedades</h2><div className="flex gap-2">
        <IconButton aria-label="Propiedades anteriores" icon={<ChevronLeft />} onClick={() => row.current?.scrollBy({left:-400,behavior:'smooth'})} />
        <IconButton aria-label="Propiedades siguientes" icon={<ChevronRight />} onClick={() => row.current?.scrollBy({left:400,behavior:'smooth'})} />
      </div></div>
      <div ref={row} className="flex gap-5 overflow-x-auto snap-x pb-3">{properties.slice(0,6).map(property => <div key={property.id} className="min-w-[280px] w-[320px] shrink-0 snap-start"><ConnectedPropertyCard property={property} onClick={() => setSelectedId(property.id)} /></div>)}</div>
    </section>}
    <section className="space-y-5"><div className="flex justify-between items-center"><h2 className="font-montserrat font-bold text-xl">Explorar catálogo</h2><Link to="/map" className="flex gap-2 text-inmo-accent font-inter text-sm"><MapPin className="w-4 h-4" />Ver mapa</Link></div>
      {failed && <p role="alert">No pudimos cargar las propiedades. Intenta nuevamente.</p>}
      {textMode && chatbot.data?.aclaracion && <p role="status">{chatbot.data.aclaracion}</p>}
      {catalogCards}
      {!busy && !failed && !properties.length && <p role="status" className="rounded-card bg-white dark:bg-inmo-darkcard p-8 text-gray-500">No encontramos propiedades con esos criterios.</p>}
      {!textMode && catalog.data?.next_cursor && <Button variant="secondary" onClick={() => setCursor(catalog.data?.next_cursor ?? undefined)}>Página siguiente</Button>}
      {cursor && <Button variant="text" onClick={() => setCursor(undefined)}>Volver al inicio</Button>}
    </section>
    <Footer />
  </main>;
  return <SplitViewLayout mainContent={content} sideContent={selected ? <PropertyDetailView propertyId={selected.id} preview={selected} /> : null} isOpen={Boolean(selected)} onClose={() => setSelectedId('')} sideTitle="Detalle de propiedad" desktopNoPadding />;
}

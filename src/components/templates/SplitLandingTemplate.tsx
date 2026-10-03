import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PromoBanner } from '../molecules/PromoBanner';
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
import { LocationTag } from '../molecules/LocationTag';
export function SplitLandingTemplate() {
  const navigate = useNavigate();
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
  const catalogCards = <div className={`grid gap-6 transition-all duration-500 ${selectedId ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'}`}>
    {busy ? Array.from({length:4},(_,i)=><PropertyCardSkeleton key={i} />)
      : properties.map(property => <ConnectedPropertyCard key={property.id} property={property} onClick={() => setSelectedId(property.id)} />)}
  </div>;
  const content = <><main className="px-4 md:px-6 flex flex-col gap-5 md:gap-8 pt-[88px] md:pt-[100px] pb-[120px] md:pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500 transition-all">
    <ConnectedHero propertyId={properties[0]?.id} />
    <div className="flex flex-col items-center w-full"><div className="w-full md:w-[70%] flex flex-col"><div className="flex items-center gap-2 w-full scroll-mt-28">
      <SearchBar placeholder="Buscar propiedades..." value={searchDraft} onChange={setSearchDraft} onSubmit={setGlobalSearchQuery} glass size="slim" className="flex-1 shadow-lg" />
      <IconButton aria-label="Abrir filtros" icon={<SlidersHorizontal className="w-5 h-5" strokeWidth={2} />} onClick={() => setFiltersOpen(!filtersOpen)} variant="secondary"
        className="w-[44px] h-[44px] !bg-white/40 dark:!bg-white/10 backdrop-blur-xl border border-white/50 dark:border-white/10 !shadow-sm hover:!bg-white/60 dark:hover:!bg-white/20 shrink-0" />
    </div></div></div>
    <FilterDropdown isOpen={filtersOpen} onApply={criteria => { setGlobalFilters(criteria); setGlobalSearchQuery(''); setFiltersOpen(false); }} />
    <div className="bg-gray-100/80 dark:bg-white/5 rounded-2xl p-3 md:p-4 -mx-4 px-4 md:-mx-6 md:mx-0 md:px-5 mt-1 md:mt-2 flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-5">
      <div className="flex gap-3 md:gap-6 min-w-0 flex-1"><div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 min-w-0 flex-1">
      <button className={`shrink-0 px-4 py-1.5 border rounded-full text-[13px] font-medium transition-all active:scale-95 ${!globalFilters?.tipo_id?'bg-inmo-accent text-white border-transparent shadow-md':'bg-transparent text-gray-600 dark:text-gray-400 border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} onClick={() => { setGlobalFilters({}); setGlobalSearchQuery(''); }}>Todos</button>
      {types.data?.map(type => <button key={type.id} className={`shrink-0 px-4 py-1.5 border rounded-full text-[13px] font-medium transition-all active:scale-95 ${globalFilters?.tipo_id===type.id?'bg-white dark:bg-inmo-darkcard text-inmo-secondary dark:text-white border-transparent shadow-md dark:border-white/10':'bg-transparent text-gray-600 dark:text-gray-400 border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} onClick={() => { setGlobalFilters({...globalFilters,tipo_id:globalFilters?.tipo_id===type.id?undefined:type.id}); setGlobalSearchQuery(''); }}>{type.nombre}</button>)}
      </div></div><div className="hidden md:flex flex-col justify-center md:self-center w-[250px] shrink-0"><LocationTag city="León" state="Guanajuato, México" /></div>
    </div>
    {!selectedId && !textMode && !hasFilters && !busy && properties.length > 0 && <section className="flex flex-col mt-4 md:mt-8">
      <div className="flex justify-between items-center ml-4 md:ml-6 pr-4 md:pr-0"><h2 className="text-xl font-bold border-l-4 border-inmo-accent pl-3">Explora propiedades</h2></div>
      <div className="relative group">
        <button aria-label="Propiedades anteriores" className="hidden md:flex absolute -left-5 top-[40%] -translate-y-1/2 z-10 bg-white/90 dark:bg-inmo-darkcard/90 backdrop-blur-sm shadow-md rounded-full w-10 h-10 items-center justify-center text-inmo-secondary dark:text-white border border-gray-100 dark:border-white/10 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100" onClick={() => row.current?.scrollBy({left:-400,behavior:'smooth'})}><ChevronLeft className="w-6 h-6" /></button>
      <div ref={row} className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-pl-4 md:scroll-pl-0 pt-3 md:pt-4 pb-4 -mx-4 px-4 md:-mx-6 md:mx-0 md:px-0 scroll-smooth">{properties.slice(0,8).map(property => <div key={property.id} className="shrink-0 w-[280px] md:w-[340px] snap-start"><ConnectedPropertyCard property={property} onClick={() => setSelectedId(property.id)} /></div>)}</div>
        <button aria-label="Propiedades siguientes" className="hidden md:flex absolute -right-5 top-[40%] -translate-y-1/2 z-10 bg-white/90 dark:bg-inmo-darkcard/90 backdrop-blur-sm shadow-md rounded-full w-10 h-10 items-center justify-center text-inmo-secondary dark:text-white border border-gray-100 dark:border-white/10 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100" onClick={() => row.current?.scrollBy({left:400,behavior:'smooth'})}><ChevronRight className="w-6 h-6" /></button>
      </div>
    </section>}
    {!textMode && !hasFilters && !selectedId && <div className="my-4 md:my-10"><PromoBanner title="¿Buscas tu próximo hogar?" description="Explora las propiedades disponibles y encuentra la zona que se adapta a ti." buttonText="Explorar el mapa" onButtonClick={() => navigate('/map')} /></div>}
    <section className="flex flex-col gap-4 mb-6 md:mb-12 mt-4 md:mt-8"><div className="flex justify-between items-center ml-4 md:ml-6"><h2 className="text-xl font-bold border-l-4 border-inmo-accent pl-3">Catálogo general</h2><Link to="/map" className="flex gap-2 text-inmo-accent font-inter text-sm"><MapPin className="w-4 h-4" />Ver mapa</Link></div>
      {failed && <p role="alert">No pudimos cargar las propiedades. Intenta nuevamente.</p>}
      {textMode && chatbot.data?.aclaracion && <p role="status">{chatbot.data.aclaracion}</p>}
      {catalogCards}
      {!busy && !failed && !properties.length && <p role="status" className="rounded-card bg-white dark:bg-inmo-darkcard p-8 text-gray-500">No encontramos propiedades con esos criterios.</p>}
      {!textMode && catalog.data?.next_cursor && <Button variant="secondary" onClick={() => setCursor(catalog.data?.next_cursor ?? undefined)}>Página siguiente</Button>}
      {cursor && <Button variant="text" onClick={() => setCursor(undefined)}>Volver al inicio</Button>}
    </section>
  </main><Footer /></>;
  return <SplitViewLayout mainContent={content} sideContent={selected ? <PropertyDetailView propertyId={selected.id} preview={selected} /> : null} isOpen={Boolean(selected)} onClose={() => setSelectedId('')} sideTitle="Detalle de propiedad" desktopNoPadding />;
}

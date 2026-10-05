import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Share2, MapPin, Grid, List, SearchX } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton } from '../atoms/IconButton';
import { Button } from '../atoms/Button';
import { FloatingFilterButton } from '../atoms/FloatingFilterButton';
import { SearchBar } from '../molecules/SearchBar';
import { CategoryPills } from '../molecules/CategoryPills';
import type { PropertyCategory } from '../molecules/CategoryPills';
import { FilterDropdown } from '../molecules/FilterDropdown';
import { EmptyState } from '../molecules/EmptyState';
import { ConnectedPropertyCard } from '../organisms/ConnectedPropertyCard';
import { AdvisorContact } from '../organisms/AdvisorContact';
import { BottomSheet } from '../organisms/BottomSheet';
import { PropertyDetailView } from '../organisms/PropertyDetailView';
import { usePublicAdvisor, usePortfolio } from '../../integrations/backend/hooks/useEngagement';
import { useGetCatalog } from '../../integrations/backend/hooks/useProperties';
import { operationError } from '../../integrations/backend/versioning';
import type { CriteriosBusqueda, PropiedadPublica } from '../../integrations/backend/types';

const normalize = (value?: string | null) => (value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/**
 * The portfolio endpoint only paginates (no server-side filters), so search and
 * filters are applied over the advisor's already-public properties.
 */
function matchesFilters(property: PropiedadPublica, text: string, typeId: string | undefined, criteria: CriteriosBusqueda) {
  if (typeId && property.tipo_id !== typeId) return false;
  if (criteria.zona_id && property.zona_id !== criteria.zona_id) return false;
  const price = Number(property.precio);
  if (criteria.precio_min && price < Number(criteria.precio_min)) return false;
  if (criteria.precio_max && price > Number(criteria.precio_max)) return false;
  const needle = normalize(text.trim());
  if (!needle) return true;
  return [property.titulo, property.colonia, property.descripcion].some(field => normalize(field).includes(needle));
}

export const AsesorPublicProfileTemplate = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const advisor = usePublicAdvisor(id), portfolio = usePortfolio(id), types = useGetCatalog('tipos');
  const [display, setDisplay] = useState<'grid' | 'list'>('grid');
  const [shareError, setShareError] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<PropertyCategory | null>(null);
  const [criteria, setCriteria] = useState<CriteriosBusqueda>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const properties = useMemo(() => portfolio.data?.pages.flatMap(page => page.items) ?? [], [portfolio.data]);
  const typeId = category ? types.data?.find(item => item.codigo.toLowerCase() === category)?.id : undefined;
  const hasFilters = query.trim() !== '' || category !== null || Object.values(criteria).some(Boolean);
  const visible = useMemo(() => properties.filter(property => matchesFilters(property, query, typeId, criteria)), [properties, query, typeId, criteria]);
  const selectedProperty = properties.find(property => property.id === selectedPropertyId);

  // With an active filter, pull the remaining pages so results are not limited to what was loaded so far.
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage } = portfolio;
  useEffect(() => {
    if (hasFilters && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) void fetchNextPage();
  }, [hasFilters, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  const clearFilters = () => { setQuery(''); setCategory(null); setCriteria({}); setIsFiltersOpen(false); };
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: advisor.data?.nombre_comercial, url: location.href });
      else await navigator.clipboard.writeText(location.href);
      setShareError('Enlace compartido o copiado.');
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setShareError('No pudimos compartir. Copia el enlace de la barra de dirección.');
    }
  };

  const toolbar = (
    <div className="shrink-0 flex flex-col gap-3 pb-4">
      <div className="flex items-center gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Buscar en este portafolio..." size="slim" glass={false} className="flex-1 min-w-0" />
        <FloatingFilterButton onClick={() => setIsFiltersOpen(open => !open)} size="small" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <CategoryPills activeFilter={category} onSelectFilter={setCategory} className="flex-1 m-0 max-w-sm" />
        <div className="hidden md:flex gap-2">
          <IconButton aria-label="Ver cuadrícula" onClick={() => setDisplay('grid')} icon={<Grid className={`w-4 h-4 ${display === 'grid' ? 'text-inmo-accent' : 'text-gray-400'}`} />} variant="ghost" className={`!p-1.5 !rounded-md ${display === 'grid' ? '!bg-inmo-accent/10' : 'hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary'}`} />
          <IconButton aria-label="Ver lista" onClick={() => setDisplay('list')} icon={<List className={`w-4 h-4 ${display === 'list' ? 'text-inmo-accent' : 'text-gray-400'}`} />} variant="ghost" className={`!p-1.5 !rounded-md ${display === 'list' ? '!bg-inmo-accent/10' : 'hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary'}`} />
        </div>
      </div>
      <FilterDropdown isOpen={isFiltersOpen} onApply={value => { setCriteria(value); setIsFiltersOpen(false); }} className="md:origin-top-left" />
    </div>
  );

  const results = (
    <>
      {portfolio.isPending ? <p role="status" className="text-sm text-gray-500">Cargando portafolio…</p>
        : portfolio.isError ? <div role="alert" className="flex flex-col gap-3 items-start"><p className="text-sm text-inmo-danger">{operationError(portfolio.error)}</p><Button onClick={() => void portfolio.refetch()}>Reintentar</Button></div>
        : visible.length === 0 ? <EmptyState compact icon={<SearchX />}
          title={hasFilters ? 'Sin propiedades con esos criterios' : 'Aún no hay publicaciones'}
          description={hasFilters ? (portfolio.hasNextPage ? 'Seguimos buscando en el resto del portafolio…' : 'Prueba con otra palabra o ajusta los filtros.') : 'Este asesor todavía no tiene propiedades públicas disponibles.'}
          actions={hasFilters ? <Button variant="secondary" onClick={clearFilters}>Limpiar filtros</Button> : undefined} />
        : <div className={display === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-5' : 'grid grid-cols-1 gap-4 md:gap-5'}>
          {visible.map(property => <ConnectedPropertyCard key={property.id} property={property} onClick={() => setSelectedPropertyId(property.id)} />)}
        </div>}
      {!hasFilters && portfolio.hasNextPage && <Button className="mt-6" variant="secondary" isLoading={portfolio.isFetchingNextPage} onClick={() => void portfolio.fetchNextPage()}>Cargar más propiedades</Button>}
      {portfolio.isFetchNextPageError && <p role="alert" className="mt-4 text-sm text-inmo-danger">No pudimos cargar más propiedades.</p>}
    </>
  );

  const catalogHeader = (
    <div className="shrink-0 flex items-end justify-between mb-4">
      <h2 className="font-montserrat font-bold text-xl md:text-2xl text-inmo-secondary dark:text-white">Portafolio</h2>
      {!portfolio.isPending && !portfolio.isError && <span className="font-inter text-sm text-gray-500 dark:text-gray-400">{hasFilters ? `${visible.length} de ${properties.length}` : properties.length}{properties.length === 1 ? ' propiedad' : ' propiedades'}</span>}
    </div>
  );

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden bg-white dark:bg-inmo-darkbg relative">

      {/* Left: advisor profile (30% on desktop). It always fits the viewport; only extreme heights scroll. */}
      <aside className="w-full md:w-[30%] md:min-w-[340px] md:max-w-[460px] h-full min-h-0 flex flex-col shrink-0 pt-3 md:pt-[100px] md:pl-6 relative z-20">
        <div className="shrink-0 px-4 md:px-0 pb-3 flex items-center justify-between gap-2">
          <IconButton aria-label="Volver" icon={<ArrowLeft className="w-5 h-5 text-inmo-secondary dark:text-white" />} onClick={() => navigate(-1)} variant="ghost" className="!p-2 !rounded-full !bg-white/50 dark:!bg-black/20 hover:!bg-white/70 dark:hover:!bg-black/40 backdrop-blur-md" />
          <span className="font-montserrat font-semibold text-lg text-inmo-secondary dark:text-white">Perfil del Asesor</span>
          <IconButton aria-label="Compartir perfil" onClick={() => void share()} icon={<Share2 className="w-5 h-5 text-inmo-secondary dark:text-white" />} variant="ghost" className="!p-2 !rounded-full !bg-white/50 dark:!bg-black/20 hover:!bg-white/70 dark:hover:!bg-black/40 backdrop-blur-md" />
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-4 px-4 md:px-0 pb-28 md:pb-6 overflow-y-auto overscroll-contain">
          <div className="relative flex-1 min-h-[180px] max-h-[420px] rounded-card overflow-hidden shadow-sm group bg-gray-100 dark:bg-inmo-darkcard">
            <img src={advisor.data?.fotografia_url ?? '/avatar-placeholder.svg'} alt="Foto del Asesor" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {advisor.isError && <p role="alert" className="text-sm text-inmo-danger">{operationError(advisor.error)}</p>}
          {shareError && <p role="status" className="text-xs text-gray-500">{shareError}</p>}

          <div className="shrink-0 space-y-3">
            <div className="flex flex-col items-start text-left">
              <h1 className="font-montserrat font-bold text-2xl text-inmo-secondary dark:text-white flex items-center gap-2">
                {advisor.data?.nombre_comercial ?? 'Cargando perfil…'}
                {advisor.data?.validado && <CheckCircle2 aria-label="Asesor validado" className="w-6 h-6 text-inmo-accent shrink-0" />}
              </h1>
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mt-1">
                <MapPin className="w-4 h-4" />
                <span className="font-inter text-sm">{advisor.data ? 'Miembro desde ' + new Date(advisor.data.incorporado_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long' }) : 'Cargando…'}</span>
              </div>
            </div>
            <p className="font-inter text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-left line-clamp-3">
              {advisor.data?.descripcion ?? 'Este asesor todavía no ha añadido una descripción.'}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">{advisor.data?.propiedades_publicas ?? '—'}</span>
              <span className="font-inter text-sm text-gray-500 dark:text-gray-400">Propiedades</span>
            </div>
            <div className="flex flex-row gap-3 w-full">
              <div className="flex-1 min-w-0"><AdvisorContact advisorId={id} /></div>
              <Button variant="secondary" className="md:hidden flex-1 !rounded-full !py-3.5 !text-body" icon={<Grid className="w-5 h-5" />} onClick={() => setIsCatalogOpen(true)}>Portafolio</Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Right: portfolio (desktop). Search + filters stay fixed; only the results scroll. */}
      <section className="hidden md:flex flex-1 min-w-0 h-full flex-col bg-gray-50 dark:bg-inmo-darkcard px-6 lg:px-10 pt-[100px] pb-4">
        {selectedProperty ? (
          <div className="flex flex-col h-full min-h-0 gap-2">
            <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />} className="self-start shrink-0" onClick={() => setSelectedPropertyId(null)}>Volver al portafolio</Button>
            <div className="flex-1 min-h-0 rounded-card overflow-hidden bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary shadow-sm">
              <PropertyDetailView propertyId={selectedProperty.id} preview={selectedProperty} layout="horizontal" hideAdvisorProfile />
            </div>
          </div>
        ) : (
          <div className="max-w-5xl w-full mx-auto flex flex-col h-full min-h-0">
            {catalogHeader}
            {toolbar}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar pb-6">{results}</div>
          </div>
        )}
      </section>

      {/* Mobile: portfolio and detail inside the bottom sheet */}
      <div className="md:hidden">
        <BottomSheet
          isOpen={isCatalogOpen || selectedPropertyId !== null}
          onClose={() => { setIsCatalogOpen(false); setSelectedPropertyId(null); }}
          onBack={selectedProperty ? () => setSelectedPropertyId(null) : undefined}
          title={selectedProperty ? undefined : 'Portafolio'}
          noPadding={Boolean(selectedProperty)} isHero={Boolean(selectedProperty)} fullHeight={Boolean(selectedProperty)}
        >
          {selectedProperty
            ? <div className="w-full h-full overflow-hidden flex flex-col"><PropertyDetailView propertyId={selectedProperty.id} preview={selectedProperty} layout="vertical" hideAdvisorProfile /></div>
            : <div className="px-5 pb-8">{catalogHeader}{toolbar}{results}</div>}
        </BottomSheet>
      </div>
    </div>
  );
};

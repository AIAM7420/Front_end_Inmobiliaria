import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Share2, MapPin, Grid, List, SearchX, User, MessageCircle, SlidersHorizontal } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useCreateConversation } from '../../integrations/backend/hooks/useChat';
import { useGetOwnAdvisor } from '../../integrations/backend/hooks/useAdvisors';
import { IconButton } from '../atoms/IconButton';
import { Button } from '../atoms/Button';
import { SearchBar } from '../molecules/SearchBar';
import { CategoryPills } from '../molecules/CategoryPills';
import type { PropertyCategory } from '../molecules/CategoryPills';
import { FilterDropdown } from '../molecules/FilterDropdown';
import { EmptyState } from '../molecules/EmptyState';
import { Skeleton } from '../atoms/Skeleton';
import { PropertyCardSkeleton } from '../molecules/PropertyCardSkeleton';
import { ConnectedPropertyCard } from '../organisms/ConnectedPropertyCard';
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
  const [searchParams] = useSearchParams();
  const fromProperty = searchParams.get('fromProperty');
  const fromPath = searchParams.get('fromPath') || '/';

  const handleBack = () => {
    if (fromProperty) {
      navigate(`${fromPath}?propiedad=${encodeURIComponent(fromProperty)}`);
    } else if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  const advisor = usePublicAdvisor(id), portfolio = usePortfolio(id), types = useGetCatalog('tipos');
  const { isAuthenticated, role } = useAppContext();
  const create = useCreateConversation();
  const own = useGetOwnAdvisor(role === 'asesor');
  const isSelf = own.data?.id === id;

  const handleContact = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      const propId = fromProperty || properties[0]?.id || '';
      const conversation = await create.mutateAsync(
        role === 'asesor'
          ? { tipo: 'ASESOR_ASESOR', asesor_destino_id: id }
          : { tipo: 'CLIENTE_ASESOR', propiedad_id: propId }
      );
      navigate((role === 'asesor' ? '/asesor/mensajes' : '/messages') + '?conversation=' + encodeURIComponent(conversation.id));
    } catch {
      // Error handled by create.isError and operationError(create.error)
    }
  };
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
  const year = advisor.data?.incorporado_at ? new Date(advisor.data.incorporado_at).getFullYear() : null;

  // With an active filter, pull the remaining pages so results are not limited to what was loaded so far.
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage } = portfolio;
  useEffect(() => {
    if (hasFilters && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) void fetchNextPage();
  }, [hasFilters, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  const [isWireframeMode, setIsWireframeMode] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsWireframeMode(false), 350);
    return () => clearTimeout(timer);
  }, []);

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

  const catalogHeader = (
    <div className="w-full shrink-0 flex justify-between items-start md:items-center mb-4 md:mb-5">
      <div className="flex flex-col">
        <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-inmo-secondary dark:text-white border-l-4 border-inmo-accent pl-3">
          Portafolio
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-inter text-xs md:text-sm mt-1 pl-4">
          {advisor.data?.nombre_comercial ? `Propiedades disponibles de ${advisor.data.nombre_comercial}` : 'Propiedades disponibles en este catálogo'}
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {!portfolio.isPending && !portfolio.isError && (
          <span className="font-inter text-xs md:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-gray-200/60 dark:border-white/10 whitespace-nowrap">
            {hasFilters ? `${visible.length} de ${properties.length}` : properties.length}
            {properties.length === 1 ? ' propiedad' : ' propiedades'}
          </span>
        )}

        <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200/60 dark:border-white/10">
          <IconButton
            aria-label="Ver cuadrícula"
            onClick={() => setDisplay('grid')}
            icon={<Grid className={`w-4 h-4 ${display === 'grid' ? 'text-inmo-accent' : 'text-gray-400'}`} />}
            variant="ghost"
            className={`!w-8 !h-8 !p-0 !rounded-lg transition-colors ${display === 'grid' ? '!bg-white dark:!bg-inmo-darkcard shadow-sm text-inmo-accent' : 'hover:!bg-white/50 text-gray-400'}`}
          />
          <IconButton
            aria-label="Ver lista"
            onClick={() => setDisplay('list')}
            icon={<List className={`w-4 h-4 ${display === 'list' ? 'text-inmo-accent' : 'text-gray-400'}`} />}
            variant="ghost"
            className={`!w-8 !h-8 !p-0 !rounded-lg transition-colors ${display === 'list' ? '!bg-white dark:!bg-inmo-darkcard shadow-sm text-inmo-accent' : 'hover:!bg-white/50 text-gray-400'}`}
          />
        </div>
      </div>
    </div>
  );

  const toolbar = (
    <div className="w-full shrink-0 flex flex-col gap-3 mb-5">
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 md:gap-3 w-full">
        {/* Buscador con tamaño reducido */}
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Buscar en este portafolio..."
          size="slim"
          glass={false}
          className="w-full sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[300px] shrink-0 shadow-sm"
        />

        {/* Botón de filtros avanzados */}
        <IconButton
          aria-label="Filtrar propiedades"
          title="Filtros avanzados"
          onClick={() => setIsFiltersOpen(open => !open)}
          icon={<SlidersHorizontal className="w-5 h-5" strokeWidth={2} />}
          variant="secondary"
          className={`w-[44px] h-[44px] !rounded-[14px] border !shadow-sm transition-all shrink-0 ${
            isFiltersOpen || Object.values(criteria).some(Boolean)
              ? '!bg-inmo-accent !text-white border-transparent shadow-glow'
              : '!bg-white dark:!bg-inmo-darkcard border-gray-100 dark:border-white/10 hover:!bg-gray-50 dark:hover:!bg-inmo-darktertiary text-inmo-secondary dark:text-white'
          }`}
        />

        {/* Filtros de tipo de propiedad en versión pequeña a la derecha */}
        <CategoryPills
          size="small"
          showAllOption
          activeFilter={category}
          onSelectFilter={setCategory}
          className="shrink-0 max-w-full"
        />
      </div>

      <FilterDropdown
        isOpen={isFiltersOpen}
        onApply={value => { setCriteria(value); setIsFiltersOpen(false); }}
        className="origin-top"
      />
    </div>
  );

  const results = (
    <>
      {(portfolio.isPending || isWireframeMode) ? (
        <div className={display === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5' : 'grid grid-cols-1 gap-4 md:gap-5'}>
          {Array.from({ length: 8 }).map((_, i) => (
            <PropertyCardSkeleton key={i} layout={display === 'list' ? 'list' : 'grid'} />
          ))}
        </div>
      ) : portfolio.isError ? (
        <div role="alert" className="flex flex-col gap-3 items-start"><p className="text-sm text-inmo-danger">{operationError(portfolio.error)}</p><Button onClick={() => void portfolio.refetch()}>Reintentar</Button></div>
      ) : visible.length === 0 ? (
        <EmptyState compact icon={<SearchX />}
          title={hasFilters ? 'Sin propiedades con esos criterios' : 'Aún no hay publicaciones'}
          description={hasFilters ? (portfolio.hasNextPage ? 'Seguimos buscando en el resto del portafolio…' : 'Prueba con otra palabra o ajusta los filtros.') : 'Este asesor todavía no tiene propiedades públicas disponibles.'}
          actions={hasFilters ? <Button variant="secondary" onClick={clearFilters}>Limpiar filtros</Button> : undefined} />
      ) : (
        <div className={display === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5' : 'grid grid-cols-1 gap-4 md:gap-5'}>
          {visible.map(property => <ConnectedPropertyCard key={property.id} property={property} onClick={() => setSelectedPropertyId(property.id)} />)}
        </div>
      )}
      {!hasFilters && portfolio.hasNextPage && <Button className="mt-6" variant="secondary" isLoading={portfolio.isFetchingNextPage} onClick={() => void portfolio.fetchNextPage()}>Cargar más propiedades</Button>}
      {portfolio.isFetchNextPageError && <p role="alert" className="mt-4 text-sm text-inmo-danger">No pudimos cargar más propiedades.</p>}
    </>
  );

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden bg-gray-50 dark:bg-inmo-darkbg relative pt-3 md:pt-[100px] pb-4 px-3 md:px-6 gap-4 md:gap-6">

      {/* Columna Izquierda: Split Card del Asesor (Visualmente consistente con el SplitViewLayout) */}
      <aside className="w-full md:w-[32%] lg:w-[30%] xl:w-[28%] 2xl:w-[26%] h-full min-h-0 flex flex-col shrink-0 relative z-20">
        <div className="w-full h-full rounded-card overflow-hidden flex flex-col relative bg-white dark:bg-inmo-darkcard shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-inmo-darktertiary">
          
          {/* Header con Controles del Split */}
          <div className="shrink-0 px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-inmo-darktertiary/40">
            <IconButton
              aria-label="Volver"
              icon={<ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />}
              onClick={handleBack}
              variant="secondary"
              className="!w-10 !h-10 !p-0 !bg-white/90 dark:!bg-inmo-darkcard/90 backdrop-blur-md hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary !shadow-sm !rounded-full transition-colors border border-gray-100 dark:border-white/10"
            />
            <span className="font-montserrat font-semibold text-base md:text-lg text-inmo-secondary dark:text-white">
              Perfil del Asesor
            </span>
            <IconButton
              aria-label="Compartir perfil"
              onClick={() => void share()}
              icon={<Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />}
              variant="secondary"
              className="!w-10 !h-10 !p-0 !bg-white/90 dark:!bg-inmo-darkcard/90 backdrop-blur-md hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary !shadow-sm !rounded-full transition-colors border border-gray-100 dark:border-white/10"
            />
          </div>

          {/* Cuerpo del Split: Idéntico a AsesorInlineProfile */}
          {(advisor.isPending || isWireframeMode) ? (
            <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 space-y-5 justify-center max-w-[460px] mx-auto w-full animate-pulse">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-5 w-full items-stretch">
                <Skeleton className="w-full md:w-2/3 aspect-[4/4] sm:aspect-[4/5] md:aspect-[3/4] min-h-[220px] max-h-[360px] rounded-[28px]" />
                <div className="hidden md:flex w-1/3 flex-col justify-around py-4">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              </div>
              <Skeleton className="h-7 w-2/3 rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col justify-center p-3 sm:p-5">
              <div className="flex-1 flex flex-col p-2 sm:p-3 space-y-5 justify-center max-w-[460px] mx-auto w-full">
                {/* Top Section: Photo and KPIs (disposición front-only con foto más grande) */}
                <div className="flex flex-col md:flex-row w-full items-stretch gap-4 sm:gap-5">
                  {/* Photo */}
                  <div className="w-full md:w-2/3 aspect-[4/4] sm:aspect-[4/5] md:aspect-[3/4] min-h-[220px] max-h-[360px] rounded-[28px] overflow-hidden shadow-sm relative shrink-0 bg-gray-100 dark:bg-inmo-darkbg group">
                    <img
                      src={advisor.data?.fotografia_url ?? '/avatar-placeholder.svg'}
                      alt={advisor.data?.nombre_comercial ?? 'Foto del Asesor'}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Vertical KPIs (Desktop Only) */}
                  <div className="hidden md:flex w-1/3 flex-col justify-center">
                    <div className="flex flex-col items-center text-center border-b border-gray-100 dark:border-inmo-darktertiary/50 pb-4">
                      <span className="font-montserrat font-black text-2xl text-inmo-secondary dark:text-white leading-tight">
                        {advisor.data?.propiedades_publicas ?? '—'}
                      </span>
                      <span className="font-inter text-xs text-gray-500 dark:text-gray-400 mt-1">Propiedades</span>
                    </div>

                    {year && (
                      <div className="flex flex-col items-center text-center pt-4">
                        <span className="font-montserrat font-black text-2xl text-inmo-secondary dark:text-white leading-tight">
                          {year}
                        </span>
                        <span className="font-inter text-xs text-gray-500 dark:text-gray-400 mt-1">Miembro</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Horizontal Stats Row (Mobile Only) */}
                <div className="flex md:hidden justify-between items-center py-3 border-y border-gray-100 dark:border-inmo-darktertiary/50">
                  <div className="flex flex-col items-center flex-1">
                    <span className="font-montserrat font-black text-lg text-inmo-secondary dark:text-white leading-tight">
                      {advisor.data?.propiedades_publicas ?? '—'}
                    </span>
                    <span className="font-inter text-[11px] text-gray-500 dark:text-gray-400 mt-1">Propiedades</span>
                  </div>
                  {year && (
                    <>
                      <div className="w-px h-6 bg-gray-200 dark:bg-inmo-darktertiary" />
                      <div className="flex flex-col items-center flex-1">
                        <span className="font-montserrat font-black text-lg text-inmo-secondary dark:text-white leading-tight">
                          {year}
                        </span>
                        <span className="font-inter text-[11px] text-gray-500 dark:text-gray-400 mt-1">Miembro</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Info & Bio */}
                <div className="flex flex-col space-y-3 text-left">
                  <div>
                    <h3 className="font-montserrat font-bold text-xl sm:text-2xl text-inmo-secondary dark:text-white flex items-center gap-2">
                      {advisor.data?.nombre_comercial ?? 'Asesor'}
                      {advisor.data?.validado && <CheckCircle2 aria-label="Asesor validado" className="w-5 h-5 text-inmo-accent shrink-0" />}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="w-4 h-4 text-inmo-accent" />
                      <span className="font-inter text-xs sm:text-sm">León, Guanajuato</span>
                    </div>
                  </div>

                  <p className="font-inter text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {advisor.data?.descripcion || 'Este asesor todavía no ha añadido una descripción.'}
                  </p>

                  {advisor.isError && <p role="alert" className="text-xs text-inmo-danger text-center">{operationError(advisor.error)}</p>}
                  {shareError && <p role="status" className="text-xs text-gray-500 text-center">{shareError}</p>}

                  {/* Botones de acción: icono a la izquierda, color idéntico al texto */}
                  <div className="pt-2 flex flex-row gap-3 w-full">
                    {isSelf ? (
                      <Button
                        variant="secondary"
                        icon={<User className="w-4 h-4 text-current shrink-0" />}
                        className="w-full !rounded-full !py-3.5 !px-4 font-inter font-semibold text-sm flex flex-row items-center justify-center gap-2 whitespace-nowrap text-inmo-secondary dark:text-white"
                        onClick={() => navigate('/asesor/propiedades')}
                      >
                        Mi inventario
                      </Button>
                    ) : role === 'admin' ? (
                      <Button
                        variant="secondary"
                        icon={<CheckCircle2 className="w-4 h-4 text-current shrink-0" />}
                        className="w-full !rounded-full !py-3.5 !px-4 font-inter font-semibold text-sm flex flex-row items-center justify-center gap-2 whitespace-nowrap text-inmo-secondary dark:text-white"
                        onClick={() => navigate('/admin/moderacion' + (fromProperty ? '?property=' + fromProperty : ''))}
                      >
                        Moderar
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="accent"
                          icon={<MessageCircle className="w-4 h-4 text-current shrink-0" />}
                          isLoading={create.isPending}
                          className="flex-1 !rounded-full !py-3.5 !px-4 font-inter font-bold text-sm shadow-glow flex flex-row items-center justify-center gap-2 whitespace-nowrap text-white"
                          onClick={handleContact}
                        >
                          Contactar
                        </Button>
                        <Button
                          variant="secondary"
                          icon={<Grid className="w-4 h-4 text-current shrink-0" />}
                          className="md:hidden flex-1 !rounded-full !py-3.5 !px-4 font-inter font-semibold text-sm flex flex-row items-center justify-center gap-2 whitespace-nowrap text-inmo-secondary dark:text-white"
                          onClick={() => setIsCatalogOpen(true)}
                        >
                          Portafolio
                        </Button>
                      </>
                    )}
                  </div>
                  {create.isError && <p role="alert" className="text-xs text-inmo-danger text-center">{operationError(create.error)}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Right: portfolio (desktop). Organizado con la estructura consistente del main layout */}
      <section className="hidden md:flex flex-1 min-w-0 h-full flex-col">
        {selectedProperty ? (
          <div className="flex flex-col h-full min-h-0 gap-3">
            <Button
              variant="ghost"
              icon={<ArrowLeft className="w-4 h-4 text-current" />}
              className="self-start shrink-0 !rounded-full text-inmo-secondary dark:text-white hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary"
              onClick={() => setSelectedPropertyId(null)}
            >
              Volver al portafolio
            </Button>
            <div className="flex-1 min-h-0 rounded-card overflow-hidden bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
              <PropertyDetailView propertyId={selectedProperty.id} preview={selectedProperty} layout="horizontal" hideAdvisorProfile />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col min-h-0">
            {catalogHeader}
            {toolbar}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar pb-6 pr-1">
              {results}
            </div>
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
          noPadding={Boolean(selectedProperty)}
          isHero={Boolean(selectedProperty)}
          fullHeight={Boolean(selectedProperty)}
        >
          {selectedProperty ? (
            <div className="w-full h-full overflow-hidden flex flex-col">
              <PropertyDetailView propertyId={selectedProperty.id} preview={selectedProperty} layout="vertical" hideAdvisorProfile />
            </div>
          ) : (
            <div className="px-4 pb-8 flex flex-col gap-4">
              {catalogHeader}
              {toolbar}
              {results}
            </div>
          )}
        </BottomSheet>
      </div>
    </div>
  );
};

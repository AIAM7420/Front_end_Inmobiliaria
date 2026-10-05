import { useState } from 'react';
import { Heart, HeartOff, LogIn, Compass, CloudOff, RefreshCw, SearchX, Map as MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { Select } from '../atoms/Select';
import { useAppContext } from '../../context/AppContext';
import { useFavorite, useFavorites } from '../../integrations/backend/hooks/useEngagement';
import { operationError } from '../../integrations/backend/versioning';
import { useGetCatalog } from '../../integrations/backend/hooks/useProperties';
import { ConnectedPropertyCard } from '../organisms/ConnectedPropertyCard';
import { PropertyDetailView } from '../organisms/PropertyDetailView';
import { PropertyCardSkeleton } from '../molecules/PropertyCardSkeleton';
import { EmptyState } from '../molecules/EmptyState';
import { ModuleLayout } from './ModuleLayout';
import { SplitViewLayout } from './SplitViewLayout';

function RetiredFavorite({ id }: { id: string }) {
  const favorite = useFavorite(id);
  return <section className="bg-white dark:bg-inmo-darkcard rounded-card shadow-soft p-6 flex flex-col gap-4">
    <Heart className="text-inmo-accent w-6 h-6" /><h2 className="font-montserrat font-bold">Publicación retirada</h2>
    <p className="text-sm text-gray-500">Esta propiedad ya no está disponible en el catálogo.</p>
    <Button variant="secondary" isLoading={favorite.mutation.isPending} onClick={() => favorite.mutation.mutate(false)}>Quitar de favoritos</Button>
    {favorite.mutation.isError && <p role="alert">{operationError(favorite.mutation.error)}</p>}
  </section>;
}

export function FavoritesTemplate() {
  const { isAuthenticated } = useAppContext(), navigate = useNavigate(), query = useFavorites(), catalogs = useGetCatalog('tipos');
  const [selected, setSelected] = useState<string | null>(null), [search, setSearch] = useState('');
  const [isViewingProfile, setIsViewingProfile] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false), [availability, setAvailability] = useState('all'), [type, setType] = useState('all');
  const items = query.data?.pages.flatMap(page => page.items) ?? [];
  const filtered = items.filter(item => (availability === 'all' || item.publicacion_disponible === (availability === 'available')) &&
    (type === 'all' || item.propiedad?.tipo_id === type) &&
    (!search.trim() || (item.propiedad?.titulo ?? 'Publicación retirada').toLocaleLowerCase('es-MX').includes(search.trim().toLocaleLowerCase('es-MX'))));
  const filters = <><div className="grid grid-cols-2 gap-3">
    <Select aria-label="Tipo de propiedad" value={type} onChange={event => setType(event.target.value)} wrapperClassName="!bg-gray-50/50 dark:!bg-inmo-darkbg/50 !h-12 !px-3" className="!text-xs"><option value="all">Todos los tipos</option>{catalogs.data?.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}</Select>
    <Select aria-label="Disponibilidad" value={availability} onChange={event => setAvailability(event.target.value)} wrapperClassName="!bg-gray-50/50 dark:!bg-inmo-darkbg/50 !h-12 !px-3" className="!text-xs"><option value="all">Cualquier estado</option><option value="available">Disponibles</option><option value="retired">Retiradas</option></Select>
  </div><div className="flex gap-2 mt-2 pt-4 border-t border-gray-100 dark:border-inmo-darktertiary"><Button variant="secondary" className="flex-1 !h-10 text-xs" onClick={() => { setType('all'); setAvailability('all'); setSearch(''); }}>Limpiar</Button><Button className="flex-1 !h-10 text-xs shadow-glow" onClick={() => setFiltersOpen(false)}>Aplicar filtros</Button></div></>;
  return <SplitViewLayout isOpen={selected !== null} onClose={isViewingProfile ? undefined : () => { setSelected(null); setIsViewingProfile(false); }} onBack={isViewingProfile ? () => setIsViewingProfile(false) : undefined} sideTitle={isViewingProfile ? "Perfil del Asesor" : "Detalle de Propiedad"} sidePanelWidthClass={isViewingProfile ? "w-[30%] lg:w-[30%] xl:w-[30%]" : "w-[50%] lg:w-[50%] xl:w-[50%]"} mainPanelWidthClass={isViewingProfile ? "w-[70%] lg:w-[70%] xl:w-[70%]" : "md:w-[50%] lg:w-[50%] xl:w-[50%]"} bottomSheetHeightMode="fixed-75" bottomSheetIsHero={!isViewingProfile} bottomSheetNoPadding bottomSheetFullHeight wrapperClassName="bg-transparent" mainPanelNoScroll
    mainContent={<ModuleLayout title="Favoritos" subtitle={!isAuthenticated ? 'Inicia sesión para guardar tus propiedades.' : query.isPending ? 'Cargando tus propiedades guardadas…' : items.length ? `Tienes ${items.length}${query.hasNextPage ? '+' : ''} ${items.length === 1 && !query.hasNextPage ? 'propiedad guardada' : 'propiedades guardadas'}.` : 'Tu lista de favoritos está vacía por ahora.'} isFullScreen searchPlaceholder="Buscar en favoritos..." searchValue={search} onSearchChange={setSearch} isFiltersOpen={filtersOpen} onToggleFilters={() => setFiltersOpen(!filtersOpen)} onCloseFilters={() => setFiltersOpen(false)} filtersContent={filters}>
      {!isAuthenticated ? <EmptyState icon={<Heart />} title="Guarda las propiedades que más te gusten"
          description="Inicia sesión para crear tu lista de favoritos, compararlas cuando quieras y retomarlas desde cualquier dispositivo."
          actions={<><Button icon={<LogIn className="w-4 h-4" />} onClick={() => navigate('/login')}>Iniciar sesión</Button><Button variant="secondary" icon={<Compass className="w-4 h-4" />} onClick={() => navigate('/')}>Explorar propiedades</Button></>} />
        : query.isPending ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{Array.from({ length: 4 }, (_, i) => <PropertyCardSkeleton key={i} />)}</div>
        : query.isError ? <EmptyState icon={<CloudOff />} title="No pudimos cargar tus favoritos" description={operationError(query.error)}
          actions={<Button icon={<RefreshCw className="w-4 h-4" />} onClick={() => void query.refetch()}>Reintentar</Button>} />
        : !items.length ? <EmptyState icon={<HeartOff />} title="Guarda las propiedades que más te gusten"
          description="Toca el corazón en cualquier propiedad para guardarla aquí y encontrarla fácilmente después."
          actions={<><Button icon={<Compass className="w-4 h-4" />} onClick={() => navigate('/')}>Explorar catálogo</Button><Button variant="secondary" icon={<MapIcon className="w-4 h-4" />} onClick={() => navigate('/map')}>Ver mapa</Button></>} />
        : <>
        <div className={`grid gap-6 ${selected ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
          {filtered.map(item => item.propiedad ? <ConnectedPropertyCard key={item.propiedad_id} property={item.propiedad} onClick={() => { setSelected(item.propiedad_id); setIsViewingProfile(false); }} /> : <RetiredFavorite key={item.propiedad_id} id={item.propiedad_id} />)}
        </div>{filtered.length === 0 && <EmptyState compact icon={<SearchX />} title="Sin coincidencias" description="Ninguno de tus favoritos coincide con la búsqueda o los filtros aplicados."
          actions={<Button variant="secondary" onClick={() => { setType('all'); setAvailability('all'); setSearch(''); }}>Limpiar filtros</Button>} />}
        {query.hasNextPage && <Button variant="secondary" className="mt-6 mx-auto" isLoading={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()}>Cargar más favoritos</Button>}
        {query.isFetchNextPageError && <p role="alert">No pudimos cargar la siguiente página. Puedes volver a intentarlo.</p>}
      </>}
    </ModuleLayout>}
    sideContent={selected && <PropertyDetailView propertyId={selected} layout={isViewingProfile ? "vertical" : "horizontal"} showAsesorProfile={isViewingProfile} onShowAsesorProfileChange={setIsViewingProfile} />} />
}

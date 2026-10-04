import { useState } from 'react';
import { Heart } from 'lucide-react';
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
  const [filtersOpen, setFiltersOpen] = useState(false), [availability, setAvailability] = useState('all'), [type, setType] = useState('all');
  const items = query.data?.pages.flatMap(page => page.items) ?? [];
  const filtered = items.filter(item => (availability === 'all' || item.publicacion_disponible === (availability === 'available')) &&
    (type === 'all' || item.propiedad?.tipo_id === type) &&
    (!search.trim() || (item.propiedad?.titulo ?? 'Publicación retirada').toLocaleLowerCase('es-MX').includes(search.trim().toLocaleLowerCase('es-MX'))));
  const filters = <><div className="grid grid-cols-2 gap-3">
    <Select aria-label="Tipo de propiedad" value={type} onChange={event => setType(event.target.value)} wrapperClassName="!bg-gray-50/50 dark:!bg-inmo-darkbg/50 !h-12 !px-3" className="!text-xs"><option value="all">Todos los tipos</option>{catalogs.data?.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}</Select>
    <Select aria-label="Disponibilidad" value={availability} onChange={event => setAvailability(event.target.value)} wrapperClassName="!bg-gray-50/50 dark:!bg-inmo-darkbg/50 !h-12 !px-3" className="!text-xs"><option value="all">Cualquier estado</option><option value="available">Disponibles</option><option value="retired">Retiradas</option></Select>
  </div><div className="flex gap-2 mt-2 pt-4 border-t border-gray-100 dark:border-inmo-darktertiary"><Button variant="secondary" className="flex-1 !h-10 text-xs" onClick={() => { setType('all'); setAvailability('all'); setSearch(''); }}>Limpiar</Button><Button className="flex-1 !h-10 text-xs shadow-glow" onClick={() => setFiltersOpen(false)}>Aplicar filtros</Button></div></>;
  return <SplitViewLayout isOpen={selected !== null} onClose={() => setSelected(null)} sideTitle="Detalle de Propiedad" sidePanelWidthClass="w-[50%] lg:w-[50%] xl:w-[50%]" mainPanelWidthClass="md:w-[50%] lg:w-[50%] xl:w-[50%]" bottomSheetHeightMode="fixed-75" bottomSheetIsHero bottomSheetNoPadding bottomSheetFullHeight wrapperClassName="bg-transparent" mainPanelNoScroll
    mainContent={<ModuleLayout title="Favoritos" subtitle={isAuthenticated ? `Tienes ${items.length}${query.hasNextPage ? '+' : ''} propiedades guardadas.` : 'Inicia sesión para guardar tus propiedades.'} isFullScreen searchPlaceholder="Buscar en favoritos..." searchValue={search} onSearchChange={setSearch} isFiltersOpen={filtersOpen} onToggleFilters={() => setFiltersOpen(!filtersOpen)} onCloseFilters={() => setFiltersOpen(false)} filtersContent={filters}>
      {!isAuthenticated ? <Button onClick={() => navigate('/login')}>Iniciar sesión</Button> : query.isPending ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{Array.from({ length: 4 }, (_, i) => <PropertyCardSkeleton key={i} />)}</div> : query.isError ? <div role="alert" className="space-y-4"><p>{operationError(query.error)}</p><Button onClick={() => void query.refetch()}>Reintentar</Button></div> : <>
        <div className={`grid gap-6 ${selected ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
          {filtered.map(item => item.propiedad ? <ConnectedPropertyCard key={item.propiedad_id} property={item.propiedad} onClick={() => setSelected(item.propiedad_id)} /> : <RetiredFavorite key={item.propiedad_id} id={item.propiedad_id} />)}
        </div>{filtered.length === 0 && <p className="py-12 text-center text-gray-500">{items.length ? 'No hay coincidencias entre los favoritos cargados.' : 'Todavía no has guardado propiedades.'}</p>}
        {query.hasNextPage && <Button variant="secondary" className="mt-6 mx-auto" isLoading={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()}>Cargar más favoritos</Button>}
        {query.isFetchNextPageError && <p role="alert">No pudimos cargar la siguiente página. Puedes volver a intentarlo.</p>}
      </>}
    </ModuleLayout>}
    sideContent={selected && <><div className="hidden md:block w-full h-full"><PropertyDetailView propertyId={selected} layout="horizontal" /></div><div className="flex md:hidden w-full flex-1 flex-col min-h-0 overflow-hidden"><PropertyDetailView propertyId={selected} layout="vertical" /></div></>} />;
}

import { Building2, Edit, Eye, EyeOff, MapPin, MessageSquare, Plus, RotateCcw, Trash2, ListOrdered, Users } from 'lucide-react';
import type { PropiedadPrivada } from '../../integrations/backend/types';
import { useGetCatalog, useGetOwnPhotos, useGetOwnPhotoUrl } from '../../integrations/backend/hooks/useProperties';
import { ModuleLayout } from '../templates/ModuleLayout';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { SearchBar } from '../molecules/SearchBar';
import { PeriodDropdown } from '../molecules/PeriodDropdown';

const states: Record<string, string> = { PUBLICADA: 'Activa', PAUSADA: 'Pausada', REGISTRADA: 'Borrador', EN_REVISION: 'En revisión', ARCHIVADA: 'Eliminada' };
const filters: Record<string, string> = { Todos: '', Activas: 'PUBLICADA', Pausadas: 'PAUSADA', Borradores: 'REGISTRADA', 'En revisión': 'EN_REVISION' };
const price = (item: PropiedadPrivada) => Number(item.precio).toLocaleString('es-MX', { style: 'currency', currency: item.moneda });

function Cover({ property }: { property: PropiedadPrivada }) {
  const photos = useGetOwnPhotos(property.id);
  const cover = useGetOwnPhotoUrl(property.id, photos.data?.[0]?.id ?? '');
  return cover.data?.url ? <img src={cover.data.url} alt={property.titulo} className="w-16 h-16 rounded-xl object-cover shrink-0" loading="lazy" />
    : <div className="w-16 h-16 rounded-xl shrink-0 bg-gray-100 dark:bg-inmo-darkbg flex items-center justify-center"><Building2 className="w-6 h-6 text-gray-400" /></div>;
}

function Status({ state }: { state: string }) {
  return <Badge responsiveText={false} variant={state === 'PUBLICADA' ? 'success' : state === 'PAUSADA' ? 'warning' : 'secondary'} text={states[state] ?? state} />;
}

interface PropertyInventoryProps {
  items: PropiedadPrivada[]; loading: boolean; error: boolean; eligible: boolean; busy: boolean;
  selected: string; isOpen: boolean; trash: boolean; search: string; status: string;
  onSearch: (value: string) => void; onStatus: (value: string) => void;
  onSelect: (id: string) => void; onEdit: (id: string) => void;
  onCreate: () => void; onTrashView: () => void;
  onOrder: () => void; onShared: () => void;
  onAction: (item: PropiedadPrivada, action: 'PUBLICAR' | 'PAUSAR' | 'ARCHIVAR' | 'RESTAURAR' | 'RETIRAR') => void;
}

/** Layout from 01295be, with real properties and reversible actions. */
export function PropertyInventory(props: PropertyInventoryProps) {
  const { items, loading, error, eligible, busy, selected, isOpen, trash, search, status, onSearch, onStatus, onSelect, onEdit, onCreate, onTrashView, onAction } = props;
  const types = useGetCatalog('tipos');
  const filter = Object.keys(filters).find(key => filters[key] === status) ?? 'Todos';
  const filtered = items.filter(item => (trash ? item.estado_publicacion === 'ARCHIVADA' : item.estado_publicacion !== 'ARCHIVADA')
    && (!status || trash || item.estado_publicacion === status)
    && `${item.titulo} ${item.direccion}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const active = items.filter(item => item.estado_publicacion !== 'ARCHIVADA');
  const picker = <PeriodDropdown ariaLabel="Filtrar por estado" selectedPeriod={filter} onChange={value => onStatus(filters[value] ?? '')} options={Object.keys(filters)} iconOnly className="!w-[44px] !h-[44px] shrink-0" />;
  const trashButton = <IconButton variant="secondary" aria-label={trash ? 'Volver al inventario' : 'Ver eliminadas'} title={trash ? 'Volver al inventario' : 'Ver eliminadas'}
    icon={trash ? <RotateCcw className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />} onClick={onTrashView}
    className="w-[44px] h-[44px] !rounded-[14px] shrink-0 !bg-white/90 dark:!bg-inmo-darkcard/90 border border-gray-100 dark:border-white/10 shadow-sm" />;
  const extraButtons = <><IconButton variant="secondary" aria-label="Comisiones compartidas" title="Comisiones compartidas" icon={<Users className="w-5 h-5" />} onClick={props.onShared} />
    {!trash && <IconButton variant="secondary" aria-label="Ordenar inventario" title="Ordenar inventario" icon={<ListOrdered className="w-5 h-5" />} disabled={!eligible || busy || !active.length} onClick={props.onOrder} />}</>;
  const actions = (item: PropiedadPrivada) => <div className="flex items-center justify-end gap-1">
    {trash ? <>{item.recuperable !== false && <><IconButton variant="ghost" size="sm" icon={<RotateCcw className="w-4 h-4" />} title="Recuperar" aria-label={`Recuperar ${item.titulo}`} disabled={!eligible || busy}
      onClick={() => onAction(item, 'RESTAURAR')} /><IconButton variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-inmo-danger" />} title="Eliminar definitivamente" aria-label={`Eliminar definitivamente ${item.titulo}`} disabled={!eligible || busy} onClick={() => onAction(item, 'RETIRAR')} /></>}</> : <>
      <IconButton variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} title="Editar" aria-label={`Editar ${item.titulo}`} disabled={!eligible || busy} onClick={() => onEdit(item.id)} />
      <IconButton variant="ghost" size="sm" icon={item.estado_publicacion === 'PUBLICADA' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        title={item.estado_publicacion === 'PUBLICADA' ? 'Pausar' : 'Publicar'} aria-label={`${item.estado_publicacion === 'PUBLICADA' ? 'Pausar' : 'Publicar'} ${item.titulo}`}
        disabled={!eligible || busy || item.estado_publicacion === 'EN_REVISION'} onClick={() => onAction(item, item.estado_publicacion === 'PUBLICADA' ? 'PAUSAR' : 'PUBLICAR')} />
      <IconButton variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-red-500" />} title="Eliminar" aria-label={`Eliminar ${item.titulo}`} disabled={!eligible || busy} onClick={() => onAction(item, 'ARCHIVAR')} />
    </>}
  </div>;
  return <ModuleLayout title={trash ? 'Papelera' : 'Mis Propiedades'} subtitle={loading ? 'Cargando inventario...' : `Tienes ${active.length} propiedades.`}
    isFullScreen noScroll searchPlaceholder="Buscar por título o ubicación..." searchValue={search} onSearchChange={onSearch}
    showFilters={false} controlsMaxWidthClass="md:hidden" actions={trash ? undefined : picker}
    headerEndContent={<div className="flex items-center gap-2 md:hidden">{extraButtons}{trashButton}<IconButton variant="accent" icon={<Plus className="w-4 h-4" />} aria-label="Nueva propiedad"
      disabled={!eligible || busy} onClick={onCreate} className="w-[36px] h-[36px] !rounded-[10px] shadow-glow" /></div>}>
    <div className="flex flex-col md:flex-row w-full h-full min-h-0 gap-6 font-inter pb-24 md:pb-6">
      {!isOpen && !trash && <div className="hidden md:flex flex-col w-[15%] lg:w-[12%] gap-4 h-full shrink-0">
        {[{ count: active.length, label: 'Propiedades', color: 'text-inmo-secondary dark:text-white' },
          { count: active.filter(item => item.estado_publicacion === 'PUBLICADA').length, label: 'Publicadas', color: 'text-inmo-accent' },
          { count: active.filter(item => item.estado_publicacion === 'REGISTRADA').length, label: 'Borradores', color: 'text-inmo-success' }].map(metric =>
          <div key={metric.label} className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className={`absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.03] ${metric.color}`}><svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none"><path d="M 0 40 L 0 25 Q 30 35 60 20 T 100 5 L 100 40 Z" fill="currentColor" /><path d="M 0 25 Q 30 35 60 20 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg></div>
            <div className="relative z-10 flex flex-col items-center justify-center"><span className={`font-montserrat font-black text-2xl lg:text-3xl mb-1 ${metric.color}`}>{metric.count}</span><span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">{metric.label}</span></div>
          </div>)}
      </div>}
      <div className="flex flex-col h-full min-h-0 flex-1 min-w-0 gap-6">
        <div className="hidden md:flex gap-3 w-full items-center shrink-0">
          <SearchBar placeholder="Buscar por título o ubicación..." size="slim" className="flex-1 md:flex-none md:w-[30%] min-w-0" value={search} onChange={onSearch} />
          {!trash && picker}<div className="flex-1" />{extraButtons}{trashButton}
          {isOpen ? <IconButton variant="accent" disabled={!eligible || busy} className="h-[44px] !rounded-[14px] shadow-glow" aria-label="Nueva propiedad" onClick={onCreate} icon={<Plus className="w-5 h-5" />} /> : <Button variant="accent" disabled={!eligible || busy} className="h-[44px] !rounded-[14px] shadow-glow shrink-0 font-bold px-4 gap-2 whitespace-nowrap" onClick={onCreate} icon={<Plus className="w-5 h-5" />}>Nueva propiedad</Button>}
        </div>
        <div className="bg-white dark:bg-inmo-darkcard rounded-card border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-2">
          {error ? <div role="alert" className="m-4 bg-inmo-danger/10 border border-inmo-danger/20 rounded-xl p-4 text-inmo-danger text-sm">No pudimos cargar el inventario completo. Intenta nuevamente.</div>
            : loading ? <div role="status" className="flex items-center justify-center h-32 flex-col"><div className="w-8 h-8 border-2 border-inmo-accent border-t-transparent rounded-full animate-spin mb-2" /><p className="text-sm text-gray-500">Cargando inventario...</p></div>
            : <>
              <div role="region" aria-label="Inventario de escritorio" tabIndex={0} className="hidden md:block w-full flex-1 min-h-0 overflow-y-auto overflow-x-auto overscroll-contain relative rounded-card">
                <table className={`w-full text-left border-collapse h-fit ${isOpen ? 'min-w-full' : 'min-w-[900px]'}`}>
                  <thead className="sticky top-0 z-10 shadow-sm"><tr className="border-b border-gray-100 dark:border-inmo-darktertiary bg-gray-50/95 dark:bg-inmo-darkbg/95 backdrop-blur-md text-inmo-secondary dark:text-gray-300 font-montserrat text-sm">
                    {['Propiedad', ...(!isOpen ? ['Tipo'] : []), 'Precio', 'Estado', ...(!isOpen ? ['Recámaras', 'Baños', 'Área', 'Rendimiento'] : []), 'Acciones'].map(label => <th key={label} className={`p-4 font-bold ${label === 'Acciones' ? 'text-right' : label === 'Propiedad' || label === 'Precio' || label === 'Tipo' ? '' : 'text-center'}`}>{label}</th>)}
                  </tr></thead>
                  <tbody className="font-inter">{filtered.map(item => <tr key={item.id} className={`border-b border-gray-50 dark:border-inmo-darktertiary hover:bg-gray-50 dark:hover:bg-inmo-darktertiary transition-colors ${selected === item.id ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10' : ''}`}>
                    <td className="p-4"><button onClick={() => onSelect(item.id)} className="flex items-center gap-4 text-left"><Cover property={item} /><span className="flex flex-col min-w-[200px]"><span className="font-bold text-inmo-secondary dark:text-white line-clamp-1">{item.titulo}</span><span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" />{item.direccion}</span></span></button></td>
                    {!isOpen && <td className="p-4 align-middle"><span className="capitalize text-sm font-medium text-gray-600 dark:text-gray-300">{types.data?.find(type => type.id === item.tipo_id)?.nombre ?? '—'}</span></td>}
                    <td className="p-4 align-middle"><span className="font-montserrat font-bold text-inmo-accent">{price(item)}</span></td><td className="p-4 align-middle text-center"><div className="flex justify-center"><Status state={item.estado_publicacion} /></div></td>
                    {!isOpen && <>{[item.habitaciones, item.banos, `${item.superficie_construccion ?? item.superficie_terreno ?? '—'}m²`].map((value, index) => <td key={index} className="p-4 align-middle text-center"><span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{value}</span></td>)}<td className="p-4 align-middle text-center"><div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-300" title="Métricas todavía no disponibles"><span className="flex items-center gap-1"><Eye className="w-4 h-4 text-gray-400" /> —</span><span className="flex items-center gap-1"><MessageSquare className="w-4 h-4 text-gray-400" /> —</span></div></td></>}
                    <td className="p-4 text-right">{actions(item)}</td>
                  </tr>)}</tbody>
                </table>
                {!filtered.length && <p role="status" className="p-8 text-center text-gray-500 text-sm">{trash ? 'No hay propiedades en la papelera.' : 'No se encontraron propiedades.'}</p>}
              </div>
              <div role="region" aria-label="Inventario móvil" tabIndex={0} className="md:hidden flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-3">
                {filtered.map(item => <div key={item.id} className={`p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-inmo-darkbg shadow-sm ${selected === item.id ? 'ring-1 ring-inmo-accent' : ''}`}>
                  <div className="flex items-start gap-3"><button className="flex flex-1 gap-3 min-w-0 text-left" onClick={() => onSelect(item.id)}><Cover property={item} /><span className="flex flex-col min-w-0"><span className="font-bold text-inmo-secondary dark:text-white line-clamp-2 text-sm leading-tight">{item.titulo}</span><span className="font-montserrat font-bold text-inmo-accent mt-1">{price(item)}</span></span></button></div>
                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-white/5"><Status state={item.estado_publicacion} />{actions(item)}</div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 font-montserrat tracking-wide mt-2"><span>{item.habitaciones} REC</span><span>•</span><span>{item.banos} BA</span><span>•</span><span>{item.superficie_construccion ?? item.superficie_terreno ?? '—'} m²</span></div>
                </div>)}
                {!filtered.length && <p role="status" className="p-8 text-center text-gray-500 text-sm">{trash ? 'No hay propiedades en la papelera.' : 'No se encontraron propiedades.'}</p>}
              </div>
            </>}
        </div>
      </div>
    </div>
  </ModuleLayout>;
}

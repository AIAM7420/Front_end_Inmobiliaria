import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, X } from 'lucide-react';
import { DropdownSelect } from './DropdownSelect';
import { Button } from '../atoms/Button';
import { useGetCatalog } from '../../integrations/backend/hooks/useProperties';
import { useAppContext } from '../../context/AppContext';
import type { CriteriosBusqueda, Sector } from '../../integrations/backend/types';

export interface FilterDropdownProps {
  isOpen: boolean;
  onApply: (criteria: CriteriosBusqueda) => void;
  onClose: () => void;
  className?: string;
  direction?: 'up' | 'down' | 'auto';
  initialCriteria?: CriteriosBusqueda;
}

export function FilterDropdown(props: FilterDropdownProps) {
  return props.isOpen ? <FilterPanel {...props} /> : null;
}

function FilterPanel({ onApply, onClose, className = '', direction = 'down', initialCriteria }: FilterDropdownProps) {
  const popupOwnerId = useId();
  const { globalFilters } = useAppContext();
  const zones = useGetCatalog('zonas');
  const [criteria, setCriteria] = useState<CriteriosBusqueda>(initialCriteria ?? globalFilters ?? {});
  const panel = useRef<HTMLDivElement>(null);
  const anchor = useRef(document.activeElement instanceof HTMLElement ? document.activeElement : null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  const [placement, setPlacement] = useState({ top: 80, left: 16, width: 360, maxHeight: 500 });
  useLayoutEffect(() => {
    const place = () => {
      const rect = anchor.current?.getBoundingClientRect();
      const width = Math.min(360, window.innerWidth - 32);
      const above = Math.max(0, (rect?.top ?? 72) - 24);
      const below = Math.max(0, window.innerHeight - (rect?.bottom ?? 72) - 24);
      const up = direction === 'up' || (direction === 'auto' && above > below);
      const height = Math.min(panel.current?.scrollHeight || 440, Math.max(100, up ? above : below));
      const top = up ? Math.max(16, (rect?.top ?? window.innerHeight - 16) - height - 8) : Math.max(16, (rect?.bottom ?? 72) + 8);
      setPlacement({ top, left: Math.max(16, Math.min((rect?.right ?? width + 16) - width, window.innerWidth - width - 16)), width, maxHeight: Math.min(height, window.innerHeight - top - 16) });
    };
    place(); window.addEventListener('resize', place); window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [direction]);
  useEffect(() => {
    panel.current?.querySelector<HTMLElement>('select,button')?.focus();
    const outside = (event: PointerEvent) => {
      if ((event.target as Element).closest?.('[data-inmo-dropdown-owner]')?.getAttribute('data-inmo-dropdown-owner') === popupOwnerId) return;
      if (!panel.current?.contains(event.target as Node) && !anchor.current?.contains(event.target as Node)) close.current();
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === 'Escape') { event.preventDefault(); close.current(); }
      if (event.key !== 'Tab') return;
      const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled),select,input') ?? []);
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', keyboard);
    const trigger = anchor.current;
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', keyboard); if (trigger?.isConnected) trigger.focus(); };
  }, [popupOwnerId]);
  const priceBand = criteria.precio_min === '3000000' ? 'over-3m' : criteria.precio_min === '1000000' && criteria.precio_max === '3000000' ? '1m-3m' : criteria.precio_max === '1000000' ? 'under-1m' : '';
  return createPortal(<div ref={panel} role="dialog" aria-label="Filtros de inmuebles" style={placement}
    className={`filter-dropdown-container fixed z-[100] overflow-y-auto overscroll-contain bg-white/95 dark:bg-inmo-darkcard/95 text-inmo-secondary dark:text-white backdrop-blur-xl p-5 rounded-3xl shadow-xl border border-gray-100 dark:border-inmo-darktertiary ${className}`}>
    <div className="flex items-center justify-between mb-4"><h2 className="font-montserrat font-bold">Filtros</h2><button type="button" aria-label="Cerrar filtros" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10"><X className="w-4 h-4" /></button></div>
    <div className="flex flex-col gap-3">
      <DropdownSelect label="Sector" popupOwnerId={popupOwnerId} value={criteria.sector ?? ''}
        onChange={value => setCriteria({ ...criteria, sector: value ? value as Sector : undefined })}
        options={[{ value: '', label: 'Todos los sectores' }, ...(['NORTE', 'SUR', 'ESTE', 'OESTE'] as const).map(sector => ({ value: sector, label: `Zona ${sector.toLowerCase()}` }))]} />
      <DropdownSelect label="Zona" popupOwnerId={popupOwnerId} value={criteria.zona_id ?? ''}
        onChange={value => setCriteria({ ...criteria, zona_id: value || undefined })} icon={<MapPin className="w-5 h-5 text-gray-400" />}
        options={[{ value: '', label: 'Todas las zonas' }, ...(zones.data ?? []).map(zone => ({ value: zone.id, label: zone.nombre }))]} />
      {zones.isPending && <p role="status" className="text-xs text-gray-500">Cargando zonas…</p>}
      {zones.isError && <p role="alert" className="text-xs text-inmo-danger">No pudimos cargar las zonas. Puedes buscar por sector o precio.</p>}
      <DropdownSelect label="Rango de precio" popupOwnerId={popupOwnerId} value={priceBand} onChange={band => {
        setCriteria({ ...criteria, precio_min: band === '1m-3m' ? '1000000' : band === 'over-3m' ? '3000000' : undefined, precio_max: band === 'under-1m' ? '1000000' : band === '1m-3m' ? '3000000' : undefined });
      }} options={[{ value: '', label: 'Todos los precios' }, { value: 'under-1m', label: 'Hasta $1M' }, { value: '1m-3m', label: '$1M - $3M' }, { value: 'over-3m', label: 'Más de $3M' }]} />
      <Button onClick={() => onApply(criteria)} className="w-full h-12 mt-1">Buscar propiedades</Button>
    </div>
  </div>, document.body);
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, X } from 'lucide-react';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { useGetCatalog } from '../../integrations/backend/hooks/useProperties';
import { useAppContext } from '../../context/AppContext';
import type { CriteriosBusqueda, Sector } from '../../integrations/backend/types';

export interface FilterDropdownProps {
  isOpen: boolean;
  onApply: (criteria: CriteriosBusqueda) => void;
  onClose: () => void;
  className?: string;
}

export function FilterDropdown(props: FilterDropdownProps) {
  return props.isOpen ? <FilterPanel {...props} /> : null;
}

function FilterPanel({ onApply, onClose, className = '' }: FilterDropdownProps) {
  const { globalFilters } = useAppContext();
  const zones = useGetCatalog('zonas');
  const [criteria, setCriteria] = useState<CriteriosBusqueda>(globalFilters ?? {});
  const panel = useRef<HTMLDivElement>(null);
  const anchor = useRef(document.activeElement instanceof HTMLElement ? document.activeElement : null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  const [placement, setPlacement] = useState({ top: 80, left: 16, width: 360, maxHeight: 500 });
  useLayoutEffect(() => {
    const place = () => {
      const rect = anchor.current?.getBoundingClientRect();
      const width = Math.min(360, window.innerWidth - 32);
      const top = Math.min(Math.max(16, (rect?.bottom ?? 72) + 8), Math.max(16, window.innerHeight - 320));
      setPlacement({ top, left: Math.max(16, Math.min((rect?.right ?? width + 16) - width, window.innerWidth - width - 16)), width, maxHeight: window.innerHeight - top - 16 });
    };
    place(); window.addEventListener('resize', place); window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, []);
  useEffect(() => {
    panel.current?.querySelector<HTMLElement>('select,button')?.focus();
    const outside = (event: PointerEvent) => {
      if (!panel.current?.contains(event.target as Node) && !anchor.current?.contains(event.target as Node)) close.current();
    };
    const keyboard = (event: KeyboardEvent) => {
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
  }, []);
  const priceBand = criteria.precio_min === '3000000' ? 'over-3m' : criteria.precio_min === '1000000' && criteria.precio_max === '3000000' ? '1m-3m' : criteria.precio_max === '1000000' ? 'under-1m' : '';
  return createPortal(<div ref={panel} role="dialog" aria-label="Filtros de inmuebles" style={placement}
    className={`filter-dropdown-container fixed z-[100] overflow-y-auto overscroll-contain bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-xl p-5 rounded-3xl shadow-xl border border-gray-100 dark:border-inmo-darktertiary ${className}`}>
    <div className="flex items-center justify-between mb-4"><h2 className="font-montserrat font-bold">Filtros</h2><button type="button" aria-label="Cerrar filtros" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10"><X className="w-4 h-4" /></button></div>
    <div className="flex flex-col gap-3">
      <Select aria-label="Sector" value={criteria.sector ?? ''} onChange={event => setCriteria({ ...criteria, sector: event.target.value ? event.target.value as Sector : undefined })}>
        <option value="">Todos los sectores</option>{(['NORTE', 'SUR', 'ESTE', 'OESTE'] as const).map(sector => <option key={sector} value={sector}>Zona {sector.toLowerCase()}</option>)}
      </Select>
      <Select aria-label="Zona" value={criteria.zona_id ?? ''} onChange={event => setCriteria({ ...criteria, zona_id: event.target.value || undefined })} leftIcon={<MapPin className="w-5 h-5 text-gray-400" />}>
        <option value="">Todas las zonas</option>{zones.data?.map(zone => <option key={zone.id} value={zone.id}>{zone.nombre}</option>)}
      </Select>
      {zones.isPending && <p role="status" className="text-xs text-gray-500">Cargando zonas…</p>}
      {zones.isError && <p role="alert" className="text-xs text-inmo-danger">No pudimos cargar las zonas. Puedes buscar por sector o precio.</p>}
      <Select aria-label="Rango de precio" value={priceBand} onChange={event => {
        const band = event.target.value;
        setCriteria({ ...criteria, precio_min: band === '1m-3m' ? '1000000' : band === 'over-3m' ? '3000000' : undefined, precio_max: band === 'under-1m' ? '1000000' : band === '1m-3m' ? '3000000' : undefined });
      }}>
        <option value="">Todos los precios</option><option value="under-1m">Hasta $1M</option><option value="1m-3m">$1M - $3M</option><option value="over-3m">Más de $3M</option>
      </Select>
      <Button onClick={() => onApply(criteria)} className="w-full h-12 mt-1">Buscar propiedades</Button>
    </div>
  </div>, document.body);
}

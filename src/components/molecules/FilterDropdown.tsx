import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { Skeleton } from '../atoms/Skeleton';
import { useGetCatalog } from '../../integrations/backend/hooks/useProperties';
import type { CriteriosBusqueda } from '../../integrations/backend/types';
export interface FilterDropdownProps {
  isOpen: boolean;
  onApply: (criteria: CriteriosBusqueda) => void;
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ isOpen, onApply, className = '' }) => {
  const zones = useGetCatalog('zonas');
  const [zoneId, setZoneId] = useState('');
  const [priceBand, setPriceBand] = useState('');

  const apply = () => {
    const criteria: CriteriosBusqueda = {};
    if (zoneId) criteria.zona_id = zoneId;
    if (priceBand === 'under-1m') criteria.precio_max = '1000000';
    if (priceBand === '1m-3m') {
      criteria.precio_min = '1000000';
      criteria.precio_max = '3000000';
    }
    if (priceBand === 'over-3m') criteria.precio_min = '3000000';
    onApply(criteria);
  };

  return (
    <div className={`w-full transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100 max-h-[400px]' : 'opacity-0 scale-y-95 max-h-0 overflow-hidden'} ${className}`}>
      <div className="bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-xl p-5 rounded-card shadow-xl border border-gray-100 dark:border-inmo-darktertiary/50 mb-3">
        <div className="flex flex-col gap-3">
          {zones.isPending ? <Skeleton className="w-full h-[46px]" /> : <Select
            aria-label="Zona"
            value={zoneId}
            onChange={(event) => setZoneId(event.target.value)}
            leftIcon={<MapPin className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
            className="!text-sm"
            wrapperClassName="!h-[46px] !bg-gray-50 dark:!bg-inmo-darkbg !shadow-none !px-4"
          >
            <option value="">Todas las zonas</option>
            {zones.data?.map((zone) => <option key={zone.id} value={zone.id}>{zone.nombre}</option>)}
          </Select>}
          {zones.isError && <p role="alert" className="text-xs text-inmo-danger font-inter">No pudimos cargar las zonas. Puedes buscar por precio.</p>}
          <Select 
            aria-label="Rango de precio"
            value={priceBand}
            onChange={(event) => setPriceBand(event.target.value)}
            leftIcon={<span className="w-5 h-5 text-gray-400 font-bold flex items-center justify-center font-montserrat">$</span>}
            className="!text-sm"
            wrapperClassName="!h-[46px] !bg-gray-50 dark:!bg-inmo-darkbg !shadow-none !px-4"
          >
            <option value="" className="text-black dark:text-white">Rango de precio</option>
            <option value="under-1m" className="text-black dark:text-white">Hasta $1M</option>
            <option value="1m-3m" className="text-black dark:text-white">$1M - $3M</option>
            <option value="over-3m" className="text-black dark:text-white">Más de $3M</option>
          </Select>
          <Button 
            onClick={apply}
            className="w-full h-12 mt-1"
          >
            Buscar propiedades
          </Button>
        </div>
      </div>
    </div>
  );
};

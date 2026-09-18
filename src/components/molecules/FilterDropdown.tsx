import React from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
export interface FilterDropdownProps {
  isOpen: boolean;
  onApply: () => void;
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ isOpen, onApply, className = '' }) => {
  return (
    <div className={`w-full transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100 max-h-[400px]' : 'opacity-0 scale-y-95 max-h-0 overflow-hidden'} ${className}`}>
      <div className="bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-xl p-5 rounded-card shadow-xl border border-gray-100 dark:border-inmo-darktertiary/50 mb-3">
        <div className="flex flex-col gap-3">
          <Input 
            type="text" 
            placeholder="Ubicación, colonia..." 
            leftIcon={<MapPin className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
            className="!text-sm"
            wrapperClassName="!h-[46px] !bg-gray-50 dark:!bg-inmo-darkbg !shadow-none !px-4"
          />
          <Select 
            leftIcon={<span className="w-5 h-5 text-gray-400 font-bold flex items-center justify-center font-montserrat">$</span>}
            className="!text-sm"
            wrapperClassName="!h-[46px] !bg-gray-50 dark:!bg-inmo-darkbg !shadow-none !px-4"
          >
            <option value="" className="text-black dark:text-white">Rango de precio</option>
            <option value="0-1M" className="text-black dark:text-white">Hasta $1M</option>
            <option value="1M-3M" className="text-black dark:text-white">$1M - $3M</option>
            <option value="3M+" className="text-black dark:text-white">Más de $3M</option>
          </Select>
          <Button 
            onClick={onApply}
            className="w-full h-12 mt-1"
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

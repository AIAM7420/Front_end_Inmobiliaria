import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { createPortal } from 'react-dom';

export interface FilterState {
  location: string;
  priceRange: string;
  sortBy: string;
}

export interface FilterDropdownProps {
  isOpen: boolean;
  onApply: (filters?: FilterState) => void;
  onClose: () => void;
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ isOpen, onApply, onClose, className = '' }) => {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('');
  return (
    <>
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-40 filter-backdrop" onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}></div>,
        document.body
      )}
      
      <div 
        className={`filter-dropdown-container absolute right-0 top-full mt-3 w-72 bg-white/60 dark:bg-black/60 backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] border-t border-l border-white/60 dark:border-white/20 z-50 overflow-hidden transition-all duration-200 origin-top-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        } ${className}`}
      >
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-inmo-secondary dark:text-white">Filtros avanzados</h3>
          </div>

          <div className="flex flex-col gap-3">
            <Input 
              type="text" 
              placeholder="Ubicación, colonia..." 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              leftIcon={<MapPin className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
              className="!text-sm"
              wrapperClassName="!h-[46px] !bg-gray-50 dark:!bg-inmo-darkbg !shadow-none !px-4"
            />
            
            <Select 
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              leftIcon={<span className="w-5 h-5 text-gray-400 font-bold flex items-center justify-center font-montserrat">$</span>}
              className="!text-sm"
              wrapperClassName="!h-[46px] !bg-gray-50 dark:!bg-inmo-darkbg !shadow-none !px-4"
            >
              <option value="" className="text-black dark:text-white">Rango de precio</option>
              <option value="0-1M" className="text-black dark:text-white">Hasta $1M</option>
              <option value="1M-3M" className="text-black dark:text-white">$1M - $3M</option>
              <option value="3M+" className="text-black dark:text-white">Más de $3M</option>
            </Select>

            <Select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="!text-sm"
              wrapperClassName="!h-[46px] !bg-gray-50 dark:!bg-inmo-darkbg !shadow-none !px-4"
            >
              <option value="" className="text-black dark:text-white">Ordenar por</option>
              <option value="recent" className="text-black dark:text-white">Más recientes</option>
              <option value="price-asc" className="text-black dark:text-white">Precio: Menor a mayor</option>
              <option value="price-desc" className="text-black dark:text-white">Precio: Mayor a menor</option>
              <option value="relevance" className="text-black dark:text-white">Relevancia</option>
            </Select>

            <Button 
              onClick={() => {
                onApply({ location, priceRange, sortBy });
                onClose();
              }}
              className="w-full h-12 mt-2"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

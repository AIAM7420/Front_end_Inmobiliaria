import React from 'react';
import { Globe, Home, Building2, Trees } from 'lucide-react';

export type PropertyCategory = 'casa' | 'departamento' | 'terreno';

export interface CategoryPillsProps {
  activeFilter: PropertyCategory | null;
  onSelectFilter: (filter: PropertyCategory | null) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

interface FilterButtonProps {
  id: PropertyCategory;
  label: string;
  Icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ id, label, Icon, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center flex-1 h-full px-1 bg-transparent border-none outline-none cursor-pointer group transition-transform ${isActive ? 'scale-105' : 'hover:scale-105'}`}
    >
      <div className={`relative flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-inmo-accent' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`}>
        <div className={`relative transition-transform duration-300 ${isActive ? '-translate-y-0.5' : 'translate-y-0'}`}>
          <Icon 
            className="w-5 h-5 md:w-6 md:h-6" 
            strokeWidth={isActive ? 2.5 : 2} 
          />
        </div>
      </div>
    </button>
  );
};

export const CategoryPills: React.FC<CategoryPillsProps> = ({ activeFilter, onSelectFilter, className = '', orientation = 'horizontal' }) => {
  const toggleFilter = (id: PropertyCategory) => {
    onSelectFilter(activeFilter === id ? null : id);
  };

  return (
    <div className={`${orientation === 'vertical' ? 'w-[52px] rounded-full flex-col py-1' : 'h-[52px] w-full max-w-sm rounded-full flex-row px-2'} bg-white/60 dark:bg-black/60 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] transition-all duration-300 select-none flex items-center justify-around gap-1 ${className}`}>
      <FilterButton id="casa" label="Casas" Icon={Home} isActive={activeFilter === 'casa'} onClick={() => toggleFilter('casa')} />
      <FilterButton id="departamento" label="Deptos" Icon={Building2} isActive={activeFilter === 'departamento'} onClick={() => toggleFilter('departamento')} />
      <FilterButton id="terreno" label="Lotes" Icon={Trees} isActive={activeFilter === 'terreno'} onClick={() => toggleFilter('terreno')} />
    </div>
  );
};

import React from 'react';
import { Home, Building2, Trees } from 'lucide-react';

export type PropertyCategory = 'casa' | 'departamento' | 'terreno';

export interface CategoryPillsProps {
  activeFilter: PropertyCategory | null;
  onSelectFilter: (filter: PropertyCategory | null) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'default' | 'small';
  showAllOption?: boolean;
}

interface FilterButtonProps {
  id: PropertyCategory;
  label: string;
  Icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ Icon, isActive, onClick }) => {
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

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  activeFilter,
  onSelectFilter,
  className = '',
  orientation = 'horizontal',
  size = 'default',
  showAllOption = false,
}) => {
  const toggleFilter = (id: PropertyCategory) => {
    onSelectFilter(activeFilter === id ? null : id);
  };

  if (size === 'small') {
    return (
      <div className={`h-[44px] rounded-full p-1 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex items-center gap-1 select-none overflow-x-auto hide-scrollbar ${className}`}>
        {showAllOption && (
          <button
            type="button"
            onClick={() => onSelectFilter(null)}
            className={`h-[34px] px-3 rounded-full text-xs font-inter font-semibold transition-all shrink-0 cursor-pointer flex items-center justify-center ${
              activeFilter === null
                ? 'bg-inmo-accent text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-inmo-secondary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            Todos
          </button>
        )}
        <button
          type="button"
          onClick={() => toggleFilter('casa')}
          className={`h-[34px] px-2.5 sm:px-3 rounded-full text-xs font-inter font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'casa'
              ? 'bg-inmo-accent text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-inmo-secondary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
          title="Casas"
        >
          <Home className="w-3.5 h-3.5 shrink-0" strokeWidth={activeFilter === 'casa' ? 2.5 : 2} />
          <span>Casas</span>
        </button>
        <button
          type="button"
          onClick={() => toggleFilter('departamento')}
          className={`h-[34px] px-2.5 sm:px-3 rounded-full text-xs font-inter font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'departamento'
              ? 'bg-inmo-accent text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-inmo-secondary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
          title="Departamentos"
        >
          <Building2 className="w-3.5 h-3.5 shrink-0" strokeWidth={activeFilter === 'departamento' ? 2.5 : 2} />
          <span>Deptos</span>
        </button>
        <button
          type="button"
          onClick={() => toggleFilter('terreno')}
          className={`h-[34px] px-2.5 sm:px-3 rounded-full text-xs font-inter font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'terreno'
              ? 'bg-inmo-accent text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-inmo-secondary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
          title="Terrenos y Lotes"
        >
          <Trees className="w-3.5 h-3.5 shrink-0" strokeWidth={activeFilter === 'terreno' ? 2.5 : 2} />
          <span>Lotes</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`${orientation === 'vertical' ? 'w-[52px] rounded-full flex-col py-1' : 'h-[52px] w-full max-w-sm rounded-full flex-row px-2'} bg-white/60 dark:bg-black/60 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] transition-all duration-300 select-none flex items-center justify-around gap-1 ${className}`}>
      <FilterButton id="casa" label="Casas" Icon={Home} isActive={activeFilter === 'casa'} onClick={() => toggleFilter('casa')} />
      <FilterButton id="departamento" label="Deptos" Icon={Building2} isActive={activeFilter === 'departamento'} onClick={() => toggleFilter('departamento')} />
      <FilterButton id="terreno" label="Lotes" Icon={Trees} isActive={activeFilter === 'terreno'} onClick={() => toggleFilter('terreno')} />
    </div>
  );
};

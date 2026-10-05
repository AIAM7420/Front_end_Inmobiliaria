import React from 'react';
import { Layers, Home, Building2, Trees, Store, Briefcase, Warehouse } from 'lucide-react';

export type PropertyCategory =
  | 'casa'
  | 'departamento'
  | 'terreno'
  | 'local_comercial'
  | 'oficina'
  | 'bodega';

export interface CategoryPillsProps {
  activeFilter: PropertyCategory | null;
  onSelectFilter: (filter: PropertyCategory | null) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'default' | 'small';
  showAllOption?: boolean;
}

export interface CategoryItem {
  id: PropertyCategory;
  label: string;
  shortLabel?: string;
  Icon: React.ElementType;
  title: string;
}

export const CATEGORY_ITEMS: CategoryItem[] = [
  { id: 'casa', label: 'Casa', shortLabel: 'Casas', Icon: Home, title: 'Casas' },
  { id: 'departamento', label: 'Departamento', shortLabel: 'Deptos', Icon: Building2, title: 'Departamentos' },
  { id: 'terreno', label: 'Terreno', shortLabel: 'Lotes', Icon: Trees, title: 'Terrenos y Lotes' },
  { id: 'local_comercial', label: 'Local comercial', shortLabel: 'Locales', Icon: Store, title: 'Locales comerciales' },
  { id: 'oficina', label: 'Oficina', shortLabel: 'Oficinas', Icon: Briefcase, title: 'Oficinas' },
  { id: 'bodega', label: 'Bodega', shortLabel: 'Bodegas', Icon: Warehouse, title: 'Bodegas' },
];

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  activeFilter,
  onSelectFilter,
  className = '',
  orientation = 'horizontal',
  size = 'default',
  showAllOption = true,
}) => {
  const toggleFilter = (id: PropertyCategory) => {
    onSelectFilter(activeFilter === id ? null : id);
  };

  if (orientation === 'vertical') {
    return (
      <div className={`w-[52px] rounded-full flex-col py-1.5 bg-white/75 dark:bg-black/60 backdrop-blur-2xl border border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] transition-all duration-300 select-none flex items-center justify-around gap-1 ${className}`}>
        {showAllOption && (
          <button
            type="button"
            onClick={() => onSelectFilter(null)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              activeFilter === null ? 'bg-inmo-accent text-white shadow-sm' : 'text-gray-500 hover:text-inmo-secondary'
            }`}
            title="Todos"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}
        {CATEGORY_ITEMS.map(({ id, Icon, title }) => (
          <button
            key={id}
            type="button"
            onClick={() => toggleFilter(id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              activeFilter === id ? 'bg-inmo-accent text-white shadow-sm' : 'text-gray-500 hover:text-inmo-secondary'
            }`}
            title={title}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    );
  }

  if (size === 'small') {
    return (
      <div className={`h-[44px] rounded-full p-1 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex items-center gap-1 select-none overflow-x-auto hide-scrollbar ${className}`}>
        {showAllOption && (
          <button
            type="button"
            onClick={() => onSelectFilter(null)}
            className={`h-[34px] px-3 rounded-full text-xs font-inter font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeFilter === null
                ? 'bg-inmo-accent text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-inmo-secondary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
            title="Todos"
          >
            <Layers className="w-3.5 h-3.5 shrink-0" strokeWidth={activeFilter === null ? 2.5 : 2} />
            <span>Todos</span>
          </button>
        )}
        {CATEGORY_ITEMS.map(({ id, label, shortLabel, Icon, title }) => {
          const isActive = activeFilter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleFilter(id)}
              className={`h-[34px] px-2.5 sm:px-3 rounded-full text-xs font-inter font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-inmo-accent text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-inmo-secondary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
              title={title}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span>{shortLabel ?? label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`h-[46px] md:h-[48px] rounded-full p-1 bg-white/75 dark:bg-black/60 backdrop-blur-2xl border border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] flex items-center gap-1 select-none overflow-x-auto hide-scrollbar ${className}`}
    >
      {showAllOption && (
        <button
          type="button"
          onClick={() => onSelectFilter(null)}
          className={`h-[36px] md:h-[38px] px-3 md:px-3.5 rounded-full text-xs md:text-sm font-inter font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeFilter === null
              ? 'bg-inmo-accent text-white shadow-md'
              : 'text-inmo-secondary dark:text-gray-300 hover:text-inmo-accent dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
          }`}
          title="Todas las categorías"
        >
          <Layers className="w-4 h-4 shrink-0" strokeWidth={activeFilter === null ? 2.5 : 2} />
          <span>Todos</span>
        </button>
      )}

      {CATEGORY_ITEMS.map(({ id, label, Icon, title }) => {
        const isActive = activeFilter === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggleFilter(id)}
            className={`h-[36px] md:h-[38px] px-3 md:px-3.5 rounded-full text-xs md:text-sm font-inter font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              isActive
                ? 'bg-inmo-accent text-white shadow-md'
                : 'text-inmo-secondary dark:text-gray-300 hover:text-inmo-accent dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title={title}
          >
            <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

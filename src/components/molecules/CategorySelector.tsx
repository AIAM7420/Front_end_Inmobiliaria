import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Layers } from 'lucide-react';
import { CATEGORY_ITEMS, type PropertyCategory } from './CategoryPills';

export interface CategorySelectorProps {
  activeFilter: PropertyCategory | null;
  onSelectFilter: (category: PropertyCategory | null) => void;
  className?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  activeFilter,
  onSelectFilter,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const activeItem = activeFilter
    ? CATEGORY_ITEMS.find((item) => item.id === activeFilter)
    : null;

  const ActiveIcon = activeItem ? activeItem.Icon : Layers;
  const activeLabel = activeItem ? activeItem.label : 'Todos';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full h-[44px] bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm rounded-full px-4 flex items-center justify-between gap-2.5 transition-all text-inmo-secondary dark:text-white cursor-pointer active:scale-[0.98]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-full bg-inmo-accent/10 dark:bg-inmo-accent/20 flex items-center justify-center shrink-0">
            <ActiveIcon className="w-3.5 h-3.5 text-inmo-accent" strokeWidth={2.5} />
          </div>
          <span className="text-xs font-montserrat font-bold truncate">
            {activeLabel}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 dark:border-white/10 p-1.5 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 max-h-[320px] overflow-y-auto custom-scrollbar"
        >
          {/* Opción Todos */}
          <button
            type="button"
            role="option"
            aria-selected={activeFilter === null}
            onClick={() => {
              onSelectFilter(null);
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-inter font-semibold flex items-center justify-between transition-colors cursor-pointer ${
              activeFilter === null
                ? 'bg-inmo-accent/10 text-inmo-accent font-bold dark:bg-inmo-accent/20'
                : 'text-inmo-secondary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-inmo-accent shrink-0" strokeWidth={activeFilter === null ? 2.5 : 2} />
              <span>Todos</span>
            </div>
            {activeFilter === null && <Check className="w-4 h-4 text-inmo-accent shrink-0" strokeWidth={2.5} />}
          </button>

          {/* Opciones individuales */}
          {CATEGORY_ITEMS.map(({ id, label, Icon }) => {
            const isSelected = activeFilter === id;
            return (
              <button
                key={id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelectFilter(id);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-inter font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-inmo-accent/10 text-inmo-accent font-bold dark:bg-inmo-accent/20'
                    : 'text-inmo-secondary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-inmo-accent shrink-0" strokeWidth={isSelected ? 2.5 : 2} />
                  <span>{label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-inmo-accent shrink-0" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';
import { SearchBar } from '../molecules/SearchBar';

export interface ModuleLayoutProps {
  title: string;
  subtitle?: string;
  isFullScreen?: boolean;
  
  // Search & Filters
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchWidthClass?: string;
  
  showFilters?: boolean;
  filtersContent?: React.ReactNode;
  isFiltersOpen?: boolean;
  onToggleFilters?: () => void;
  onCloseFilters?: () => void;
  
  // Custom Actions (e.g., Bot Button)
  actions?: React.ReactNode;
  
  // Custom content to render on the right side of the Title row (e.g., Notifications, Period Selector)
  headerEndContent?: React.ReactNode;
  
  // Custom class to restrict width and alignment of the controls area (search/filters)
  controlsMaxWidthClass?: string;

  // Prevent default scroll behavior to allow children to handle their own scroll
  noScroll?: boolean;
  
  children: React.ReactNode;
}

export const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  title,
  subtitle,
  isFullScreen = false,
  showSearch = true,
  searchPlaceholder = 'Buscar...',
  searchValue,
  onSearchChange,
  searchWidthClass = 'flex-1',
  showFilters = true,
  filtersContent,
  isFiltersOpen = false,
  onToggleFilters,
  onCloseFilters,
  actions,
  headerEndContent,
  controlsMaxWidthClass = '',
  noScroll = false,
  children
}) => {
  return (
    <div className={`px-4 md:px-6 flex flex-col w-full h-full ${
      isFullScreen ? 'pt-[104px]' : 'pt-0 pb-24'
    }`}>
      {/* Title Area */}
      <div className="mt-2 mb-6 w-full flex justify-between items-start md:items-center relative">
        <div className="flex flex-col">
          <h1 className="font-montserrat font-bold text-3xl text-inmo-secondary dark:text-white mb-2">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 font-inter text-sm">
              {subtitle}
            </p>
          )}
        </div>
        {headerEndContent && (
          <div className="flex items-center">
            {headerEndContent}
          </div>
        )}
      </div>

      {/* Search Bar & Actions */}
      {(showSearch || actions) && (
        <div className={`w-full flex flex-col gap-3 shrink-0 mb-6 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${controlsMaxWidthClass}`}>
          <div className="flex gap-3 w-full items-center">
            {showSearch && (
              <SearchBar
                placeholder={searchPlaceholder}
                size="slim"
                className={searchWidthClass}
                value={searchValue}
                onChange={onSearchChange ? (e: any) => onSearchChange(e.target.value) : undefined}
              />
            )}

            {actions}

            {showFilters && onToggleFilters && (
              <IconButton 
                onClick={onToggleFilters}
                icon={<SlidersHorizontal className="w-5 h-5" strokeWidth={2} />}
                variant="secondary"
                className="w-[44px] h-[44px] !bg-white/40 dark:!bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 !shadow-sm hover:!bg-white/60 dark:hover:!bg-black/40 shrink-0"
              />
            )}
          </div>

          {/* Expandable Dropdown Filters */}
          {showFilters && filtersContent && (
            <div className={`w-full pointer-events-auto transition-all duration-300 ease-in-out origin-top ${isFiltersOpen ? 'opacity-100 scale-y-100 max-h-[1000px]' : 'opacity-0 scale-y-95 max-h-0 overflow-hidden'}`}>
              <div className="bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-xl p-5 rounded-card shadow-xl border border-gray-100 dark:border-inmo-darktertiary/50 mb-1">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Filtros Avanzados</span>
                    <button 
                      onClick={onCloseFilters}
                      className="text-[11px] font-semibold text-inmo-accent hover:text-inmo-secondary dark:hover:text-white transition-colors flex items-center gap-1"
                    >
                      Cerrar <X className="w-3 h-3" />
                    </button>
                  </div>
                  
                  {filtersContent}
                  
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 min-h-0 h-full relative overflow-x-hidden ${noScroll ? 'flex flex-col overflow-hidden' : 'overflow-y-auto max-md:hide-scrollbar pb-32 md:pb-6'} p-2 -m-2`}>
        {children}
      </div>
    </div>
  );
};

import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  titleMaxWidthClass?: string;

  // Prevent default scroll behavior to allow children to handle their own scroll
  noScroll?: boolean;
  noBottomPadding?: boolean;

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
  titleMaxWidthClass = '',
  noScroll = false,
  noBottomPadding = false,
  children
}) => {
  const filterAnchor = useRef<HTMLDivElement>(null);
  return (
    <div className={`px-4 md:px-6 flex flex-col w-full h-full overflow-hidden ${
      isFullScreen ? 'pt-[104px]' : 'pt-0 pb-24'
    }`}>
      {/* Title Area */}
      <div className={`mt-2 mb-6 w-full shrink-0 flex justify-between items-start md:items-center relative transition-all duration-500 ${titleMaxWidthClass}`}>
        <div className="flex flex-col">
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-inmo-secondary dark:text-white mb-2">{title}</h1>
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
                onChange={onSearchChange}
              />
            )}

            {actions}

            {showFilters && onToggleFilters && (
              <div className="relative" ref={filterAnchor}>
                <IconButton
                  aria-label="Abrir filtros del panel"
                  onClick={onToggleFilters}
                  icon={<SlidersHorizontal className="w-5 h-5" strokeWidth={2} />}
                  variant="secondary"
                  className="w-[44px] h-[44px] !bg-white/40 dark:!bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 !shadow-sm hover:!bg-white/60 dark:hover:!bg-black/40 shrink-0"
                />

                {isFiltersOpen && filtersContent && <ModuleFilterPopover anchor={filterAnchor} onClose={() => onCloseFilters?.()}>{filtersContent}</ModuleFilterPopover>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        onScroll={(e) => {
          window.dispatchEvent(new CustomEvent('app-scroll', { detail: { scrollY: (e.target as HTMLDivElement).scrollTop } }));
        }}
        className={`flex-1 min-h-0 h-full relative overflow-x-hidden flex flex-col ${noScroll ? 'overflow-hidden' : `overflow-y-auto max-md:hide-scrollbar ${noBottomPadding ? 'pb-24 md:pb-6' : 'pb-32 md:pb-6'}`} p-2 -m-2`}
      >
        {children}
      </div>
    </div>
  );
};

// Keep the overlay and panel in the same stacking context; transformed split
// layouts must never place a body-level overlay above their own controls.
function ModuleFilterPopover({ anchor, onClose, children }: { anchor: React.RefObject<HTMLDivElement | null>; onClose: () => void; children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(null);
  useLayoutEffect(() => {
    const place = () => {
      const rect = anchor.current?.getBoundingClientRect(); if (!rect) return;
      const width = Math.min(288, innerWidth - 32), below = innerHeight - rect.bottom - 28, above = rect.top - 28;
      const up = below < 250 && above > below, maxHeight = Math.max(80, Math.min(380, up ? above : below));
      setPlacement({ top: up ? Math.max(16, rect.top - maxHeight - 12) : Math.max(16, Math.min(rect.bottom + 12, innerHeight - maxHeight - 16)), left: Math.max(16, Math.min(rect.right - width, innerWidth - width - 16)), width, maxHeight });
    };
    place(); window.addEventListener('resize', place); document.addEventListener('scroll', place, true);
    const trigger = anchor.current?.querySelector('button');
    return () => { window.removeEventListener('resize', place); document.removeEventListener('scroll', place, true); trigger?.focus({ preventScroll: true }); };
  }, [anchor]);
  const ready = placement !== null;
  useLayoutEffect(() => { if (ready) panel.current?.querySelector('button')?.focus({ preventScroll: true }); }, [ready]);
  if (!placement) return null;
  return createPortal(<div className="fixed inset-0 z-[90]" onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={panel} role="dialog" aria-label="Filtros del panel" style={placement}
      onKeyDown={event => { if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); event.stopPropagation(); onClose(); } }}
      className="fixed p-5 flex flex-col gap-3 overflow-y-auto overscroll-contain bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 dark:border-white/10">
      <div className="flex items-center justify-between"><span className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Filtros Avanzados</span><button type="button" aria-label="Cerrar filtros del panel" onClick={onClose} className="w-11 h-11 rounded-full flex items-center justify-center text-inmo-accent"><X className="w-4 h-4" /></button></div>
      {children}
    </div>
  </div>, document.body);
}

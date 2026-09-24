import React, { useState, useEffect } from 'react';
import { IconButton } from '../atoms/IconButton';
import { SlidersHorizontal, X } from 'lucide-react';
import { SearchBar } from '../molecules/SearchBar';
import { ConnectedPropertyCard } from '../organisms/ConnectedPropertyCard';
import { BottomSheet } from '../organisms/BottomSheet';
import { PropertyDetailView } from '../organisms/PropertyDetailView';
import { PropertyCardSkeleton } from '../molecules/PropertyCardSkeleton';
import { Skeleton } from '../atoms/Skeleton';
import { ConnectedHero } from '../organisms/ConnectedHero';
import { FilterDropdown } from '../molecules/FilterDropdown';
import { useGetProperties } from '../../integrations/backend/hooks/useProperties';
import { useSearchProperties } from '../../integrations/backend/hooks/useSearch';
import { useChatbotQuery } from '../../integrations/backend/hooks/useNlp';
import type { CriteriosBusqueda } from '../../integrations/backend/types';

/** Skeleton that mimics the horizontal PropertyDetailView layout */
const PropertyDetailSkeleton: React.FC = () => (
  <div className="flex flex-col md:flex-row bg-white dark:bg-inmo-darkcard rounded-[32px] p-2 md:p-4 overflow-hidden w-full h-full gap-6 animate-in fade-in duration-300">
    {/* Left: Image skeleton */}
    <div className="w-full md:w-[50%] flex flex-col gap-3 shrink-0 h-full">
      <Skeleton className="w-full flex-1 min-h-[200px]" variant="rectangular" />
      <div className="flex gap-3 shrink-0">
        <Skeleton className="w-[140px] h-[100px] shrink-0" variant="rectangular" />
        <Skeleton className="w-[140px] h-[100px] shrink-0" variant="rectangular" />
        <Skeleton className="w-[140px] h-[100px] shrink-0" variant="rectangular" />
      </div>
    </div>
    {/* Right: Content skeleton */}
    <div className="w-full md:w-[50%] flex flex-col pt-2 md:pt-2 md:pl-2 min-w-0 gap-4">
      {/* Title */}
      <Skeleton className="w-3/4 h-6" variant="text" />
      {/* Location + Price */}
      <div className="flex justify-between items-end">
        <Skeleton className="w-1/2 h-4" variant="text" />
        <Skeleton className="w-24 h-8" variant="text" />
      </div>
      {/* Description */}
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-3" variant="text" />
        <Skeleton className="w-full h-3" variant="text" />
        <Skeleton className="w-2/3 h-3" variant="text" />
      </div>
      {/* Amenities */}
      <div className="flex gap-2">
        <Skeleton className="flex-1 h-10" variant="rectangular" />
        <Skeleton className="flex-1 h-10" variant="rectangular" />
        <Skeleton className="flex-1 h-10" variant="rectangular" />
      </div>
      {/* Map */}
      <Skeleton className="w-full flex-1 min-h-[60px] max-h-[120px]" variant="rectangular" />
      {/* Action bar */}
      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-inmo-darktertiary flex justify-center">
        <Skeleton className="w-full max-w-[400px] h-[64px] !rounded-full" variant="rectangular" />
      </div>
    </div>
  </div>
);

export interface LandingTemplateProps {}

export const SplitLandingTemplate: React.FC<LandingTemplateProps> = () => {
  const catalog = useGetProperties({ limit: 20 });
  const filteredSearch = useSearchProperties();
  const chatbot = useChatbotQuery();
  const [source, setSource] = useState<'catalog' | 'filtered' | 'chatbot'>('catalog');
  const [isWireframeMode, setIsWireframeMode] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsWireframeMode(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const properties = source === 'filtered'
    ? filteredSearch.data?.items ?? []
    : source === 'chatbot'
      ? chatbot.data?.resultados ?? []
      : catalog.data?.items ?? [];
  const selectedProperty = properties.find((item) => item.id === selectedPropertyId);
  const isLoading = catalog.isLoading || filteredSearch.isPending || chatbot.isPending;
  const isError = catalog.isError || filteredSearch.isError || chatbot.isError;

  const handleSelectProperty = (id: string) => {
    if (selectedPropertyId === id) {
      setSelectedPropertyId(null);
      setIsSheetOpen(false);
      return;
    }

    setSelectedPropertyId(id);
    setIsSheetOpen(true);
  };

  const applyFilters = (criteria: CriteriosBusqueda) => {
    setIsFiltersOpen(false);
    setSelectedPropertyId(null);
    if (Object.keys(criteria).length === 0) {
      setSource('catalog');
      return;
    }
    filteredSearch.mutate({ criteria, params: { limit: 20 } }, { onSuccess: () => setSource('filtered') });
  };

  const searchText = (texto: string) => {
    setSelectedPropertyId(null);
    chatbot.mutate(texto, { onSuccess: () => setSource('chatbot') });
  };

  return (
    <div className="flex w-full h-screen overflow-hidden relative bg-gray-50 dark:bg-inmo-darkbg">
      
      {/* LADO IZQUIERDO: DETALLE DE PROPIEDAD (Desktop) */}
      <div 
        className={`hidden md:flex flex-col h-full relative z-10 overflow-hidden transform-gpu will-change-[width,opacity] transition-[width,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          selectedPropertyId ? 'w-1/2 opacity-100 pt-[100px] pl-4 pr-4 pb-4 pointer-events-auto' : 'w-0 opacity-0 p-0 pointer-events-none'
        }`}
      >
        <div className="w-full h-full min-w-[400px] bg-white dark:bg-inmo-darkcard rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-inmo-darktertiary overflow-hidden flex flex-col relative">
          
          {/* Header / Close button flotante */}
          <div className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/80 dark:bg-inmo-darkcard/80 backdrop-blur-xl border-b border-gray-100 dark:border-inmo-darktertiary">
             <h3 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">Detalle de Propiedad</h3>
             <IconButton 
               onClick={() => setSelectedPropertyId(null)}
               icon={<X className="w-5 h-5 text-gray-500" strokeWidth={2} />}
               variant="secondary"
               className="!w-10 !h-10 !bg-gray-100 dark:!bg-inmo-darkbg hover:!bg-gray-200 dark:hover:!bg-inmo-darktertiary !shadow-none !rounded-full shrink-0"
             />
          </div>

          <div className="flex-1 p-0 md:p-4">
            {selectedPropertyId && (selectedProperty ? <PropertyDetailView
              propertyId={selectedPropertyId}
              preview={selectedProperty}
              layout="horizontal"
            /> : <PropertyDetailSkeleton />)}
          </div>
        </div>
      </div>

      {/* LADO DERECHO: LANDING ORIGINAL */}
      <div 
        className={`h-full overflow-y-auto w-full relative transform-gpu will-change-[width] transition-[width,border-radius] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          selectedPropertyId ? 'md:w-1/2 md:rounded-[32px] my-2' : 'md:w-full'
        }`}
      >
        <main className="px-6 flex flex-col gap-8 pt-[100px] pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {isWireframeMode ? (
            <div className="w-full h-[220px] rounded-[32px] bg-gray-200 dark:bg-inmo-darkcard animate-pulse mt-2 shadow-sm" />
          ) : (
            <ConnectedHero propertyId={catalog.data?.items[0]?.id} />
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-150">
              <div className="flex items-center gap-2 w-full">
                <SearchBar 
                  placeholder="Buscar propiedades..." 
                  onSubmit={searchText}
                  size="slim" 
                  glass 
                  className="flex-1 shadow-lg" 
                />
                <IconButton 
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  aria-label="Abrir filtros"
                  icon={<SlidersHorizontal className="w-5 h-5" strokeWidth={2} />}
                  variant="secondary"
                  className="w-[44px] h-[44px] !bg-white/40 dark:!bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 !shadow-sm hover:!bg-white/60 dark:hover:!bg-black/40 shrink-0"
                />
              </div>

              <FilterDropdown isOpen={isFiltersOpen} onApply={applyFilters} />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-section-label">
                Explorar Catálogo
              </h3>
            </div>

            {source === 'chatbot' && chatbot.data?.aclaracion && <p role="status" className="font-inter text-sm text-gray-600 dark:text-gray-300">
              {chatbot.data.aclaracion}
            </p>}
            {isError && <div role="alert" className="rounded-2xl bg-red-50 dark:bg-inmo-darkcard border border-inmo-danger/20 p-4 font-inter text-sm text-inmo-danger">
              No pudimos cargar las propiedades. Inténtalo de nuevo más tarde.
            </div>}

            <div
              className={`grid gap-6 transition-all duration-500 ${
                selectedPropertyId ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
              }`}
            >
              {(isWireframeMode || isLoading)
                ? Array.from({ length: 4 }).map((_, idx) => <PropertyCardSkeleton key={idx} />)
                : properties.map((property) => (
                <ConnectedPropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => handleSelectProperty(property.id)}
                />
              ))}
            </div>
            {!isLoading && !isError && properties.length === 0 && <p role="status" className="font-inter text-sm text-gray-500 dark:text-gray-400">
              No encontramos propiedades con esos criterios.
            </p>}
          </div>

        </main>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      <div className="md:hidden">
        <BottomSheet 
          isOpen={isSheetOpen} 
          onClose={() => {
             setIsSheetOpen(false);
             setTimeout(() => setSelectedPropertyId(null), 300);
          }}
          title="Detalle de Propiedad"
          defaultExpanded={false}
          noPadding={true}
          isHero={true}
        >
          {selectedPropertyId && (selectedProperty ? <PropertyDetailView
            propertyId={selectedPropertyId}
            preview={selectedProperty}
          /> : <PropertyDetailSkeleton />)}
        </BottomSheet>
      </div>
    </div>
  );
};

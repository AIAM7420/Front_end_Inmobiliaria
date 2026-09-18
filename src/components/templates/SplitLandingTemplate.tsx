import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { IconButton } from '../atoms/IconButton';
import { SlidersHorizontal, X } from 'lucide-react';
import { SearchBar } from '../molecules/SearchBar';
import { PropertyCard } from '../molecules/PropertyCard';
import { BottomSheet } from '../organisms/BottomSheet';
import { PropertyDetailView } from '../organisms/PropertyDetailView';
import { PropertyCardSkeleton } from '../molecules/PropertyCardSkeleton';
import { Skeleton } from '../atoms/Skeleton';
import { PropertyModal } from '../organisms/PropertyModal';
import { HeroCarousel } from '../organisms/HeroCarousel';
import { PromoBanner } from '../molecules/PromoBanner';
import { FilterDropdown } from '../molecules/FilterDropdown';
import { MOCK_PROPERTIES } from '../../data/mockProperties';

const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
];

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
  const [isWireframeMode, setIsWireframeMode] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsWireframeMode(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // --- Loading states ---
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  /** Simulate async data fetch when selecting a property */
  const handleSelectProperty = useCallback((id: number) => {
    if (selectedPropertyId === id) {
      setSelectedPropertyId(null);
      setIsSheetOpen(false);
      return;
    }

    setSelectedPropertyId(id);
    setIsSheetOpen(true);
    setIsDetailLoading(true);

    // Simulate network latency for property detail
    const timer = setTimeout(() => setIsDetailLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedPropertyId]);

  /** Simulate catalog refresh (call this when filters/search change) */
  const simulateCatalogLoad = useCallback(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

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
            {selectedPropertyId && (
              isDetailLoading ? (
                <PropertyDetailSkeleton />
              ) : (
                <PropertyDetailView 
                  property={MOCK_PROPERTIES.find(p => p.id === selectedPropertyId)!} 
                  layout="horizontal"
                />
              )
            )}
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
            <HeroCarousel images={CAROUSEL_IMAGES} />
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-150">
              <div className="flex items-center gap-2 w-full">
                <SearchBar 
                  placeholder="Buscar propiedades..." 
                  size="slim" 
                  glass 
                  className="flex-1 shadow-lg" 
                />
                <IconButton 
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  icon={<SlidersHorizontal className="w-5 h-5" strokeWidth={2} />}
                  variant="secondary"
                  className="w-[44px] h-[44px] !bg-white/40 dark:!bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 !shadow-sm hover:!bg-white/60 dark:hover:!bg-black/40 shrink-0"
                />
              </div>

              <FilterDropdown isOpen={isFiltersOpen} onApply={() => setIsFiltersOpen(false)} />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-section-label">
                Explorar Catálogo
              </h3>
            </div>

            <div
              className={`grid gap-6 transition-all duration-500 ${
                selectedPropertyId ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
              }`}
            >
              {(isWireframeMode || isLoading)
                ? Array.from({ length: 4 }).map((_, idx) => <PropertyCardSkeleton key={idx} />)
                : MOCK_PROPERTIES.map((property) => (
                <PropertyCard
                  key={property.id}
                  image={property.image}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  beds={property.beds}
                  baths={property.baths}
                  sqft={property.sqft}
                  tags={(property as any).tags}
                  isFavorite={property.isFavorite}
                  onClick={() => handleSelectProperty(property.id)}
                />
              ))}
            </div>
          </div>

          {isWireframeMode ? (
            <div className="w-full h-[180px] rounded-card bg-gray-200 dark:bg-inmo-darkcard animate-pulse shadow-sm" />
          ) : (
            <PromoBanner 
              title="¿Necesitas remodelar antes de vender?"
              description="Aumenta el valor de tu propiedad con nuestro equipo de expertos en remodelación. Cotiza sin compromiso."
              buttonText="Más información"
            />
          )}

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
          {selectedPropertyId && (
            isDetailLoading ? (
              <div className="p-6 flex flex-col gap-4">
                <Skeleton className="w-full h-[200px]" variant="rectangular" />
                <Skeleton className="w-3/4 h-5" variant="text" />
                <Skeleton className="w-1/2 h-4" variant="text" />
                <Skeleton className="w-1/3 h-8" variant="text" />
                <div className="flex gap-2">
                  <Skeleton className="flex-1 h-10" variant="rectangular" />
                  <Skeleton className="flex-1 h-10" variant="rectangular" />
                  <Skeleton className="flex-1 h-10" variant="rectangular" />
                </div>
              </div>
            ) : (
              <PropertyDetailView 
                property={MOCK_PROPERTIES.find(p => p.id === selectedPropertyId)!} 
              />
            )
          )}
        </BottomSheet>
      </div>
    </div>
  );
};

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
import { SplitViewLayout } from './SplitViewLayout';
import { HeroCarousel } from '../organisms/HeroCarousel';
import { PromoBanner } from '../molecules/PromoBanner';
import { FilterDropdown } from '../molecules/FilterDropdown';
import { MOCK_PROPERTIES } from '../../data/mockProperties';
import { AsesorChat } from '../organisms/AsesorChat';

const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
];

const PropertyDetailSkeleton: React.FC = () => (
  <div className="flex flex-col md:flex-row w-full h-full gap-8 animate-in fade-in duration-300">
    {/* Left: Main Image Placeholder */}
    <div className="w-full md:w-[50%] flex flex-col h-full gap-4">
      <Skeleton className="w-full flex-1 rounded-[24px]" variant="rectangular" />
      <div className="flex gap-4 h-[120px] shrink-0">
        <Skeleton className="flex-1 rounded-[16px]" variant="rectangular" />
        <Skeleton className="flex-1 rounded-[16px]" variant="rectangular" />
      </div>
    </div>
    
    {/* Right: Simplified Content Hierarchy */}
    <div className="w-full md:w-[50%] flex flex-col gap-8 md:pt-4">
      {/* Title & Price Area */}
      <div className="flex flex-col gap-3">
        <Skeleton className="w-4/5 h-8" variant="text" />
        <Skeleton className="w-1/3 h-10" variant="text" />
      </div>
      
      {/* Abstract Content Lines */}
      <div className="flex flex-col gap-3">
        <Skeleton className="w-full h-4" variant="text" />
        <Skeleton className="w-full h-4" variant="text" />
        <Skeleton className="w-3/4 h-4" variant="text" />
      </div>
      
      {/* Amenities row abstract */}
      <div className="flex gap-2 mt-2">
        <Skeleton className="flex-1 h-10 rounded-xl" variant="rectangular" />
        <Skeleton className="flex-1 h-10 rounded-xl" variant="rectangular" />
        <Skeleton className="flex-1 h-10 rounded-xl" variant="rectangular" />
      </div>

      {/* Map abstract */}
      <Skeleton className="w-full flex-1 min-h-[120px] rounded-[20px] mt-2" variant="rectangular" />
      
      {/* CTA Button Placeholder */}
      <div className="mt-auto pt-4 flex justify-center">
        <Skeleton className="w-full h-[56px] !rounded-full max-w-[300px]" variant="rectangular" />
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

  const [isViewingProfile, setIsViewingProfile] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isSplitOpen, setIsSplitOpen] = useState(false);
  const [gridMode, setGridMode] = useState<'full' | 'split'>('full');
  const [isTransitioning, setIsTransitioning] = useState(false);

  /** Simulate async data fetch when selecting a property */
      const handleSelectProperty = useCallback((id: number) => {
    if (selectedPropertyId === id) {
      setIsSplitOpen(false);
      setIsSheetOpen(false);
      setIsViewingProfile(false);
      setIsTransitioning(true);
      setGridMode('full');
      setTimeout(() => {
        setSelectedPropertyId(null);
        setIsTransitioning(false);
      }, 500);
      return;
    }

    setSelectedPropertyId(id);
    setIsSplitOpen(true);
    setIsSheetOpen(true);
    setIsDetailLoading(true);
    setIsViewingProfile(false);
    setIsTransitioning(true);

    const timer = setTimeout(() => setIsDetailLoading(false), 800);
    setTimeout(() => {
      setGridMode('split');
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedPropertyId]);

  /** Simulate catalog refresh (call this when filters/search change) */
  const simulateCatalogLoad = useCallback(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const landingGrid = (
    <main className={`px-6 flex flex-col gap-8 pt-[100px] pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500 transition-all ${isTransitioning ? 'blur-[2px] opacity-80 pointer-events-none' : ''}`}>
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

        <div
          className={`grid gap-6 transition-all duration-500 ${
            gridMode === 'split' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
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
  );

  return (
    <>
      <SplitViewLayout
        isOpen={isSplitOpen}
        onClose={(isViewingProfile || isChatting) ? undefined : () => {
          setIsSplitOpen(false);
          setIsSheetOpen(false);
          setIsViewingProfile(false);
          setIsChatting(false);
          setIsTransitioning(true);
          setGridMode('full');
          setTimeout(() => {
            setSelectedPropertyId(null);
            setIsTransitioning(false);
          }, 500);
        }}
        onBack={isChatting ? () => setIsChatting(false) : isViewingProfile ? () => setIsViewingProfile(false) : undefined}
        sideTitle={isChatting ? "Chat con Asesor" : isViewingProfile ? "Perfil del Asesor" : "Detalle de Propiedad"}
        sidePanelWidthClass={(isViewingProfile || isChatting) ? "w-[30%] lg:w-[30%] xl:w-[30%]" : "w-[50%] lg:w-[50%] xl:w-[50%]"}
        mainPanelWidthClass={(isViewingProfile || isChatting) ? "w-[70%] lg:w-[70%] xl:w-[70%]" : "md:w-[50%] lg:w-[50%] xl:w-[50%]"}
        bottomSheetHeightMode={(isViewingProfile || isChatting) ? 'content' : 'fixed-75'}
        bottomSheetIsHero={!(isViewingProfile || isChatting)}
        bottomSheetNoPadding={true}
        bottomSheetFullHeight={true}
        sideContent={
          selectedPropertyId && (
            isDetailLoading ? (
              <PropertyDetailSkeleton />
            ) : isChatting ? (
              <div className="w-full h-full bg-white dark:bg-inmo-darkcard overflow-hidden">
                <AsesorChat hideHeader={true} asesorName="Daniel Ayomide" initialMessage="¡Hola! Veo que te interesa la propiedad, ¿en qué te puedo ayudar?" />
              </div>
            ) : (
              <>
                {/* Desktop version (Horizontal) */}
                <div className="hidden md:block w-full h-full">
                  <PropertyDetailView 
                    property={MOCK_PROPERTIES.find(p => p.id === selectedPropertyId)!} 
                    layout="horizontal"
                    showAsesorProfile={isViewingProfile}
                    onShowAsesorProfileChange={setIsViewingProfile}
                    onContactClick={() => setIsChatting(true)}
                  />
                </div>

                {/* Mobile version (Vertical in BottomSheet) */}
                <div className="flex md:hidden w-full flex-1 flex-col min-h-0 overflow-hidden">
                  <PropertyDetailView 
                    property={MOCK_PROPERTIES.find(p => p.id === selectedPropertyId)!} 
                    layout="vertical"
                    showAsesorProfile={isViewingProfile}
                    onShowAsesorProfileChange={setIsViewingProfile}
                    onContactClick={() => setIsChatting(true)}
                  />
                </div>
              </>
            )
          )
        }
        mainContent={landingGrid}
      />


    </>
  );
};

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { IconButton } from '../atoms/IconButton';
import { SlidersHorizontal, X, MapPin, ChevronLeft, ChevronRight, Ghost } from 'lucide-react';
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
import { LocationTag } from '../molecules/LocationTag';
import { TagDropdown } from '../molecules/TagDropdown';
import { FilterDropdown, type FilterState } from '../molecules/FilterDropdown';
import { MOCK_PROPERTIES } from '../../data/mockProperties';
import { AsesorChat } from '../organisms/AsesorChat';
import { Footer } from '../organisms/Footer';

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

  // Quick Filters State
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const carouselRef = useRef<HTMLDivElement>(null);
  const searchRowRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleToggleFilters = () => {
    const willOpen = !isFiltersOpen;
    setIsFiltersOpen(willOpen);
    if (willOpen && searchRowRef.current && window.innerWidth < 768) {
      setTimeout(() => {
        searchRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

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

  const { globalSearchQuery, setGlobalSearchQuery, globalFilters, setGlobalFilters } = useAppContext();

  const filteredProperties = MOCK_PROPERTIES.filter(p => {
    // 1. Tipo de propiedad (Catalog tabs)
    if (selectedOperation && selectedOperation !== 'Todos' && (p as any).operation !== selectedOperation) {
      // Mock operation filter (assume missing operation matches for demo)
    }
    if (selectedTypes.length > 0 && !selectedTypes.includes(p.type)) return false;

    // 2. Búsqueda por texto (título, ubicación)
    if (globalSearchQuery) {
      const q = globalSearchQuery.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) {
        return false;
      }
    }

    // 3. Filtros avanzados
    if (globalFilters) {
      if (globalFilters.location && !p.location.toLowerCase().includes(globalFilters.location.toLowerCase())) {
        return false;
      }
      
      if (globalFilters.priceRange) {
        const priceNum = parseInt(p.price.replace(/\D/g, '')) || 0;
        if (globalFilters.priceRange === '0-1M' && priceNum > 1000000) return false;
        if (globalFilters.priceRange === '1M-3M' && (priceNum < 1000000 || priceNum > 3000000)) return false;
        if (globalFilters.priceRange === '3M+' && priceNum < 3000000) return false;
      }
    }

    return true;
  });

  if (globalFilters?.sortBy) {
    filteredProperties.sort((a, b) => {
      const pA = parseInt(a.price.replace(/\D/g, '')) || 0;
      const pB = parseInt(b.price.replace(/\D/g, '')) || 0;
      if (globalFilters.sortBy === 'price-asc') return pA - pB;
      if (globalFilters.sortBy === 'price-desc') return pB - pA;
      return 0;
    });
  }

  // Determine if the user is actively filtering
  const isFiltering = Boolean(
    globalSearchQuery || 
    globalFilters || 
    selectedTypes.length > 0 || 
    (selectedOperation && selectedOperation !== 'Todos')
  );

  // Recommendations remain static, Catalog shows all matches if filtering, else skips the first 8
  const catalogProperties = isFiltering ? filteredProperties : filteredProperties.slice(8);

  const landingGrid = (
    <>
      <main className={`px-4 md:px-6 flex flex-col gap-5 md:gap-8 pt-[88px] md:pt-[100px] pb-[120px] md:pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500 transition-all ${isTransitioning ? 'blur-[2px] opacity-80 pointer-events-none' : ''}`}>
      {isWireframeMode ? (
        <div className="w-full h-[180px] md:h-[220px] rounded-[24px] md:rounded-[32px] bg-gray-200 dark:bg-inmo-darkcard animate-pulse mt-1 md:mt-2 shadow-sm" />
      ) : (
        <HeroCarousel images={CAROUSEL_IMAGES} />
      )}

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-150">
          {/* Bloque Central: SearchBar + Active Tags */}
          <div className="flex flex-col items-center w-full">
            <div className="w-full md:w-[70%] flex flex-col">
              
              {/* Fila del SearchBar */}
              <div ref={searchRowRef} className="flex items-center gap-2 w-full scroll-mt-28">
                <SearchBar 
                  value={globalSearchQuery}
                  onSubmit={(val) => { setGlobalSearchQuery(val); simulateCatalogLoad(); }}
                  placeholder="Buscar propiedades..." 
                  size="slim" 
                  glass 
                  className="flex-1 shadow-lg" 
                />
                <div className="relative">
                  <IconButton 
                    onClick={handleToggleFilters}
                    icon={<SlidersHorizontal className="w-5 h-5" strokeWidth={2} />}
                    variant="secondary"
                    className="w-[44px] h-[44px] !bg-white/40 dark:!bg-white/10 backdrop-blur-xl border border-white/50 dark:border-white/10 !shadow-sm hover:!bg-white/60 dark:hover:!bg-white/20 shrink-0"
                  />
                  <FilterDropdown 
                    isOpen={isFiltersOpen} 
                    onApply={(filters) => { 
                      if (filters) setGlobalFilters(filters); 
                      simulateCatalogLoad();
                      setIsFiltersOpen(false); 
                    }} 
                    onClose={() => setIsFiltersOpen(false)}
                  />
                </div>
              </div>



            </div>
          </div>

          {/* Contenedor Muted (Catálogo de Filtros) */}
          <div className="bg-gray-100/80 dark:bg-white/5 rounded-2xl p-3 md:p-4 -mx-4 px-4 md:-mx-6 md:mx-0 md:px-5 mt-1 md:mt-2 flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-5">
            
            {/* Lado Izquierdo: Categorías */}
            <div className={`flex flex-row ${gridMode === 'split' ? 'gap-3' : 'gap-3 md:gap-6'} flex-1 min-w-0 w-full`}>
              
              {/* Opciones de Operación */}
              <div className={`flex flex-col gap-1 flex-1 min-w-0 ${gridMode === 'split' ? 'md:flex-none md:w-[160px]' : 'md:flex-none'}`}>
                
                {/* Dropdown (Mobile OR Split Mode) */}
                <div className={gridMode === 'split' ? 'block' : 'block md:hidden'}>
                  <TagDropdown 
                    label="Operación" 
                    options={['Todos', 'Comprar', 'Rentar']} 
                    selected={selectedOperation || 'Todos'} 
                    onChange={(val) => setSelectedOperation(val === 'Todos' ? null : val)} 
                  />
                </div>

                {/* Desktop Pills (Full Mode Only) */}
                <div className={gridMode === 'split' ? 'hidden' : 'hidden md:flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1'}>
                  {['Todos', 'Comprar', 'Rentar'].map(tag => {
                    const isSelected = tag === 'Todos' ? (!selectedOperation || selectedOperation === 'Todos') : selectedOperation === tag;
                    return (
                      <button 
                        key={`op-${tag}`} 
                        onClick={() => setSelectedOperation(tag === 'Todos' ? null : tag)}
                        className={`shrink-0 px-4 py-1.5 border rounded-full text-[13px] font-medium transition-all active:scale-95 ${
                          isSelected 
                            ? 'bg-inmo-accent text-white border-transparent shadow-md'
                            : 'bg-transparent text-gray-600 dark:text-gray-400 border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Separador Desktop (Full Mode Only) */}
              <div className={gridMode === 'split' ? 'hidden' : 'hidden md:block w-px bg-gray-200 dark:bg-white/10 my-2'} />
              
              {/* Opciones de Tipo */}
              <div className={`flex flex-col gap-1 flex-1 min-w-0 ${gridMode === 'split' ? 'md:flex-none md:w-[160px]' : 'md:flex-none'}`}>
                
                {/* Dropdown (Mobile OR Split Mode) */}
                <div className={gridMode === 'split' ? 'block' : 'block md:hidden'}>
                  <TagDropdown 
                    label="Inmueble" 
                    options={['Residencia', 'Departamento', 'Terreno', 'Oficina', 'Local']} 
                    selected={selectedTypes} 
                    onChange={setSelectedTypes} 
                    multiple 
                  />
                </div>

                {/* Desktop Pills (Full Mode Only) */}
                <div className={gridMode === 'split' ? 'hidden' : 'hidden md:flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1'}>
                  {['Residencia', 'Departamento', 'Terreno', 'Oficina', 'Local'].map(tag => {
                    const isSelected = selectedTypes.includes(tag);
                    return (
                      <button 
                        key={tag} 
                        onClick={() => toggleType(tag)}
                        className={`shrink-0 px-4 py-1.5 border rounded-full text-[13px] font-medium transition-all active:scale-95 ${
                          isSelected 
                            ? 'bg-white dark:bg-inmo-darkcard text-inmo-secondary dark:text-white border-transparent shadow-md dark:border-white/10'
                            : 'bg-transparent text-gray-600 dark:text-gray-400 border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Lado Derecho: Ubicación */}
            <div className="hidden md:flex flex-col justify-center md:self-center w-[250px] shrink-0">
              <LocationTag city="León" state="Guanajuato, México" />
            </div>

          </div>
        </div>

        {/* Recomendaciones Section */}
        {!isFiltering && (
          <div className="flex flex-col mt-4 md:mt-8">
            <div className="flex items-center justify-between ml-4 md:ml-6 pr-4 md:pr-0">
              <h2 className="text-xl font-bold text-inmo-secondary dark:text-white border-l-4 border-inmo-accent pl-3">
                Recomendaciones para ti
              </h2>

            </div>
            <div className="relative group">
              {/* Botón Izquierda (Desktop) */}
              <button 
                onClick={() => scrollCarousel('left')}
                className="hidden md:flex absolute -left-5 top-[40%] -translate-y-1/2 z-10 bg-white/90 dark:bg-inmo-darkcard/90 backdrop-blur-sm shadow-md rounded-full w-10 h-10 items-center justify-center text-inmo-secondary dark:text-white border border-gray-100 dark:border-white/10 hover:scale-110 hover:bg-white dark:hover:bg-inmo-darktertiary transition-all opacity-0 group-hover:opacity-100"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Carrusel */}
              <div ref={carouselRef} className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-pl-4 md:scroll-pl-0 pt-3 md:pt-4 pb-4 -mx-4 px-4 md:-mx-6 md:mx-0 md:px-0">
                {(isWireframeMode || isLoading)
                ? Array.from({ length: 8 }).map((_, idx) => (
                    <div key={`rec-skel-${idx}`} className="shrink-0 w-[280px] md:w-[340px] snap-start">
                      <PropertyCardSkeleton />
                    </div>
                  ))
                : MOCK_PROPERTIES.slice(0, 8).map((property) => (
                    <div key={`rec-${property.id}`} className="shrink-0 w-[280px] md:w-[340px] snap-start">
                      <PropertyCard
                        image={property.image}
                        title={property.title}
                        location={property.location}
                        price={property.price}
                        beds={property.beds}
                        baths={property.baths}
                        sqft={property.sqft}
                        tags={(property as any).tags}
                        isFavorite={property.isFavorite}
                        hideFeaturesText={true}
                        onClick={() => handleSelectProperty(property.id)}
                      />
                    </div>
                  ))}
              </div>

              {/* Botón Derecha (Desktop) */}
              <button 
                onClick={() => scrollCarousel('right')}
                className="hidden md:flex absolute -right-5 top-[40%] -translate-y-1/2 z-10 bg-white/90 dark:bg-inmo-darkcard/90 backdrop-blur-sm shadow-md rounded-full w-10 h-10 items-center justify-center text-inmo-secondary dark:text-white border border-gray-100 dark:border-white/10 hover:scale-110 hover:bg-white dark:hover:bg-inmo-darktertiary transition-all opacity-0 group-hover:opacity-100"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* PromoBanner (CTA) entre secciones */}
        {!isFiltering && (
          <div className="my-4 md:my-10">
            {isWireframeMode ? (
              <div className="w-full h-[180px] rounded-card bg-gray-200 dark:bg-inmo-darkcard animate-pulse shadow-sm" />
            ) : (
              <PromoBanner 
                title="¿Necesitas remodelar antes de vender?"
                description="Aumenta el valor de tu propiedad con nuestro equipo de expertos en remodelación. Cotiza sin compromiso."
                buttonText="Más información"
              />
            )}
          </div>
        )}

        {/* Catálogo General Section */}
        <div className="flex flex-col gap-4 mb-6 md:mb-12 mt-4 md:mt-8">
          {catalogProperties.length > 0 && (
            <div className="flex items-center justify-between ml-4 md:ml-6">
              <h2 className="text-xl font-bold text-inmo-secondary dark:text-white border-l-4 border-inmo-accent pl-3">
                Catálogo general
              </h2>
            </div>
          )}
          <div
            className={`transition-all duration-500 ${
              catalogProperties.length === 0 && !isWireframeMode && !isLoading
                ? 'flex flex-col items-center justify-center py-20 w-full'
                : `grid gap-6 ${gridMode === 'split' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'}`
            }`}
          >
            {(isWireframeMode || isLoading)
              ? Array.from({ length: 10 }).map((_, idx) => <PropertyCardSkeleton key={`cat-skel-${idx}`} />)
              : catalogProperties.length > 0 ? (
                  catalogProperties.map((property) => (
                    <PropertyCard
                      key={`cat-${property.id}`}
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
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500 max-w-md mx-auto">
                    <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center shadow-sm">
                      <Ghost className="w-10 h-10 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-inmo-secondary dark:text-white mb-2">No se encontraron inmuebles</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">No hay propiedades que coincidan con tu búsqueda actual. Intenta ajustar los filtros, probar otros términos de búsqueda o ampliar el rango de precio.</p>
                  </div>
                )
            }
          </div>
        </div>

      </div>
    </main>
    <Footer />
  </>);

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

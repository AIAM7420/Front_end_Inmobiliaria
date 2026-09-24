import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

import { PropertyCard } from '../molecules/PropertyCard';
import { PropertyCardSkeleton } from '../molecules/PropertyCardSkeleton';
import { SearchBar } from '../molecules/SearchBar';
import { PropertyDetailView } from '../organisms/PropertyDetailView';
import { SlidersHorizontal } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';

import { MOCK_PROPERTIES } from '../../data/mockProperties';

import { ModuleLayout } from './ModuleLayout';
import { SplitViewLayout } from './SplitViewLayout';

export interface FavoritesTemplateProps {}

export const FavoritesTemplate: React.FC<FavoritesTemplateProps> = () => {
  const [isWireframeMode, setIsWireframeMode] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsWireframeMode(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

  const filtersContent = (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Select 
          options={[
            { value: 'all', label: 'Todos los tipos' },
            { value: 'house', label: 'Casas' },
            { value: 'apartment', label: 'Departamentos' }
          ]} 
          value="all" 
          onChange={() => {}} 
          placeholder="Tipo de Propiedad"
          wrapperClassName="!bg-gray-50/50 dark:!bg-inmo-darkbg/50 border-gray-100 dark:border-inmo-darktertiary"
        />
        <Select 
          options={[
            { value: 'all', label: 'Cualquier estado' },
            { value: 'available', label: 'Disponibles' },
            { value: 'sold', label: 'Vendidos' }
          ]} 
          value="all" 
          onChange={() => {}} 
          placeholder="Estado"
          wrapperClassName="!bg-gray-50/50 dark:!bg-inmo-darkbg/50 border-gray-100 dark:border-inmo-darktertiary"
        />
      </div>
      <div className="flex gap-2 mt-2 pt-4 border-t border-gray-100 dark:border-inmo-darktertiary">
        <Button variant="secondary" className="flex-1 !h-10 text-xs">Limpiar</Button>
        <Button variant="accent" className="flex-1 !h-10 text-xs shadow-glow">Aplicar Filtros</Button>
      </div>
    </>
  );

  const gridCols = selectedPropertyId ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  const mainContent = (
    <ModuleLayout
      title="Favoritos"
      subtitle={`Tienes ${MOCK_PROPERTIES.length} propiedades guardadas.`}
      isFullScreen={true}
      searchPlaceholder="Buscar en favoritos..."
      isFiltersOpen={isFiltersOpen}
      onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      onCloseFilters={() => setIsFiltersOpen(false)}
      filtersContent={filtersContent}
    >
      <div className={`grid gap-6 ${gridCols} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
        {isWireframeMode ? (
          Array.from({ length: 4 }).map((_, idx) => <PropertyCardSkeleton key={idx} />)
        ) : (
          MOCK_PROPERTIES.filter(p => p.isFavorite).map((property, idx) => (
            <div key={property.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
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
                onClick={() => setSelectedPropertyId(property.id)}
              />
            </div>
          ))
        )}
      </div>
    </ModuleLayout>
  );

  return (
    <SplitViewLayout
      isOpen={!!selectedPropertyId}
      onClose={() => setSelectedPropertyId(null)}
      sideTitle="Detalle de Propiedad"
      sidePosition="right"
      sidePanelWidthClass="w-full md:w-[65%] xl:w-[70%]"
      mainPanelWidthClass="md:w-[35%] xl:w-[30%]"
      mainContent={mainContent}
      sideContent={
        selectedPropertyId && (
          <PropertyDetailView 
            property={MOCK_PROPERTIES.find(p => p.id === selectedPropertyId)!} 
            layout="horizontal"
          />
        )
      }
      bottomSheetNoPadding={true}
      bottomSheetIsHero={true}
      wrapperClassName="bg-transparent"
      mainPanelNoScroll={true}
    />
  );
};

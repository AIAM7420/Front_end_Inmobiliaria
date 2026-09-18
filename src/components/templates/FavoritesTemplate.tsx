import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

import { PropertyCard } from '../molecules/PropertyCard';
import { PropertyCardSkeleton } from '../molecules/PropertyCardSkeleton';
import { SearchBar } from '../molecules/SearchBar';
import { PropertyModal } from '../organisms/PropertyModal';
import { BottomSheet } from '../organisms/BottomSheet';
import { PropertyDetailView } from '../organisms/PropertyDetailView';

import { MOCK_PROPERTIES } from '../../data/mockProperties';

export interface FavoritesTemplateProps {}

export const FavoritesTemplate: React.FC<FavoritesTemplateProps> = () => {
  const [isWireframeMode, setIsWireframeMode] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsWireframeMode(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

  return (
    <>
      {/* Main Content */}
      <main className="flex flex-col px-6 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Título y controles */}
        <div className="mt-2 mb-6">
          <h1 className="font-montserrat font-bold text-3xl text-inmo-secondary dark:text-white mb-2">Favoritos</h1>
          <p className="text-gray-500 font-inter text-sm mb-6">
            Tienes {MOCK_PROPERTIES.length} propiedades guardadas.
          </p>

          <div className="flex items-center justify-between">
            {/* Search Input */}
            <div className="flex-1">
              <SearchBar placeholder="Buscar en favoritos..." />
            </div>
          </div>
        </div>

        {/* Properties List/Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
      </main>

      {/* PROPERTY DETAIL BOTTOM SHEET / MODAL */}
      <div className="md:hidden">
        <BottomSheet 
          isOpen={!!selectedPropertyId} 
          onClose={() => setSelectedPropertyId(null)}
          title="Detalle de Propiedad"
          defaultExpanded={false}
          noPadding={true}
          isHero={true}
        >
          {selectedPropertyId && (
            <PropertyDetailView 
              property={MOCK_PROPERTIES.find(p => p.id === selectedPropertyId)!} 
            />
          )}
        </BottomSheet>
      </div>
      <PropertyModal
        isOpen={!!selectedPropertyId}
        onClose={() => setSelectedPropertyId(null)}
      >
        {selectedPropertyId && (
          <PropertyDetailView 
            property={MOCK_PROPERTIES.find(p => p.id === selectedPropertyId)!} 
            layout="horizontal"
          />
        )}
      </PropertyModal>
    </>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2, MessageSquare, Share2, MapPin, Grid, List } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton } from '../atoms/IconButton';
import { Button } from '../atoms/Button';
import { PropertyCard } from '../molecules/PropertyCard';
import { SplitViewLayout } from './SplitViewLayout';
import { PropertyDetailView } from '../organisms/PropertyDetailView';
import { BottomSheet } from '../organisms/BottomSheet';

// Mock data
const MOCK_PROPERTIES = [
  { id: '1', title: 'Casa Moderna', location: 'Norte', price: 2500000, beds: 3, baths: 2, sqft: 150, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', tags: [{text: 'Venta', variant: 'primary' as const}] },
  { id: '2', title: 'Departamento céntrico', location: 'Centro', price: 1200000, beds: 2, baths: 1, sqft: 80, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', tags: [{text: 'Renta', variant: 'secondary' as const}] },
  { id: '3', title: 'Terreno residencial', location: 'Sur', price: 800000, beds: 0, baths: 0, sqft: 300, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80', tags: [{text: 'Venta', variant: 'primary' as const}] },
  { id: '4', title: 'Loft industrial', location: 'Centro', price: 1800000, beds: 1, baths: 1, sqft: 90, image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80', tags: [{text: 'Nuevo', variant: 'success' as const}] },
];

export const AsesorPublicProfileTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const selectedProperty = MOCK_PROPERTIES.find(p => p.id === selectedPropertyId);

  const catalogContent = (
    <div className="max-w-3xl w-full mx-auto pb-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="font-montserrat font-bold text-xl md:text-2xl text-inmo-secondary dark:text-white">Portafolio Completo</h2>
        <div className="flex gap-2">
          <IconButton icon={<Grid className="w-4 h-4 text-inmo-accent" />} variant="ghost" className="!p-1.5 !bg-inmo-accent/10 !rounded-md" />
          <IconButton icon={<List className="w-4 h-4 text-gray-400" />} variant="ghost" className="!p-1.5 !rounded-md hover:!bg-gray-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {MOCK_PROPERTIES.map(property => (
          <PropertyCard
            key={property.id}
            image={property.image}
            title={property.title}
            location={property.location}
            price={property.price}
            beds={property.beds}
            baths={property.baths}
            sqft={property.sqft}
            variant="standard"
            onClick={() => setSelectedPropertyId(property.id)}
          />
        ))}
        {MOCK_PROPERTIES.map(property => (
          <PropertyCard
            key={property.id + '-dup'}
            image={property.image}
            title={property.title}
            location={property.location}
            price={property.price}
            beds={property.beds}
            baths={property.baths}
            sqft={property.sqft}
            variant="standard"
            onClick={() => setSelectedPropertyId(property.id)}
          />
        ))}
      </div>
    </div>
  );

  const mainContent = (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden bg-white dark:bg-inmo-darkbg relative">
      
      {/* Columna Izquierda: Perfil (Mobile: Full width, Desktop: Fija) */}
      <div className="w-full md:w-[45%] lg:w-[40%] h-full flex flex-col relative z-20 shrink-0">
        
        {/* Header Fijo con Transición */}
        <div className={`absolute top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-inmo-darkcard/80 backdrop-blur-xl border-b border-gray-100 dark:border-inmo-darktertiary shadow-sm' 
            : 'bg-transparent'
        }`}>
          <IconButton 
            icon={<ArrowLeft className={`w-5 h-5 text-inmo-secondary dark:text-white`} />} 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className={`!p-2 !rounded-full backdrop-blur-md ${
              isScrolled 
                ? 'hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary' 
                : '!bg-white/50 dark:!bg-black/20 hover:!bg-white/70 dark:hover:!bg-black/40'
            }`}
          />
          
          {/* Título siempre visible */}
          <div className={`transition-all duration-300 font-montserrat font-semibold text-lg flex items-center gap-1.5 ${
            isScrolled ? 'text-inmo-secondary dark:text-white' : 'text-gray-800 dark:text-gray-200 drop-shadow-md'
          }`}>
            <span>Perfil del Asesor</span>
          </div>

          <IconButton 
            icon={<Share2 className={`w-5 h-5 text-inmo-secondary dark:text-white`} />} 
            variant="ghost" 
            className={`!p-2 !rounded-full backdrop-blur-md ${
              isScrolled 
                ? 'hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary' 
                : '!bg-white/50 dark:!bg-black/20 hover:!bg-white/70 dark:hover:!bg-black/40'
            }`}
          />
        </div>

        {/* Contenido del Perfil (Sin Scroll) */}
        <div className="flex-1 flex flex-col pt-16 px-4 pb-6 max-w-md mx-auto w-full">
          
          {/* Imagen Hero (Ajustada para caber sin scroll) */}
          <div className="w-full relative z-10 shrink-[2]">
            <div className="w-full h-full min-h-[300px] max-h-[45vh] rounded-card overflow-hidden shadow-sm relative group">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80" 
                alt="Foto del Asesor" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* Info del Asesor */}
          <div className="pt-6 space-y-4 shrink-0 flex-1 flex flex-col justify-center">
            <div className="flex flex-col items-start text-left">
              <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-inmo-secondary dark:text-white flex items-center justify-start gap-2">
                Daniel Ayomide
                <CheckCircle2 className="w-6 h-6 text-inmo-accent shrink-0" />
              </h1>
              <div className="flex items-center justify-start gap-1.5 text-gray-500 dark:text-gray-400 mt-1">
                <MapPin className="w-4 h-4" />
                <span className="font-inter text-sm">León, Guanajuato</span>
              </div>
            </div>

            <p className="font-inter text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed text-left line-clamp-3">
              I design web and mobile apps that not only work seamlessly but also drive revenue growth for businesses. Especialista en propiedades residenciales y comerciales en la zona norte.
            </p>

            <div className="flex items-center justify-start gap-6 pt-1 pb-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">45</span>
                <span className="font-inter text-sm text-gray-500 dark:text-gray-400">Propiedades</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">4.9/5</span>
                <span className="font-inter text-sm text-gray-500 dark:text-gray-400">Calificación</span>
              </div>
            </div>

            <div className="pt-2 flex flex-row gap-3 w-full">
              <Button className="flex-1 !rounded-full !py-3.5 !text-body" icon={<MessageSquare className="w-5 h-5" />}>
                Contactar
              </Button>
              <Button variant="secondary" className="md:hidden flex-1 !rounded-full !py-3.5 !text-body" icon={<Grid className="w-5 h-5" />} onClick={() => setIsCatalogOpen(true)}>
                Portafolio
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Portafolio (Solo Desktop) */}
      <div className="hidden md:flex w-full md:w-[55%] lg:w-[60%] h-full flex-col overflow-y-auto bg-gray-50 dark:bg-inmo-darkcard px-6 lg:px-12 py-10 pt-[100px]">
        {catalogContent}
      </div>

    </div>
  );

  return (
    <>
      <SplitViewLayout
        mainContent={mainContent}
        sideContent={
          selectedProperty ? (
            <div className="h-full relative flex flex-col">
              <Button 
                variant="ghost" 
                icon={<ArrowLeft className="w-4 h-4" />} 
                className="mb-2 self-start"
                onClick={() => setSelectedPropertyId(null)}
              >
                Volver al portafolio
              </Button>
              <PropertyDetailView 
                property={{...selectedProperty, id: parseInt(selectedProperty.id)}} 
                layout="vertical" 
              />
            </div>
          ) : catalogContent
        }
        isOpen={isCatalogOpen || selectedPropertyId !== null}
        onClose={() => {
          setIsCatalogOpen(false);
          setSelectedPropertyId(null);
        }}
        sideTitle={selectedProperty ? "Detalle de Propiedad" : "Portafolio"}
        wrapperClassName="bg-white dark:bg-inmo-darkbg"
        sidePanelWidthClass="w-[60%] lg:w-[50%]"
        mainPanelWidthClass="w-[40%] lg:w-[50%]"
        sidePosition="right"
      />

      <div className="md:hidden">
        <BottomSheet
          isOpen={selectedPropertyId !== null || isCatalogOpen}
          onClose={() => {
            setIsCatalogOpen(false);
            setSelectedPropertyId(null);
          }}
          
        >
          {selectedProperty ? (
            <PropertyDetailView 
              property={{...selectedProperty, id: parseInt(selectedProperty.id)}} 
              layout="vertical" 
            />
          ) : (
            <div className="px-5 pb-8">{catalogContent}</div>
          )}
        </BottomSheet>
      </div>
    </>
  );
};

import React from 'react';
import { Heart, MapPin, Bed, Bath, Maximize, MessageCircle, Phone, User } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';
import { Button } from '../atoms/Button';
import { useAppContext } from '../../context/AppContext';

export interface PropertyDetailViewProps {
  property: {
    id: number;
    image: string;
    title: string;
    location: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    tags: { text: string; variant: 'venta' | 'renta' | 'nuevo' | 'primary' | 'secondary' | 'success' | 'warning' }[];
  };
  layout?: 'vertical' | 'horizontal'; // 'horizontal' used in large modals
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({ property, layout = 'vertical' }) => {
  const { role } = useAppContext();
  const isRenta = property.tags?.some(t => t.text.toLowerCase() === 'renta');

  // HORIZONTAL LAYOUT (Desktop Modal)
  if (layout === 'horizontal') {
    return (
      <div className="flex flex-col md:flex-row bg-white dark:bg-inmo-darkcard rounded-[32px] p-2 md:p-4 overflow-hidden w-full h-full gap-6">
        
        {/* Left Side: Images */}
        <div className="w-full md:w-[50%] flex flex-col gap-3 shrink-0 h-full">
          <div className="relative w-full flex-1 min-h-[200px] rounded-[24px] overflow-hidden">
            <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden snap-x snap-mandatory pb-2 shrink-0">
            <img src={property.image} className="w-[140px] h-[100px] object-cover rounded-[20px] shrink-0 snap-center shadow-sm" alt="Gallery 1" />
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-[140px] h-[100px] object-cover rounded-[20px] shrink-0 snap-center shadow-sm" alt="Gallery 2" />
            <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-[140px] h-[100px] object-cover rounded-[20px] shrink-0 snap-center shadow-sm" alt="Gallery 3" />
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-[140px] h-[100px] object-cover rounded-[20px] shrink-0 snap-center shadow-sm" alt="Gallery 4" />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-[50%] flex flex-col pt-2 md:pt-2 md:pl-2 min-w-0">
          
          <div className="flex flex-col gap-2 mb-3">
            <h2 className="text-[22px] md:text-2xl font-bold font-montserrat text-inmo-secondary dark:text-white leading-tight">
              {property.title}
            </h2>
            <div className="flex justify-between items-end w-full">
              <div className="flex items-center text-gray-500 dark:text-gray-400 pb-1 min-w-0">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="text-sm font-inter font-medium truncate">{property.location}</span>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold font-montserrat text-inmo-accent">$</span>
                  <span className="text-2xl md:text-[28px] font-black font-montserrat text-inmo-secondary dark:text-white tracking-tighter leading-none">
                    {property.price.toLocaleString('es-MX')}
                  </span>
                </div>
                {isRenta && (
                  <span className="text-sm font-medium text-gray-500 mt-1">/Mes</span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-3">
              Hermosa propiedad ubicada en una de las zonas mas exclusivas y de mayor plusvalia de la ciudad. Cuenta con amplios espacios excelentemente distribuidos, iluminacion natural abundante y acabados de lujo de primera calidad. Perfecta para familias que buscan comodidad absoluta.
            </p>
          </div>

          {/* Amenities & Map (Vertical Stack) */}
          <div className="flex flex-col gap-3 mb-3 w-full flex-1 min-h-0">
            {/* Features list */}
            <div className="flex flex-wrap gap-2 w-full">
              <div className="flex-1 flex items-center justify-center gap-1 bg-gray-50 dark:bg-inmo-darkbg px-2 py-2 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
                <Bed className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-xs sm:text-sm font-bold text-inmo-secondary dark:text-gray-300">{property.beds} <span className="font-medium text-xs">Beds</span></span>
              </div>
              <div className="flex-1 flex items-center justify-center gap-1 bg-gray-50 dark:bg-inmo-darkbg px-2 py-2 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
                <Bath className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-xs sm:text-sm font-bold text-inmo-secondary dark:text-gray-300">{property.baths} <span className="font-medium text-xs">Baths</span></span>
              </div>
              <div className="flex-1 flex items-center justify-center gap-1 bg-gray-50 dark:bg-inmo-darkbg px-2 py-2 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
                <Maximize className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-xs sm:text-sm font-bold text-inmo-secondary dark:text-gray-300">{property.sqft} <span className="font-medium text-xs">m²</span></span>
              </div>
            </div>
            
            {/* Full width Map (Flexible height) */}
            <div className="w-full flex-1 min-h-[60px] max-h-[120px] bg-blue-100 dark:bg-blue-900/20 rounded-[20px] overflow-hidden relative shrink">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-50" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-inmo-accent/20 p-2.5 rounded-full">
                 <div className="w-4 h-4 bg-inmo-accent rounded-full border-[3px] border-white shadow-lg" />
               </div>
            </div>
          </div>

          {/* Action Row - Pill Style */}
          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-inmo-darktertiary flex justify-center shrink-0">
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] h-[64px] rounded-full flex items-center justify-between px-2 w-full max-w-[400px]">
               <div className="flex items-center gap-3 pl-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-inmo-darkbg flex items-center justify-center shrink-0 border border-gray-200 dark:border-inmo-darktertiary">
                    <User className="w-5 h-5 text-gray-500" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col">
                     <span className="font-bold text-sm text-inmo-secondary dark:text-white leading-tight">Ana Lopez</span>
                     <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">INMO Realty Co.</span>
                  </div>
               </div>
               <div className="flex gap-2 pr-1">
                  <IconButton 
                    icon={<MessageCircle className="w-[18px] h-[18px]" />}
                    variant="secondary"
                    className="!w-[44px] !h-[44px] !rounded-full !bg-white/80 dark:!bg-black/60 backdrop-blur-md !text-inmo-secondary dark:!text-white hover:!bg-white !shadow-sm"
                  />
                  <IconButton 
                    icon={<Phone className="w-[18px] h-[18px]" />}
                    variant="accent"
                    className="!w-[44px] !h-[44px] !rounded-full !shadow-glow"
                  />
               </div>
            </div>
          </div>
          
        </div>
      </div>
    );
  }

  // VERTICAL LAYOUT (Mobile, SidePanel, BottomSheet)
  return (
    <div className="flex flex-col pb-32 relative bg-white dark:bg-inmo-darkcard min-h-full">
      {/* Hero Image */}
      <div className="w-full relative rounded-b-[32px] overflow-hidden bg-gray-100 dark:bg-inmo-darkbg">
        <img src={property.image} alt={property.title} className="w-full h-[300px] object-cover" />
        {/* Floating Actions on Image */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
          <IconButton 
            icon={<Heart className="w-5 h-5 text-gray-900 dark:text-gray-300" strokeWidth={2.5} />}
            variant="ghost"
            className="!w-10 !h-10 !rounded-full !bg-white/90 dark:!bg-inmo-darkbg/90 backdrop-blur-md hover:!bg-white !shadow-sm"
          />
        </div>
      </div>

      <div className="p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-[22px] font-montserrat font-bold text-inmo-secondary dark:text-white mb-2 leading-tight">
            {property.title}
          </h2>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="font-medium text-sm">{property.location}</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-montserrat text-inmo-accent">$</span>
              <span className="text-[32px] font-black font-montserrat text-inmo-secondary dark:text-white tracking-tighter leading-none">
                {property.price.toLocaleString('es-MX')}
              </span>
            </div>
            {isRenta && (
              <span className="text-sm font-medium text-gray-500 ml-2 mt-2">/Mes</span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" />

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 w-full">
          <div className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 py-2.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
            <Bed className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-xs sm:text-sm font-bold text-inmo-secondary dark:text-gray-300">{property.beds} <span className="font-medium">Beds</span></span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 py-2.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
            <Bath className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-xs sm:text-sm font-bold text-inmo-secondary dark:text-gray-300">{property.baths} <span className="font-medium">Baths</span></span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 py-2.5 rounded-xl border border-gray-100 dark:border-inmo-darktertiary">
            <Maximize className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-xs sm:text-sm font-bold text-inmo-secondary dark:text-gray-300">{property.sqft} <span className="font-medium">m²</span></span>
          </div>
        </div>
        
        {/* Full width Map */}
        <div className="w-full h-[140px] bg-blue-100 dark:bg-blue-900/20 rounded-[20px] overflow-hidden relative shrink-0">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-50" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-inmo-accent/20 p-2.5 rounded-full">
             <div className="w-4 h-4 bg-inmo-accent rounded-full border-[3px] border-white shadow-lg" />
           </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white mb-2">Descripcion</h3>
          <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            Hermosa propiedad ubicada en una de las zonas mas exclusivas y de mayor plusvalia de la ciudad. Cuenta con amplios espacios excelentemente distribuidos, iluminacion natural abundante y acabados de lujo de primera calidad.
          </p>
        </div>

        {/* Galeria */}
        <div className="flex flex-col gap-3">
          <h3 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">Galeria</h3>
          <div className="flex overflow-x-auto gap-3 pb-2 [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
            <img src={property.image} className="w-[140px] h-[100px] object-cover rounded-[16px] shrink-0 snap-center shadow-sm" alt="Gallery 1" />
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-[140px] h-[100px] object-cover rounded-[16px] shrink-0 snap-center shadow-sm" alt="Gallery 2" />
            <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-[140px] h-[100px] object-cover rounded-[16px] shrink-0 snap-center shadow-sm" alt="Gallery 3" />
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-[140px] h-[100px] object-cover rounded-[16px] shrink-0 snap-center shadow-sm" alt="Gallery 4" />
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed md:sticky bottom-4 left-0 right-0 mx-auto px-4 z-20 flex justify-center w-full pointer-events-none">
         <div className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] h-[64px] rounded-full flex items-center justify-between px-2 w-full max-w-[400px] pointer-events-auto">
            {/* Asesor info */}
            <div className="flex items-center gap-2 pl-2">
               <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-inmo-darkbg flex items-center justify-center shrink-0 border border-gray-200 dark:border-inmo-darktertiary">
                 <User className="w-5 h-5 text-gray-500" strokeWidth={2} />
               </div>
               <div className="flex flex-col">
                  <span className="font-bold text-[13px] sm:text-sm text-inmo-secondary dark:text-white leading-tight truncate max-w-[80px] sm:max-w-[100px]">Ana Lopez</span>
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate max-w-[80px] sm:max-w-[100px]">INMO Realty Co.</span>
               </div>
            </div>
            {/* Botones */}
            <div className="flex items-center gap-1.5 pr-1 shrink-0">
              <IconButton 
                icon={<MessageCircle className="w-[18px] h-[18px]" />}
                variant="secondary"
                className="!w-[42px] !h-[42px] !rounded-full !bg-white/80 dark:!bg-black/60 backdrop-blur-md !text-inmo-secondary dark:!text-white hover:!bg-white !shadow-sm"
              />
              <IconButton 
                icon={<Phone className="w-[18px] h-[18px]" />}
                variant="accent"
                className="!w-[42px] !h-[42px] !rounded-full !shadow-glow"
              />
            </div>
         </div>
      </div>
    </div>
  );
}

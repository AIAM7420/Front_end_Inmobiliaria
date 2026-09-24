import React from 'react';
import { ArrowLeft, CheckCircle2, MapPin, MessageSquare, Grid, MessageCircle, Phone, Building, Star, StarHalf, Shield, Award } from 'lucide-react';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { Badge } from '../atoms/Badge';

interface AsesorInlineProfileProps {
  onBack: () => void;
  asesorId?: string;
  isVerified?: boolean;
}

export const AsesorInlineProfile: React.FC<AsesorInlineProfileProps> = ({ onBack, asesorId = '1', isVerified = true }) => {
  return (
    <div className="w-full h-full bg-transparent flex flex-col overflow-hidden pb-4 pt-6 sm:pt-4">
      {/* Contenido del Perfil */}
      <div className="flex-1 flex flex-col p-5 space-y-6 justify-center">
        
        {/* Top Section: Photo and KPIs side by side */}
        <div className="flex w-full items-center gap-4 sm:gap-5">
          
          {/* Foto de Perfil (2/3 del ancho) */}
          <div className="w-2/3 aspect-square sm:aspect-[4/5] rounded-[32px] overflow-hidden shadow-sm relative shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80" 
              alt="Foto del Asesor" 
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>

          {/* KPIs (Airbnb style - 1/3 del ancho) */}
          <div className="w-1/3 flex flex-col justify-center py-1">
            <div className="flex flex-col items-center text-center border-b border-gray-100 dark:border-inmo-darktertiary pb-3">
              <span className="font-montserrat font-bold text-xl sm:text-2xl text-inmo-secondary dark:text-white leading-tight">45</span>
              <span className="font-inter text-[10px] sm:text-[11px] text-gray-500 font-medium mt-0.5">Propiedades</span>
            </div>
            <div className="flex flex-col items-center text-center border-b border-gray-100 dark:border-inmo-darktertiary py-3">
              <div className="flex items-center justify-center gap-1 font-montserrat font-bold text-xl sm:text-2xl text-inmo-secondary dark:text-white leading-tight">
                4.9 <Star className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] fill-current text-inmo-secondary dark:text-white" />
              </div>
              <span className="font-inter text-[10px] sm:text-[11px] text-gray-500 font-medium mt-0.5">Calificación</span>
            </div>
            <div className="flex flex-col items-center text-center pt-3">
              <span className="font-montserrat font-bold text-xl sm:text-2xl text-inmo-secondary dark:text-white leading-tight">7</span>
              <span className="font-inter text-[10px] sm:text-[11px] text-gray-500 font-medium mt-0.5">Años activo</span>
            </div>
          </div>
        </div>

        {/* Información Principal */}
        <div className="flex flex-col items-start text-left space-y-4">
          <div className="flex items-center gap-2.5">
            <h1 className="font-montserrat font-bold text-2xl text-inmo-secondary dark:text-white leading-tight">
              Daniel Ayomide
            </h1>
            <div className={`shrink-0 ${isVerified ? 'visible' : 'invisible'}`}>
              <Badge text="" variant="verified-lg" responsiveText={false} className="!px-3 !py-1.5 !rounded-[12px]" />
            </div>
          </div>

          <p className="font-inter text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-left">
            I design web and mobile apps that not only work seamlessly but also drive revenue growth for businesses. Especialista en propiedades residenciales y comerciales.
          </p>

          <div className="w-full pt-2">
            <Button variant="accent" className="w-full !rounded-full !py-4 shadow-glow" icon={<MessageSquare className="w-4 h-4" />}>
              Contactar Asesor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

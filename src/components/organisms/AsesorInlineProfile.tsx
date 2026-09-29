import React from 'react';
import { ArrowLeft, CheckCircle2, MessageSquare, Star } from 'lucide-react';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';

interface AsesorInlineProfileProps {
  onBack: () => void;
  asesorId?: string;
  isVerified?: boolean;
  onContactClick?: () => void;
}

export const AsesorInlineProfile: React.FC<AsesorInlineProfileProps> = ({ onBack, asesorId = '1', isVerified = true, onContactClick }) => {
  return (
    <div className="w-full h-full bg-white dark:bg-inmo-darkcard flex flex-col justify-center overflow-y-auto">
      {/* Contenido del Perfil */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-5 justify-center max-w-[420px] mx-auto w-full">
        
        {/* Top Section: Photo and KPIs */}
        <div className="flex flex-col md:flex-row w-full items-stretch gap-4 sm:gap-5">
          {/* Photo */}
          <div className="w-full md:w-2/3 aspect-[4/4] sm:aspect-[4/5] md:aspect-[3/4] rounded-[28px] overflow-hidden shadow-sm relative shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80" 
              alt="Foto del Asesor" 
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
          </div>

          {/* Vertical KPIs (Desktop Only) */}
          <div className="hidden md:flex w-1/3 flex-col justify-center">
            <div className="flex flex-col items-center text-center border-b border-gray-100 dark:border-inmo-darktertiary/50 pb-3">
              <div className="flex items-center gap-1">
                <span className="font-inter font-black text-xl sm:text-2xl text-inmo-secondary dark:text-white leading-tight">4.9</span>
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-inmo-secondary dark:text-white" />
              </div>
              <span className="font-inter text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">Estrellas</span>
            </div>
            
            <div className="flex flex-col items-center text-center border-b border-gray-100 dark:border-inmo-darktertiary/50 py-3">
              <span className="font-inter font-black text-xl sm:text-2xl text-inmo-secondary dark:text-white leading-tight">45</span>
              <span className="font-inter text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">Propiedades</span>
            </div>

            <div className="flex flex-col items-center text-center pt-3">
              <span className="font-inter font-black text-xl sm:text-2xl text-inmo-secondary dark:text-white leading-tight">2021</span>
              <span className="font-inter text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">Miembro</span>
            </div>
          </div>
        </div>

        {/* Info & Stats */}
        <div className="flex flex-col space-y-4 px-1">
          {/* Name & Bio */}
          <div className="flex flex-col space-y-2 text-left">
            <div className="flex items-center gap-2">
              <h1 className="font-inter font-bold text-xl sm:text-2xl tracking-tight text-inmo-secondary dark:text-white">
                Daniel A.
              </h1>
              {isVerified && (
                <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-[#3B82F6] rounded-full text-white shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3} />
                </div>
              )}
            </div>
            <p className="font-inter text-sm sm:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed text-left line-clamp-4">
              Asesor de propiedades enfocado en brindar claridad, jerarquía en las negociaciones y tratos que se sostienen a largo plazo.
            </p>
          </div>

          {/* Horizontal Stats Row (Mobile Only) */}
          <div className="flex md:hidden justify-between items-center py-4 border-y border-gray-100 dark:border-inmo-darktertiary/50">
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-1">
                <span className="font-inter font-black text-lg text-inmo-secondary dark:text-white leading-tight">4.9</span>
                <Star className="w-3 h-3 fill-current text-inmo-secondary dark:text-white" />
              </div>
              <span className="font-inter text-[11px] text-gray-500 dark:text-gray-400 mt-1">Estrellas</span>
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-inmo-darktertiary"></div>
            <div className="flex flex-col items-center flex-1">
              <span className="font-inter font-black text-lg text-inmo-secondary dark:text-white leading-tight">45</span>
              <span className="font-inter text-[11px] text-gray-500 dark:text-gray-400 mt-1">Propiedades</span>
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-inmo-darktertiary"></div>
            <div className="flex flex-col items-center flex-1">
              <span className="font-inter font-black text-lg text-inmo-secondary dark:text-white leading-tight">2021</span>
              <span className="font-inter text-[11px] text-gray-500 dark:text-gray-400 mt-1">Miembro</span>
            </div>
          </div>

          {/* Contact Button */}
          <div className="w-full pt-1 sm:pt-2">
            <Button 
              variant="accent"
              className="w-full !rounded-full !py-3 sm:!py-3.5 shadow-glow font-inter font-bold text-sm sm:text-[15px]" 
              onClick={onContactClick}
            >
              Contactar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

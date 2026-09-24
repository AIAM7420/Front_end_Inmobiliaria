import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';

interface BottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  onBack?: () => void;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  noPadding?: boolean;
  isHero?: boolean;
  heightMode?: 'content' | 'fixed-75' | 'fixed-85';
  defaultExpanded?: boolean;
  fullHeight?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ 
  isOpen, 
  onClose, 
  onBack,
  children, 
  title, 
  defaultExpanded = false,
  noPadding = false,
  isHero = false,
  heightMode = 'fixed-85',
  fullHeight = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setIsExpanded(defaultExpanded);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, defaultExpanded]);

  const getHeightClasses = () => {
    if (isExpanded) return 'h-[100dvh] rounded-none';
    
    switch (heightMode) {
      case 'content':
        return 'h-auto max-h-[90dvh] rounded-t-[32px] pb-6';
      case 'fixed-75':
        return 'h-[75dvh] rounded-t-[32px]';
      case 'fixed-85':
      default:
        return 'h-[85dvh] rounded-t-[32px]';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;
    
    if (diff > 50) {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        onClose?.();
      }
    } else if (diff < -50) {
      // Swipe up: expandir si no está expandido
      if (!isExpanded) {
        setIsExpanded(true);
      }
    }
    
    startY.current = 0;
    currentY.current = 0;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 transition-opacity duration-300 cursor-pointer ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Contenedor del Bottom Sheet */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-inmo-darkbg z-50 flex flex-col transition-transform duration-300 ease-out shadow-[0_-10px_40px_rgba(0,0,0,0.15)] overflow-hidden ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } ${getHeightClasses()}`}
      >
        <div className="w-full relative shrink-0">
          {/* Header / Drag Handle Area Overlay */}
          <div 
            className={`flex flex-col items-center justify-center cursor-grab active:cursor-grabbing w-full z-50 ${
              isHero 
                ? 'absolute top-0 left-0 right-0 pt-4 pb-4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none' 
                : 'pt-4 pb-2 bg-white dark:bg-inmo-darkbg border-b border-transparent'
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className={`w-12 h-1.5 rounded-full pointer-events-auto ${title && !isHero ? 'mb-3' : ''} ${
              isHero 
                ? 'bg-white/90 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.5)]' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`} />
            {title && !isHero && (
              <h3 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white px-6 text-center w-full truncate pb-2 pointer-events-auto">
                {title}
              </h3>
            )}
          </div>
          
          {/* Botón de Atrás */}
          {onBack && (
            <div className={`absolute left-4 z-50 ${isHero ? 'top-4' : 'top-3'}`}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onBack();
                }}
                variant="ghost"
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  isHero
                    ? 'bg-black/20 backdrop-blur-md text-white hover:bg-black/30'
                    : 'bg-gray-100 dark:bg-inmo-darkcard text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                icon={<ArrowLeft className="w-5 h-5" strokeWidth={2.5} />}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`flex-1 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${fullHeight ? 'flex flex-col min-h-0' : 'overflow-y-auto ' + (isHero ? 'pt-0' : 'pt-2')}`}>
          {fullHeight ? (
            children
          ) : (
            <div className={`${noPadding ? '' : 'px-6'} pb-safe ${heightMode === 'content' ? 'mb-0' : 'mb-12'}`}>
              {children}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
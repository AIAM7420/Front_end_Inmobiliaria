import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';

interface BottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  onBack?: () => void;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  noPadding?: boolean;
  isHero?: boolean;
  hideCloseButton?: boolean;
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
  hideCloseButton = false,
  heightMode = 'fixed-85',
  fullHeight = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const startTime = useRef(0);

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
    currentY.current = e.touches[0].clientY;
    startTime.current = Date.now();
    setIsDragging(true);

    if (sheetRef.current) {
      sheetRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const y = e.touches[0].clientY;
    currentY.current = y;
    const deltaY = y - startY.current;

    if (sheetRef.current) {
      let translateY = deltaY;
      if (isExpanded && translateY < 0) {
        translateY = translateY * 0.15;
      } else if (!isExpanded && heightMode === 'content' && translateY < 0) {
         translateY = translateY * 0.15;
      }
      sheetRef.current.style.transform = `translateY(${translateY}px)`;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const deltaY = currentY.current - startY.current;
    const deltaTime = Date.now() - startTime.current;
    const velocity = deltaY / deltaTime;

    if (sheetRef.current) {
      sheetRef.current.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
      sheetRef.current.style.transform = '';
    }

    if (deltaY > 50 || velocity > 0.5) {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        onClose?.();
      }
    } else if (deltaY < -50 || velocity < -0.5) {
      if (!isExpanded && heightMode !== 'content') {
        setIsExpanded(true);
      }
    }

    startY.current = 0;
    currentY.current = 0;
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 transition-opacity duration-300 cursor-pointer ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        ref={sheetRef}
        inert={!isOpen}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal={isOpen}
        aria-label={typeof title === 'string' ? title : 'Detalle'}
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-inmo-darkbg z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.15)] overflow-hidden ${
          !isDragging ? 'transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]' : ''
        } ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } ${getHeightClasses()}`}
      >
        <div className="w-full relative shrink-0">
          <div
            className={`flex flex-col items-center justify-center cursor-grab active:cursor-grabbing w-full z-50 transition-all duration-300 ${
              isHero
                ? 'absolute top-0 left-0 right-0 pt-4 pb-4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none'
                : isExpanded ? 'pt-2 pb-2 bg-white dark:bg-inmo-darkbg border-b border-transparent' : 'pt-4 pb-2 bg-white dark:bg-inmo-darkbg border-b border-transparent'
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => {
              if (heightMode !== 'content') setIsExpanded(!isExpanded);
            }}
          >
            <div className={`w-12 h-1.5 rounded-full pointer-events-auto transition-all duration-300 ${title && !isHero ? 'mb-3' : ''} ${
              isHero
                ? 'bg-white/90 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.5)]'
                : 'bg-gray-300 dark:bg-gray-600'
            } ${isExpanded ? 'opacity-0 h-0 mb-0 scale-y-0' : 'opacity-100 h-1.5'}`} />

            {title && !isHero && (
              <h3 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white px-6 text-center w-full truncate pb-2 pointer-events-auto">
                {title}
              </h3>
            )}
          </div>

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

          {isExpanded && !hideCloseButton && (
            <div className={`absolute right-4 z-50 ${isHero ? 'top-4' : 'top-3'} animate-in fade-in zoom-in duration-300`}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onClose?.();
                }}
                variant="ghost"
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  isHero
                    ? 'bg-black/20 backdrop-blur-md text-white hover:bg-black/30'
                    : 'bg-gray-100 dark:bg-inmo-darkcard text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                icon={<X className="w-5 h-5" strokeWidth={2.5} />}
              />
            </div>
          )}
        </div>

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

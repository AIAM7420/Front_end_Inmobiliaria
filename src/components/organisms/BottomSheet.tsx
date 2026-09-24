import React, { useState, useEffect, useRef } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  title?: string;
  noPadding?: boolean;
  isHero?: boolean;
}

export function BottomSheet({ isOpen, onClose, children, defaultExpanded = false, title, noPadding = false, isHero = false }: BottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const startY = useRef(0);
  const currentY = useRef(0);

  // reset expansion when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setIsExpanded(defaultExpanded), 300);
    }
  }, [isOpen, defaultExpanded]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (startY.current === 0) return;
    const diff = startY.current - currentY.current;
    
    if (diff > 50) {
      // Swiped up
      setIsExpanded(true);
    } else if (diff < -50) {
      // Swiped down
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        onClose();
      }
    }
    
    startY.current = 0;
    currentY.current = 0;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 cursor-pointer ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-inmo-darkbg z-50 flex flex-col transition-all duration-300 ease-out shadow-[0_-10px_40px_rgba(0,0,0,0.15)] overflow-hidden ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } ${isExpanded ? 'h-[100dvh] rounded-none' : 'h-[85vh] rounded-t-[32px]'}`}
      >
        {/* Header / Drag Handle Area Overlay */}
        <div 
          className={`flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shrink-0 z-50 ${
            isHero 
              ? 'absolute top-0 left-0 right-0 pt-4 pb-4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none' 
              : 'w-full pt-4 pb-2 bg-white dark:bg-inmo-darkbg border-b border-transparent'
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

        {/* Content */}
        <div className={`flex-1 overflow-y-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isHero ? 'pt-0' : 'pt-2'}`}>
          <div className={`${noPadding ? '' : 'px-6'} pb-safe mb-12`}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
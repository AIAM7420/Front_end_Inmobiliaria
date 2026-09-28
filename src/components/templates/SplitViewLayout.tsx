import React, { useState, useEffect } from 'react';
import type { ReactNode, UIEvent } from 'react';
import { IconButton } from '../atoms/IconButton';
import { X, ArrowLeft } from 'lucide-react';
import { BottomSheet } from '../organisms/BottomSheet';

export interface SplitViewLayoutProps {
  /** The content of the main view */
  mainContent: ReactNode;
  /** The content of the detail/split view */
  sideContent: ReactNode;
  /** Whether the split view is active/open */
  isOpen: boolean;
  /** Callback when the split view should be closed */
  onClose?: () => void;
  /** Callback to go back inside the side content */
  onBack?: () => void;
  /** Title for the side content header (optional) */
  sideTitle?: string;
  /** Custom background for the wrapper */
  wrapperClassName?: string;
  bottomSheetNoPadding?: boolean;
  bottomSheetIsHero?: boolean;
  bottomSheetHeightMode?: 'content' | 'fixed-75' | 'fixed-85';
  /** Whether to make the BottomSheet content fill the height and not scroll */
  bottomSheetFullHeight?: boolean;
  /** Tailwind width class for side panel when open. Defaults to 'w-1/2' */
  sidePanelWidthClass?: string;
  /** Tailwind width class for main panel when open. Defaults to 'md:w-1/2' */
  mainPanelWidthClass?: string;
  /** Position of the side panel. Defaults to 'left' */
  sidePosition?: 'left' | 'right';
  /** Whether to remove internal padding on the desktop side panel */
  desktopNoPadding?: boolean;
  /** Whether to make the side panel transparent and borderless on desktop */
  sidePanelTransparent?: boolean;
  /** Whether to hide the default desktop close button */
  hideDesktopCloseButton?: boolean;
  /** Whether to prevent the main panel from scrolling */
  mainPanelNoScroll?: boolean;
  /** Override for mobile bottom sheet open state. Defaults to isOpen */
  mobileIsOpen?: boolean;
}

export const SplitViewLayout: React.FC<SplitViewLayoutProps> = ({
  mainContent,
  sideContent,
  isOpen,
  mobileIsOpen,
  onClose,
  onBack,
  sideTitle = 'Detalle',
  wrapperClassName = 'bg-gray-50 dark:bg-inmo-darkbg',
  bottomSheetNoPadding = true,
  bottomSheetIsHero = true,
  bottomSheetHeightMode = 'fixed-75',
  bottomSheetFullHeight = false,
  sidePanelWidthClass = 'w-1/2',
  mainPanelWidthClass = 'md:w-1/2',
  sidePosition = 'left',
  desktopNoPadding = false,
  sidePanelTransparent = false,
  hideDesktopCloseButton = false,
  mainPanelNoScroll = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 10) {
      if (!isScrolled) setIsScrolled(true);
    } else {
      if (isScrolled) setIsScrolled(false);
    }
  };

  return (
    <div className={`flex w-full h-[100dvh] overflow-hidden relative ${wrapperClassName} ${sidePosition === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* CONTENIDO LATERAL (Desktop) */}
      <div 
        className={`hidden md:flex flex-col h-full relative z-10 overflow-hidden transform-gpu will-change-[width,padding,opacity] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0 pt-[100px] pb-4 ${
          isOpen ? `${sidePanelWidthClass} opacity-100 px-4 pointer-events-auto` : 'w-0 opacity-0 px-0 pointer-events-none'
        }`}
      >
        <div className={`w-full h-full min-w-[320px] rounded-card overflow-hidden flex flex-col relative ${
          sidePanelTransparent 
            ? 'bg-transparent shadow-none border-none' 
            : 'bg-white dark:bg-inmo-darkcard shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-inmo-darktertiary'
        }`}>
          
          {/* Botón de Atrás (Esquina Superior Izquierda) */}
          {onBack && (
            <div className="absolute top-4 left-4 z-50">
               <IconButton 
                 onClick={onBack}
                 icon={<ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />}
                 variant="secondary"
                 className="!w-10 !h-10 !p-0 !bg-white/90 dark:!bg-inmo-darkcard/90 backdrop-blur-md hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary !shadow-sm !rounded-full transition-colors border border-gray-100 dark:border-white/10"
               />
            </div>
          )}

          {/* Título Centrado (Transición a Pill si hay scroll) */}
          {sideTitle && (
            <div className={`absolute top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center transition-all duration-300 border ${
              isScrolled 
                ? 'px-6 py-2 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-[100px] w-auto pointer-events-auto' 
                : 'px-0 py-0 bg-transparent border-transparent shadow-none pointer-events-none drop-shadow-sm'
            }`}>
               <h3 className={`font-inter font-semibold whitespace-nowrap transition-all duration-300 text-inmo-secondary dark:text-white ${
                 isScrolled ? 'text-sm' : 'text-lg'
               }`}>
                 {sideTitle}
               </h3>
            </div>
          )}

          {!hideDesktopCloseButton && (
            <div className="absolute top-4 right-4 z-50">
               {onClose && (
                 <IconButton 
                   onClick={onClose}
                   icon={<X className="w-5 h-5 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />}
                   variant="secondary"
                   className="!w-10 !h-10 !p-0 !bg-white/90 dark:!bg-inmo-darkcard/90 backdrop-blur-md hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary !shadow-sm !rounded-full transition-colors border border-gray-100 dark:border-white/10"
                 />
               )}
            </div>
          )}

          <div 
            className={`flex-1 flex flex-col overflow-hidden relative z-0 ${desktopNoPadding ? 'p-0' : 'p-0 md:p-6 md:pt-[84px]'}`}
          >
             {sideContent}
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div 
        id="main-scroll-container"
        onScroll={(e) => {
          window.dispatchEvent(new CustomEvent('app-scroll', { detail: { scrollY: (e.target as HTMLDivElement).scrollTop } }));
        }}
        className={`h-full relative transform-gpu will-change-[width] transition-[width,border-radius] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0 ${
          mainPanelNoScroll ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'
        } ${
          isOpen ? `w-full ${mainPanelWidthClass} md:rounded-card my-2` : 'w-full'
        }`}
      >
        {mainContent}
      </div>

      {/* MOBILE BOTTOM SHEET */}
      <div className="md:hidden">
        <BottomSheet 
          isOpen={mobileIsOpen !== undefined ? mobileIsOpen : isOpen} 
          onClose={onClose}
          onBack={onBack}
          title={sideTitle}
          defaultExpanded={false}
          noPadding={bottomSheetNoPadding}
          isHero={bottomSheetIsHero}
          heightMode={bottomSheetHeightMode}
          fullHeight={bottomSheetFullHeight}
        >
          {sideContent}
        </BottomSheet>
      </div>
    </div>
  );
};

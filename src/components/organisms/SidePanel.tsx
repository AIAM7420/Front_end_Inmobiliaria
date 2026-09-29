import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';

export interface SidePanelProps {
  isOpen: boolean;
  onClose?: () => void;
  onBack?: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  noPadding?: boolean;
  compact?: boolean;
}

export const SidePanel: React.FC<SidePanelProps> = ({ 
  isOpen, 
  onClose, 
  onBack,
  title, 
  children,
  position = 'left',
  noPadding = false,
  compact = false
}) => {
  const positionClasses = position === 'left' 
    ? 'left-6 -translate-x-[150%]' 
    : 'right-6 translate-x-[150%]';
    
  const activePositionClasses = position === 'left'
    ? 'left-6 translate-x-0'
    : 'right-6 translate-x-0';

  return (
    <div 
      className={`hidden md:flex fixed top-[200px] ${compact ? 'h-auto max-h-[calc(100vh-250px)]' : 'bottom-12'} w-[420px] z-40 bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-3xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50 dark:border-white/10 transition-all duration-500 ease-out flex-col overflow-hidden ${
        isOpen ? `${activePositionClasses} opacity-100` : `${positionClasses} opacity-0 pointer-events-none`
      }`}
    >
      {/* Header del Side Panel */}
      {(title || onBack) && (
        <div className="relative flex items-center justify-between p-6 border-b border-gray-100 dark:border-inmo-darktertiary/50 min-h-[76px]">
          <div className="flex items-center gap-3 z-10">
            {onBack && (
              <IconButton 
                onClick={onBack}
                icon={<ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />}
                variant="ghost"
                className="!w-8 !h-8 !p-0 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary !rounded-full shrink-0"
              />
            )}
          </div>
          
          {title && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12">
              <h2 className="text-lg font-montserrat font-bold text-inmo-secondary dark:text-white truncate">
                {title}
              </h2>
            </div>
          )}

          <div className="flex items-center gap-3 z-10">
            {onClose && (
              <IconButton 
                onClick={onClose}
                icon={<X className="w-5 h-5" />}
                variant="secondary"
                className="!w-8 !h-8 !rounded-full !bg-gray-100 dark:!bg-inmo-darkbg !text-gray-500 hover:!bg-gray-200 dark:hover:!bg-inmo-darktertiary !shadow-none shrink-0"
              />
            )}
          </div>
        </div>
      )}
      {/* Contenido del Side Panel */}
      <div className={`flex-1 overflow-y-auto flex flex-col relative overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${noPadding ? '' : 'px-6 pb-6 pt-2'}`}>
        {!(title || onBack) && onClose && (
          <IconButton 
            onClick={onClose}
            icon={<X className="w-5 h-5" />}
            variant="ghost"
            className="absolute top-6 right-4 !p-2.5 !bg-gray-100 dark:!bg-white/20 backdrop-blur-md !text-gray-500 dark:!text-white hover:!bg-gray-200 dark:hover:!bg-white/40 shrink-0 z-50 !shadow-sm"
          />
        )}
        {!(title || onBack) && onBack && (
          <IconButton 
            onClick={onBack}
            icon={<ArrowLeft className="w-5 h-5" />}
            variant="ghost"
            className="absolute top-6 left-4 !p-2.5 !bg-gray-100 dark:!bg-white/20 backdrop-blur-md !text-gray-500 dark:!text-white hover:!bg-gray-200 dark:hover:!bg-white/40 shrink-0 z-50 !shadow-sm"
          />
        )}
        {children}
      </div>
    </div>
  );
};

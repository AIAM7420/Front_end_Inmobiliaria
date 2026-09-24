import React from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';

export interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
}

export const SidePanel: React.FC<SidePanelProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  position = 'left' 
}) => {
  const positionClasses = position === 'left' 
    ? 'left-6 -translate-x-[150%]' 
    : 'right-6 translate-x-[150%]';
    
  const activePositionClasses = position === 'left'
    ? 'left-6 translate-x-0'
    : 'right-6 translate-x-0';

  return (
    <div 
      className={`hidden md:flex fixed top-[200px] bottom-[140px] w-[420px] z-40 bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-3xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50 dark:border-white/10 transition-all duration-500 ease-out flex-col overflow-hidden ${
        isOpen ? `${activePositionClasses} opacity-100` : `${positionClasses} opacity-0 pointer-events-none`
      }`}
    >
      {/* Header del Side Panel */}
      {title && (
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-inmo-darktertiary/50">
          <h2 className="text-lg font-montserrat font-bold text-inmo-secondary dark:text-white truncate">
            {title}
          </h2>
          <IconButton 
            onClick={onClose}
            icon={<X className="w-5 h-5" />}
            variant="secondary"
            className="!w-8 !h-8 !rounded-full !bg-gray-100 dark:!bg-inmo-darkbg !text-gray-500 hover:!bg-gray-200 dark:hover:!bg-inmo-darktertiary !shadow-none shrink-0"
          />
        </div>
      )}
      {/* Contenido del Side Panel */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {!title && (
          <IconButton 
            onClick={onClose}
            icon={<X className="w-5 h-5" />}
            variant="ghost"
            className="absolute top-6 right-4 !p-2.5 !bg-white/20 backdrop-blur-md !text-white hover:!bg-white/40 shrink-0 z-50 !shadow-sm"
          />
        )}
        {children}
      </div>
    </div>
  );
};

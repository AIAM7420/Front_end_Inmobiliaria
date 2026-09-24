import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';

export interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({ 
  isOpen, 
  onClose, 
  children
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount just in case
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="hidden md:flex fixed inset-0 z-[100] items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      
      {/* Lightbox Close Button */}
      <IconButton 
        onClick={onClose}
        icon={<X className="w-8 h-8" strokeWidth={2.5} />}
        variant="ghost"
        className={`absolute top-6 right-6 lg:top-8 lg:right-8 !w-14 !h-14 !rounded-full !bg-white/10 dark:!bg-white/10 hover:!bg-white/20 backdrop-blur-xl !text-white !shadow-2xl z-[110] transition-all duration-500 delay-100 ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative w-[90vw] max-w-[1100px] max-h-[90vh] bg-white dark:bg-inmo-darkbg rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 flex flex-col z-[105] ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto w-full relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
      </div>
    </div>
  );
};

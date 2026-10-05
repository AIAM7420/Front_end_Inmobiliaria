import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export interface FloatingFilterButtonProps {
  onClick: () => void;
  size?: 'small' | 'large' | 'xl';
  className?: string;
  isActive?: boolean;
}

export const FloatingFilterButton: React.FC<FloatingFilterButtonProps> = ({
  onClick,
  size = 'small',
  className = '',
  isActive = false,
}) => {
  const sizeClasses = size === 'small' ? 'w-[44px] h-[44px]' : size === 'xl' ? 'w-[72px] h-[72px]' : 'w-[56px] h-[56px]';
  const iconSize = size === 'xl' ? 'w-6 h-6' : size === 'large' ? 'w-5 h-5 md:w-6 md:h-6' : 'w-5 h-5';

  return (
    <div className={`filter-dropdown-toggle ${sizeClasses} ${isActive ? 'ring-2 ring-inmo-accent/40 !bg-white dark:!bg-inmo-darkcard' : 'bg-white/70 dark:bg-black/60'} backdrop-blur-2xl border border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] rounded-full transition-all duration-300 select-none shrink-0 ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label="Filtros avanzados"
        className="relative flex flex-col items-center justify-center w-full h-full bg-transparent border-none outline-none cursor-pointer group hover:scale-105 transition-transform"
      >
        <div className={`relative flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-inmo-accent' : 'text-gray-600 dark:text-gray-300 group-hover:text-inmo-accent'}`}>
          <div className="relative transition-transform duration-300">
            <SlidersHorizontal className={iconSize} strokeWidth={isActive ? 2.5 : 2} />
          </div>
        </div>
      </button>
    </div>
  );
};

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
    <div className={`filter-dropdown-toggle ${sizeClasses} ${isActive ? 'ring-2 ring-inmo-accent/40 !bg-white/80 dark:!bg-inmo-darkcard' : 'bg-white/40 dark:bg-black/20'} backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm rounded-full transition-all duration-300 select-none shrink-0 ${className}`}>
      <button
        type="button"
        onClick={event => { event.currentTarget.focus({ preventScroll: true }); onClick(); }}
        aria-label="Abrir filtros" aria-expanded={isActive}
        className="relative flex flex-col items-center justify-center w-full h-full bg-transparent border-none focus-visible:ring-2 focus-visible:ring-inmo-accent outline-none cursor-pointer group hover:scale-105 transition-transform"
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

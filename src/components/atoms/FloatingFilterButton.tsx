import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export interface FloatingFilterButtonProps {
  onClick: () => void;
  size?: 'small' | 'large';
  className?: string;
}

export const FloatingFilterButton: React.FC<FloatingFilterButtonProps> = ({
  onClick,
  size = 'small',
  className = ''
}) => {
  return (
    <div className={`${size === 'small' ? 'w-[44px] h-[44px]' : 'w-[52px] h-[52px]'} bg-white/60 dark:bg-black/60 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-full transition-all duration-300 select-none shrink-0 ${className}`}>
      <button
        onClick={onClick}
        className="relative flex flex-col items-center justify-center w-full h-full bg-transparent border-none outline-none cursor-pointer group hover:scale-105 transition-transform"
      >
        <div className="relative flex flex-col items-center justify-center transition-all duration-300 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200">
          <div className="relative transition-transform duration-300">
            <SlidersHorizontal className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
          </div>
        </div>
      </button>
    </div>
  );
};

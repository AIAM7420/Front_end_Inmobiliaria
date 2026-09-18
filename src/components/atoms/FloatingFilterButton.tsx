import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from './Button';

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
  if (size === 'large') {
    return (
      <button 
        onClick={onClick}
        className={`w-[72px] h-[72px] rounded-[32px] bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-inmo-secondary dark:text-white transition-all hover:bg-white/60 dark:hover:bg-black/40 hover:scale-105 shrink-0 select-none ${className}`}
      >
        <SlidersHorizontal className="w-6 h-6" strokeWidth={2} />
      </button>
    );
  }

  // Small size must EXACTLY match CategoryPills height:
  // Mobile: 52px button + 16px padding = 68px
  // Desktop: 56px button + 16px padding = 72px
  return (
    <div className={`w-[68px] h-[68px] md:w-[72px] md:h-[72px] bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] p-2 rounded-[28px] transition-all duration-300 select-none shrink-0 ${className}`}>
      <Button 
        onClick={onClick}
        variant="ghost"
        icon={<SlidersHorizontal className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />}
        className="!w-full !h-full !p-0 !rounded-[20px] hover:!bg-white/50 dark:hover:!bg-white/10 !text-inmo-secondary dark:!text-gray-200"
      />
    </div>
  );
};

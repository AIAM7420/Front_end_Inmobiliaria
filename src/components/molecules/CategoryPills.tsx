import React from 'react';
import { Globe, Home, Building2, Trees } from 'lucide-react';
import { Button } from '../atoms/Button';

export type PropertyCategory = 'all' | 'casa' | 'departamento' | 'terreno';

export interface CategoryPillsProps {
  activeFilter: PropertyCategory;
  onSelectFilter: (filter: PropertyCategory) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({ activeFilter, onSelectFilter, className = '', orientation = 'horizontal' }) => {
  return (
    <div className={`${orientation === 'vertical' ? 'w-[72px] rounded-[32px]' : 'w-full max-w-md rounded-[28px]'} bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] p-2 transition-all duration-300 select-none ${className}`}>
      <div className={`flex ${orientation === 'vertical' ? 'flex-col' : 'justify-between items-stretch'} gap-1.5 h-full`}>
        <Button 
          onClick={() => onSelectFilter('all')}
          variant={activeFilter === 'all' ? 'accent' : 'secondary'}
          icon={<Globe className="w-5 h-5 md:w-6 md:h-6" strokeWidth={activeFilter === 'all' ? 2.5 : 2} />}
          className={`flex-1 !p-0 !h-[52px] md:!h-[56px] !rounded-[20px] transition-all flex items-center justify-center ${activeFilter === 'all' ? '!shadow-md' : 'hover:!bg-white/50 dark:hover:!bg-white/10 !text-inmo-secondary dark:!text-gray-200'}`}
        />
        <Button 
          onClick={() => onSelectFilter('casa')}
          variant={activeFilter === 'casa' ? 'accent' : 'ghost'}
          icon={<Home className="w-5 h-5 md:w-6 md:h-6" strokeWidth={activeFilter === 'casa' ? 2.5 : 2} />}
          className={`flex-1 !p-0 !h-[52px] md:!h-[56px] !rounded-[20px] transition-all flex items-center justify-center ${activeFilter === 'casa' ? '!shadow-md' : 'hover:!bg-white/50 dark:hover:!bg-white/10 !text-inmo-secondary dark:!text-gray-200'}`}
        />
        <Button 
          onClick={() => onSelectFilter('departamento')}
          variant={activeFilter === 'departamento' ? 'accent' : 'ghost'}
          icon={<Building2 className="w-5 h-5 md:w-6 md:h-6" strokeWidth={activeFilter === 'departamento' ? 2.5 : 2} />}
          className={`flex-1 !p-0 !h-[52px] md:!h-[56px] !rounded-[20px] transition-all flex items-center justify-center ${activeFilter === 'departamento' ? '!shadow-md' : 'hover:!bg-white/50 dark:hover:!bg-white/10 !text-inmo-secondary dark:!text-gray-200'}`}
        />
        <Button 
          onClick={() => onSelectFilter('terreno')}
          variant={activeFilter === 'terreno' ? 'accent' : 'ghost'}
          icon={<Trees className="w-5 h-5 md:w-6 md:h-6" strokeWidth={activeFilter === 'terreno' ? 2.5 : 2} />}
          className={`flex-1 !p-0 !h-[52px] md:!h-[56px] !rounded-[20px] transition-all flex items-center justify-center ${activeFilter === 'terreno' ? '!shadow-md' : 'hover:!bg-white/50 dark:hover:!bg-white/10 !text-inmo-secondary dark:!text-gray-200'}`}
        />
      </div>
    </div>
  );
};

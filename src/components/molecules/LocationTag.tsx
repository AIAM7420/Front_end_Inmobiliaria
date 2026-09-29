import React from 'react';
import { MapPin } from 'lucide-react';

export interface LocationTagProps {
  city?: string;
  state?: string;
  onClick?: () => void;
  className?: string;
}

export const LocationTag: React.FC<LocationTagProps> = ({ 
  city = "León", 
  state = "Guanajuato, México", 
  onClick,
  className = ""
}) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between gap-3 bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/60 dark:border-white/20 pl-6 pr-1.5 py-1.5 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] cursor-pointer hover:bg-white/80 dark:hover:bg-black/60 transition-colors ${className}`}
    >
      <div className="flex flex-col text-left overflow-hidden">
        <span className="text-sm font-bold text-inmo-secondary dark:text-white leading-tight truncate">{city}</span>
        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 leading-none mt-0.5 truncate">{state}</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-white dark:bg-inmo-darkcard shadow-sm flex items-center justify-center shrink-0">
        <MapPin className="w-4 h-4 text-inmo-secondary dark:text-white" strokeWidth={2.5} />
      </div>
    </div>
  );
};

import React from 'react';

export type PeriodOption = string;

interface PeriodSelectorProps {
  options?: PeriodOption[];
  selectedPeriod: PeriodOption;
  onChange: (period: PeriodOption) => void;
  className?: string;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  options = ['Semana', 'Mes', '3 Meses', '6 Meses', 'Año'],
  selectedPeriod,
  onChange,
  className = ''
}) => {
  const selectedIndex = Math.max(0, options.indexOf(selectedPeriod));

  return (
    <div className={`flex w-full shrink-0 ${className}`}>
      {/* Contenedor 3D "Carved" (Sumido) */}
      <div className="relative w-full bg-gray-200 dark:bg-[#121315] rounded-full p-1.5 flex items-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.15),inset_0_-2px_6px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_6px_12px_rgba(0,0,0,0.4),inset_0_-2px_4px_rgba(255,255,255,0.05)] border border-transparent dark:border-black/50">
        
        {/* Pastilla 3D "Extruded" (Sobresaliente) */}
        <div 
          className="absolute top-1.5 bottom-1.5 left-1.5 bg-white dark:bg-inmo-darkcard rounded-full transition-transform duration-300 ease-out shadow-[0_4px_10px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_6px_14px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-gray-100/50 dark:border-white/5"
          style={{
            width: `calc((100% - 12px) / ${options.length})`,
            transform: `translateX(${selectedIndex * 100}%)`
          }}
        />

        {/* Buttons */}
        {options.map(period => (
          <button
            key={period}
            onClick={() => onChange(period)}
            className={`relative z-10 flex-1 py-2 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold font-inter transition-colors duration-300 ${
              selectedPeriod === period
                ? 'text-inmo-secondary dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-300/20 dark:hover:bg-white/5'
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '../atoms/Button';

export type PeriodOption = string;

interface PeriodDropdownProps {
  options?: PeriodOption[];
  selectedPeriod: PeriodOption;
  onChange: (period: PeriodOption) => void;
  className?: string;
  iconOnly?: boolean;
}

export const PeriodDropdown: React.FC<PeriodDropdownProps> = ({
  options = ['Semana', '1 Mes', '3 Meses', '6 Meses', 'Año'],
  selectedPeriod,
  onChange,
  className = '',
  iconOnly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${iconOnly ? 'w-[44px]' : 'w-[110px]'} ${className}`} ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        className={`w-full !h-[44px] flex items-center ${iconOnly ? 'justify-center !px-0 !rounded-full !gap-0' : 'justify-between px-4 !rounded-[14px] !gap-2'} !text-xs shadow-soft transition-all`}
        icon={<ChevronDown className={`w-4 h-4 shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
      >
        {iconOnly ? null : (
          <span>{selectedPeriod}</span>
        )}
      </Button>

      <div 
        className={`absolute top-full right-0 mt-2 w-44 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 origin-top-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
        }`}
      >
        <div className="py-2 flex flex-col">
          {options.map((period) => {
            const isSelected = selectedPeriod === period;
            return (
              <Button
                key={period}
                variant="ghost"
                onClick={() => {
                  onChange(period);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 !text-xs transition-colors !rounded-none !h-auto ${
                  isSelected
                    ? '!text-inmo-secondary dark:!text-white bg-gray-50 dark:bg-white/5'
                    : '!text-gray-500 dark:!text-gray-400 hover:!text-inmo-secondary dark:hover:!text-white hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
                icon={isSelected ? <Check className="w-4 h-4 text-inmo-accent" /> : undefined}
              >
                <span>{period}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '../atoms/Button';

interface TagDropdownProps {
  label: string;
  options: string[];
  selected: string | string[] | null;
  onChange: (selected: any) => void;
  className?: string;
  multiple?: boolean;
}

export const TagDropdown: React.FC<TagDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  className = '',
  multiple = false,
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

  const getButtonText = () => {
    if (!selected || (Array.isArray(selected) && selected.length === 0)) return label;
    if (multiple && Array.isArray(selected)) {
      if (selected.length === 1) return selected[0];
      return `${label} (${selected.length})`;
    }
    return selected === 'Todos' ? label : (selected as string);
  };

  const isSelected = (option: string) => {
    if (multiple && Array.isArray(selected)) {
      return selected.includes(option);
    }
    return selected === option;
  };

  const handleSelect = (option: string) => {
    if (multiple && Array.isArray(selected)) {
      if (selected.includes(option)) {
        onChange(selected.filter(item => item !== option));
      } else {
        onChange([...selected, option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        className="w-full !h-[38px] flex items-center justify-between px-4 !rounded-full !gap-2 !text-xs shadow-sm bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-gray-700 dark:text-gray-300"
        icon={<ChevronDown className={`w-3.5 h-3.5 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
      >
        <span className="truncate">{getButtonText()}</span>
      </Button>

      <div 
        className={`absolute top-full left-0 mt-2 min-w-[180px] bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 origin-top-left ${
          isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
        }`}
      >
        <div className="py-2 flex flex-col max-h-[250px] overflow-y-auto">
          {options.map((option) => {
            const active = isSelected(option);
            return (
              <Button
                key={option}
                variant="ghost"
                onClick={() => handleSelect(option)}
                className={`w-full !justify-start !px-4 !py-2.5 !h-auto !rounded-none !text-xs font-medium transition-colors ${
                  active 
                    ? 'text-inmo-accent bg-inmo-accent/5 dark:bg-inmo-accent/10' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
                icon={
                  <div className={`w-4 h-4 rounded-sm flex items-center justify-center shrink-0 border transition-colors ${
                    active 
                      ? 'bg-inmo-accent border-inmo-accent text-white' 
                      : multiple ? 'border-gray-300 dark:border-gray-600' : 'border-transparent'
                  }`}>
                    {active && <Check className="w-3 h-3" strokeWidth={3} />}
                  </div>
                }
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

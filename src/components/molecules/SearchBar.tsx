import React from 'react';
import { Search } from 'lucide-react';


export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  /** Size variant: 'xl' (72px), 'fat' (64px) or 'slim' (44px) */
  size?: 'xl' | 'fat' | 'slim';
  /** Extra wrapper classes */
  className?: string;
  /** Whether the bar has a glassmorphism background */
  glass?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Empieza tu busqueda',
  value,
  onChange,
  size = 'slim',
  className = '',
  glass = true,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value || '');

  React.useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const isActive = isFocused || localValue.length > 0;

  const h = size === 'xl' ? 'h-[72px]' : size === 'slim' ? 'h-[44px]' : 'h-[64px]';
  const textSize = size === 'xl' ? 'text-lg' : size === 'slim' ? 'text-sm' : 'text-base';
  const iconSize = size === 'xl' ? 'w-6 h-6' : size === 'slim' ? 'w-4 h-4' : 'w-5 h-5';
  
  // Padding base
  const px = size === 'xl' ? 'px-8' : size === 'slim' ? 'px-4' : 'px-6';

  // Liquid glass effect
  const glassStyles = "bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm";
  const solidStyles = "bg-gray-50 dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary shadow-sm";
  const bgClasses = glass ? glassStyles : solidStyles;
  // Determinar el padding en pixeles para el estado activo
  const pxValue = size === 'xl' ? '2rem' : size === 'slim' ? '1rem' : '1.5rem';

  return (
    <div
      className={`relative ${bgClasses} ${isFocused ? 'ring-2 ring-inmo-tertiary dark:ring-inmo-darktertiary' : ''} rounded-atom ${h} shadow-soft overflow-hidden cursor-text w-full flex items-center ${className}`}
      onClick={() => {
        const input = document.getElementById('animated-search-input');
        if (input) input.focus();
      }}
    >
      <div 
        className="absolute inset-y-0 flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] max-w-full"
        style={isActive 
          ? { left: 0, right: 0, paddingLeft: pxValue, paddingRight: pxValue, transform: 'translateX(0)' }
          : { left: '50%', transform: 'translateX(-50%)', width: 'max-content' }
        }
      >
        <Search
          className={`${iconSize} shrink-0 transition-colors duration-500 ${isActive ? 'text-inmo-secondary dark:text-white' : 'text-gray-400'}`}
          strokeWidth={2}
        />
        
        <div className={`relative flex items-center h-full min-w-0 transition-all duration-500 ${isActive ? 'flex-1' : 'w-max overflow-hidden'}`}>
          {/* Ghost span para forzar el tamaño exacto del texto y centrar el bloque unido cuando esta inactivo */}
          <span 
            className={`opacity-0 pointer-events-none whitespace-nowrap font-inter font-normal ${textSize}`}
            aria-hidden="true"
          >
            {localValue || placeholder}
          </span>
          
          <input
            id="animated-search-input"
            type="text"
            placeholder={placeholder}
            value={localValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`absolute inset-0 w-full h-full bg-transparent border-none outline-none text-inmo-secondary dark:text-white placeholder-gray-400 p-0 m-0 text-left text-ellipsis overflow-hidden whitespace-nowrap ${textSize}`}
          />
        </div>
      </div>
    </div>
  );
};

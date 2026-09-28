// Force Vite HMR rebuild
import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

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
  /** Automatically focus the input when true */
  autoFocus?: boolean;
  /** Triggered when the user presses Enter or clicks the search icon */
  onSubmit?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Empieza tu busqueda',
  value,
  onChange,
  size = 'slim',
  className = '',
  glass = true,
  autoFocus = false,
  onSubmit,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value || '');

  React.useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // 300ms matches the transition duration
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (onSubmit) {
        onSubmit(localValue);
        inputRef.current?.blur();
      }
    }
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
        if (inputRef.current) inputRef.current.focus();
      }}
    >
      <div className={`w-full h-full flex items-center transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]`} style={{ paddingLeft: pxValue, paddingRight: pxValue }}>
        {/* Left Spacer for centering */}
        <div className={`transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isActive ? 'flex-none w-0' : 'flex-1'}`} />

        {/* Icon (Clickable if onSubmit provided) */}
        <button
          type="button"
          onClick={(e) => {
            if (onSubmit) {
              e.stopPropagation();
              onSubmit(localValue);
              inputRef.current?.blur();
            }
          }}
          className={`shrink-0 transition-colors duration-500 ${isActive ? 'text-inmo-secondary dark:text-white' : 'text-gray-400'} ${onSubmit ? 'hover:scale-110 cursor-pointer' : 'cursor-text'}`}
        >
          <Search
            className={iconSize}
            strokeWidth={2}
          />
        </button>

        {/* Input Wrapper */}
        <div className={`relative flex items-center h-full ml-2 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] min-w-0 ${isActive ? 'flex-1' : 'flex-none'}`}>
          {/* Ghost span ensures the input wrapper is exactly as wide as the text when inactive */}
          <span 
            className={`opacity-0 pointer-events-none whitespace-nowrap font-inter font-normal ${textSize}`}
            aria-hidden="true"
          >
            {localValue || placeholder}
          </span>
          
          <input
            ref={inputRef}
            type="text"
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            value={localValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`absolute inset-0 w-full h-full bg-transparent border-none outline-none text-inmo-secondary dark:text-white placeholder-gray-400 p-0 m-0 text-left text-ellipsis overflow-hidden whitespace-nowrap ${textSize}`}
          />
        </div>

        {/* Clear Button */}
        <div className={`flex items-center justify-center transition-all duration-300 overflow-hidden ${localValue.length > 0 ? 'w-8 opacity-100 ml-1' : 'w-0 opacity-0'}`}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLocalValue('');
              if (onChange) onChange('');
              if (onSubmit) onSubmit('');
              inputRef.current?.focus();
            }}
            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Right Spacer for centering */}
        <div className={`transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isActive ? 'flex-none w-0' : 'flex-1'}`} />
      </div>
    </div>
  );
};

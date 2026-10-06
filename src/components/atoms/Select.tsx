import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  leftIcon?: React.ReactNode;
  error?: string;
  wrapperClassName?: string;
  glass?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  leftIcon,
  error,
  wrapperClassName = '',
  className = '',
  glass = true,
  children,
  ...props
}) => {
  const glassStyles = "bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm";
  const solidStyles = "bg-white dark:bg-inmo-darkcard shadow-soft";
  const bgStyles = glass ? glassStyles : solidStyles;

  const baseWrapperStyles = `relative ${bgStyles} rounded-atom h-[56px] w-full flex items-center px-6 gap-3 transition-all`;
  const errorWrapperStyles = error 
    ? "border-2 border-inmo-danger" 
    : "focus-within:ring-2 focus-within:ring-inmo-accent/20";

  const textStyles = error 
    ? "text-inmo-danger placeholder-inmo-danger/50" 
    : "text-inmo-secondary dark:text-white placeholder-gray-400";

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className={`${baseWrapperStyles} ${errorWrapperStyles} ${wrapperClassName}`}>
        {leftIcon && <div className="shrink-0">{leftIcon}</div>}
        
        <div className="relative w-full flex items-center">
          <select 
            className={`bg-transparent border-none outline-none w-full text-lg font-inter font-normal appearance-none cursor-pointer pr-8 ${textStyles} ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className={`absolute right-0 w-5 h-5 pointer-events-none ${error ? 'text-inmo-danger' : 'text-gray-400 dark:text-gray-300'}`} />
        </div>
        
        {error && (
          <AlertCircle className="w-6 h-6 text-inmo-danger shrink-0" />
        )}
      </label>
      
      {error && (
        <span className="text-inmo-danger font-inter font-bold text-sm pl-6">
          {error}
        </span>
      )}
    </div>
  );
};

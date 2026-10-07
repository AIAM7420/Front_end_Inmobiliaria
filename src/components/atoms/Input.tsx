import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  wrapperClassName?: string;
  glass?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  leftIcon,
  rightIcon,
  error,
  wrapperClassName = '',
  className = '',
  glass = true,
  ...props
}, ref) => {
  const glassStyles = "bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm";
  const solidStyles = "bg-white dark:bg-inmo-darkcard shadow-soft";
  const bgStyles = glass ? glassStyles : solidStyles;

  const baseWrapperStyles = `relative ${bgStyles} rounded-3xl h-[56px] w-full flex items-center px-5 gap-3 transition-all`;
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
        
        <input 
          ref={ref}
          className={`bg-transparent border-none outline-none w-full text-base font-inter font-normal ${textStyles} ${className}`}
          {...props}
        />
        
        {error ? (
          <AlertCircle className="w-6 h-6 text-inmo-danger shrink-0" />
        ) : (
          rightIcon && <div className="shrink-0">{rightIcon}</div>
        )}
      </label>
      
      {error && (
        <span className="text-inmo-danger font-inter font-bold text-sm pl-6">
          {error}
        </span>
      )}
    </div>
  );
});
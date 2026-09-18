import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  leftIcon,
  rightIcon,
  error,
  wrapperClassName = '',
  className = '',
  ...props
}, ref) => {
  const baseWrapperStyles = "relative bg-white dark:bg-inmo-darkcard rounded-3xl h-[56px] w-full shadow-soft flex items-center px-5 gap-3 transition-all";
  const errorWrapperStyles = error 
    ? "border-2 border-inmo-danger" 
    : "focus-within:ring-4 focus-within:ring-inmo-tertiary dark:focus-within:ring-inmo-darktertiary";

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
import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  leftIcon?: React.ReactNode;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  leftIcon,
  error,
  wrapperClassName = '',
  className = '',
  ...props
}) => {
  const baseWrapperStyles = "relative bg-white dark:bg-inmo-darkcard rounded-3xl w-full shadow-soft flex px-6 pt-5 pb-4 gap-3 transition-all";
  const errorWrapperStyles = error 
    ? "border-2 border-inmo-danger" 
    : "focus-within:ring-4 focus-within:ring-inmo-tertiary dark:focus-within:ring-inmo-darktertiary";

  const textStyles = error 
    ? "text-inmo-danger placeholder-inmo-danger/50" 
    : "text-inmo-secondary dark:text-white placeholder-gray-400";

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className={`${baseWrapperStyles} ${errorWrapperStyles} ${wrapperClassName}`}>
        {leftIcon && <div className="shrink-0 mt-1">{leftIcon}</div>}
        
        <textarea 
          className={`bg-transparent border-none outline-none w-full text-lg font-inter font-normal resize-none min-h-[80px] ${textStyles} ${className}`}
          {...props}
        />
        
        {error && (
          <AlertCircle className="w-6 h-6 text-inmo-danger shrink-0 mt-1" />
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

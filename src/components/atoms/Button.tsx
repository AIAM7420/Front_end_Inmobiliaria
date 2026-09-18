import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'accent' | 'secondary' | 'tertiary' | 'text' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'accent', 
  isLoading, 
  icon, 
  disabled,
  className = '',
  ...props 
}) => {
  // text variant shouldn't have gap-3 padding etc by default if it's meant to be inline, but we can customize it or keep it simple
  const baseStyles = variant === 'text' 
    ? "transition-all font-inter active:scale-95 flex items-center justify-center gap-2" 
    : "rounded-atom flex items-center justify-center gap-3 transition-all font-inter font-bold active:scale-95";
  
  const variants = {
    accent: "bg-inmo-accent text-white shadow-glow hover:bg-red-600 hover:-translate-y-1",
    secondary: "bg-white dark:bg-inmo-darkcard text-inmo-secondary dark:text-white shadow-soft hover:bg-gray-100 dark:hover:bg-inmo-darkbg hover:-translate-y-1",
    tertiary: "bg-inmo-tertiary dark:bg-inmo-darktertiary text-inmo-secondary dark:text-white shadow-soft hover:bg-gray-300 dark:hover:bg-gray-500 hover:scale-110",
    text: "text-gray-500 dark:text-gray-400 font-medium hover:text-inmo-accent dark:hover:text-inmo-accent",
    ghost: "bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-inmo-darkbg hover:text-inmo-secondary dark:hover:text-white"
  };

  const disabledStyles = variant === 'text' 
    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed active:scale-100"
    : "bg-gray-300 dark:bg-inmo-darkbg text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none active:scale-100 hover:translate-y-0 hover:scale-100";
    
  const loadingStyles = "opacity-90 cursor-wait active:scale-100 hover:translate-y-0 hover:scale-100";

  let currentStyles = variants[variant];
  if (disabled) {
    currentStyles = disabledStyles;
  } else if (isLoading) {
    currentStyles = `${variants[variant]} ${loadingStyles}`;
  }

  return (
    <button 
      disabled={disabled || isLoading}
      className={`${baseStyles} ${currentStyles} ${className}`}
      {...props}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin shrink-0" /> : icon}
      {(children || isLoading) && (
        <span className="tracking-tight">{isLoading ? 'Procesando...' : children}</span>
      )}
    </button>
  );
};
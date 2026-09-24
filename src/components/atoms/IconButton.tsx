import React from 'react';
import { Loader2 } from 'lucide-react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'accent' | 'tertiary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'tertiary',
  size = 'md',
  isLoading,
  icon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = "flex items-center justify-center transition-all active:scale-95 shrink-0";
  
  const variants = {
    accent: "bg-inmo-accent shadow-glow text-white hover:bg-red-600 hover:scale-110",
    tertiary: "bg-inmo-tertiary dark:bg-inmo-darktertiary text-inmo-secondary dark:text-white shadow-soft hover:bg-gray-300 dark:hover:bg-gray-500 hover:scale-110",
    secondary: "bg-white dark:bg-inmo-darkcard text-inmo-secondary dark:text-white shadow-soft hover:scale-110",
    ghost: "bg-transparent shadow-none hover:scale-110 hover:text-inmo-accent"
  };

  const sizes = {
    sm: "w-10 h-10 rounded-atom",
    md: "w-11 h-11 rounded-atom",
    lg: "w-[80px] h-[80px] rounded-[28px]"
  };

  const disabledStyles = "bg-gray-300 dark:bg-inmo-darkbg text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none hover:scale-100 active:scale-100";
  const loadingStyles = "opacity-90 cursor-wait hover:scale-100 active:scale-100";

  let currentStyles = variants[variant];
  if (disabled) {
    currentStyles = disabledStyles;
  } else if (isLoading) {
    currentStyles = `${variants[variant]} ${loadingStyles}`;
  }

  return (
    <button 
      disabled={disabled || isLoading}
      className={`${baseStyles} ${currentStyles} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? <Loader2 className="w-6 h-6 animate-spin shrink-0" /> : icon}
    </button>
  );
};
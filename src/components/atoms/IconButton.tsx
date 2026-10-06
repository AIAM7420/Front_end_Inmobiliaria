import React, { useRef } from 'react';
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
  const tap = useRef<{ x: number; y: number; id: number } | null>(null);
  const baseStyles = "flex items-center justify-center transition-all active:scale-95 shrink-0";

  const variants = {
    accent: "bg-inmo-accent shadow-glow text-white hover:bg-red-600 hover:scale-110",
    tertiary: "bg-inmo-tertiary dark:bg-inmo-darktertiary text-inmo-secondary dark:text-white shadow-soft hover:bg-gray-300 dark:hover:bg-gray-500 hover:scale-110",
    secondary: "bg-white dark:bg-inmo-darkcard text-inmo-secondary dark:text-white shadow-soft hover:scale-110",
    ghost: "bg-transparent shadow-none hover:scale-110 hover:text-inmo-accent text-gray-500 dark:text-gray-400 transition-colors"
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
      onTouchStart={event => {
        props.onTouchStart?.(event);
        const touch = event.touches[0];
        tap.current = !event.defaultPrevented && event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY, id: touch.identifier } : null;
      }}
      onTouchMove={event => {
        props.onTouchMove?.(event);
        const touch = event.touches[0], start = tap.current;
        if (event.touches.length !== 1 || (start && Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > 10)) tap.current = null;
      }}
      onTouchCancel={event => { tap.current = null; props.onTouchCancel?.(event); }}
      onTouchEnd={event => {
        props.onTouchEnd?.(event);
        const start = tap.current, touch = event.changedTouches[0];
        tap.current = null;
        if (event.defaultPrevented || disabled || isLoading || !start || !touch || event.touches.length || touch.identifier !== start.id) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > 10 || touch.clientX < rect.left || touch.clientX > rect.right || touch.clientY < rect.top || touch.clientY > rect.bottom) return;
        // Chrome can suppress the compatibility click immediately after a scroll.
        // Activate a genuine stationary tap and suppress its delayed duplicate.
        event.preventDefault();
        event.currentTarget.focus({ preventScroll: true });
        event.currentTarget.click();
      }}
      onClick={event => {
        if (/filtro/i.test(props['aria-label'] ?? '')) event.currentTarget.focus({ preventScroll: true });
        props.onClick?.(event);
      }}
    >
      {isLoading ? <Loader2 className="w-6 h-6 animate-spin shrink-0" /> : icon}
    </button>
  );
};

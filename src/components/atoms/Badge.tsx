import React from 'react';
import { Tag, Key, Sparkles, CheckCircle2, AlertTriangle, Circle } from 'lucide-react';

export interface BadgeProps {
  text?: string;
  children?: React.ReactNode;
  variant?: 'venta' | 'renta' | 'nuevo' | 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
  responsiveText?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  children,
  variant = 'primary',
  className = '',
  responsiveText = true
}) => {
  const baseStyles = `flex items-center gap-1.5 px-3 @xs:px-4 py-1.5 @xs:py-2 rounded-atom text-xs @xs:text-sm font-inter font-bold shadow-sm tracking-wide whitespace-nowrap transition-all`;
  
  const variants = {
    venta: { classes: "bg-inmo-accent text-white", Icon: Tag },
    renta: { classes: "bg-inmo-tertiary text-inmo-secondary dark:bg-inmo-darktertiary dark:text-white", Icon: Key },
    nuevo: { classes: "bg-[#EBF0F5] dark:bg-inmo-darktertiary text-inmo-secondary dark:text-white", Icon: Sparkles },
    primary: { classes: "bg-inmo-accent text-white", Icon: Tag },
    secondary: { classes: "bg-[#EBF0F5] dark:bg-inmo-darktertiary text-inmo-secondary dark:text-white", Icon: Circle },
    success: { classes: "bg-inmo-success text-white", Icon: CheckCircle2 },
    warning: { classes: "bg-inmo-warning text-white", Icon: AlertTriangle }
  };

  const currentVariant = variants[variant] || variants.primary;
  const IconComponent = currentVariant.Icon;

  return (
    <span className={`${baseStyles} ${currentVariant.classes} ${className}`}>
      <IconComponent className="w-3.5 h-3.5 @xs:w-4 @xs:h-4 shrink-0" strokeWidth={2.5} />
      <span className={responsiveText ? "hidden @xs:inline-block" : "inline-block"}>
        {text || children}
      </span>
    </span>
  );
};
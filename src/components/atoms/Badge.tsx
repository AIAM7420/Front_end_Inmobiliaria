import React from 'react';
import { Tag, Sparkles, CheckCircle2, AlertTriangle, Circle, Award } from 'lucide-react';

export interface BadgeProps {
  text?: string;
  children?: React.ReactNode;
  variant?: 'venta' | 'nuevo' | 'primary' | 'secondary' | 'success' | 'warning' | 'verified' | 'verified-lg';
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
  const baseStyles = `flex items-center justify-center gap-1.5 px-3 @xs:px-4 py-1.5 @xs:py-2 rounded-atom text-xs @xs:text-sm font-inter font-medium shadow-sm tracking-wide whitespace-nowrap transition-all`;

  const variants = {
    venta: { classes: "bg-inmo-accent text-white", Icon: Tag },
    nuevo: { classes: "bg-gray-100 dark:bg-inmo-darktertiary text-inmo-secondary dark:text-white", Icon: Sparkles },
    primary: { classes: "bg-inmo-accent text-white", Icon: Tag },
    secondary: { classes: "bg-gray-100 dark:bg-inmo-darktertiary text-inmo-secondary dark:text-white", Icon: Circle },
    success: { classes: "bg-inmo-success text-white", Icon: CheckCircle2 },
    warning: { classes: "bg-inmo-warning text-white", Icon: AlertTriangle },
    verified: { classes: "bg-inmo-accent text-white", Icon: Award },
    'verified-lg': { classes: "bg-inmo-accent text-white", Icon: Award }
  };

  const currentVariant = variants[variant] || variants.primary;
  const IconComponent = currentVariant.Icon;

  // Custom size/stroke logic for specific variants
  const isLg = variant === 'verified-lg';
  const iconClasses = isLg
    ? "w-4 h-4 @xs:w-5 @xs:h-5 shrink-0"
    : "w-3.5 h-3.5 @xs:w-4 @xs:h-4 shrink-0";
  const strokeW = isLg ? 2 : 1.5;

  const hasContent = Boolean(text || children);

  return (
    <span className={`${baseStyles} ${currentVariant.classes} ${className}`}>
      <IconComponent className={iconClasses} strokeWidth={strokeW} />
      {hasContent && (
        <span className={responsiveText ? "hidden @xs:inline-block" : "inline-block"}>
          {text || children}
        </span>
      )}
    </span>
  );
};

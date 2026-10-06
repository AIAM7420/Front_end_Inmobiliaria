import React from 'react';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  /** Acciones (botones/enlaces) que ayudan a salir del estado vacío. */
  actions?: React.ReactNode;
  /** `error` usa el color de peligro y anuncia el mensaje como alerta. */
  tone?: 'neutral' | 'error';
  /** Versión reducida para paneles laterales, listas y overlays. */
  compact?: boolean;
  className?: string;
}

/**
 * Estado vacío reutilizable: zona con borde punteado, icono lineal tenue,
 * mensaje centrado y acciones sugeridas.
 */
export function EmptyState({ icon, title, description, actions, tone = 'neutral', compact = false, className = '' }: EmptyStateProps) {
  const isError = tone === 'error';
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`w-full flex-1 h-full flex flex-col items-center justify-center text-center font-inter rounded-[24px] border-2 border-dashed bg-black/[0.02] dark:bg-white/[0.02] animate-in fade-in duration-500 ${isError ? 'border-inmo-danger/25 dark:border-inmo-danger/30' : 'border-gray-200 dark:border-white/10'} ${compact ? 'gap-2 px-5 py-8 min-h-[180px]' : 'gap-3 px-6 py-14 min-h-[280px] md:min-h-[340px]'} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`flex items-center justify-center mb-1 [&>svg]:stroke-[1.5] ${compact ? '[&>svg]:w-8 [&>svg]:h-8' : '[&>svg]:w-11 [&>svg]:h-11'} ${isError ? 'text-inmo-danger/70' : 'text-gray-400 dark:text-gray-500'}`}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-1 max-w-md">
        <h3 className={`font-montserrat font-bold text-gray-600 dark:text-gray-300 ${compact ? 'text-sm' : 'text-base'}`}>{title}</h3>
        {description && <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center justify-center gap-3 mt-3">{actions}</div>}
    </div>
  );
}

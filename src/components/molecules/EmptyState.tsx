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
  /** Si tiene fondo sólido/liso para contrastar con fondos de patrones o doodles */
  solid?: boolean;
}

/**
 * Estado vacío reutilizable: zona con fondo liso o borde punteado, icono tenue o destacado,
 * mensaje centrado y acciones sugeridas.
 */
export function EmptyState({
  icon,
  title,
  description,
  actions,
  tone = 'neutral',
  compact = false,
  className = '',
  solid = false,
}: EmptyStateProps) {
  const isError = tone === 'error';

  const containerStyles = solid
    ? `bg-white dark:bg-inmo-darkcard shadow-soft border border-gray-100 dark:border-inmo-darktertiary rounded-3xl p-6 sm:p-8 max-w-md mx-auto my-auto`
    : `rounded-[24px] border-2 border-dashed bg-black/[0.02] dark:bg-white/[0.02] ${
        isError ? 'border-inmo-danger/25 dark:border-inmo-danger/30' : 'border-gray-200 dark:border-white/10'
      }`;

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`w-full flex-1 flex flex-col items-center justify-center text-center font-inter animate-in fade-in duration-500 ${containerStyles} ${
        compact ? 'gap-2 px-5 py-6 min-h-[160px]' : 'gap-3 px-6 py-10 min-h-[240px]'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`flex items-center justify-center mb-1 [&>svg]:stroke-[1.5] ${
          compact ? '[&>svg]:w-8 [&>svg]:h-8' : '[&>svg]:w-11 [&>svg]:h-11'
        } ${isError ? 'text-inmo-danger/70' : 'text-gray-400 dark:text-gray-500'}`}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3
          className={`font-montserrat font-bold ${
            solid
              ? 'text-inmo-secondary dark:text-white text-base sm:text-lg'
              : `text-gray-600 dark:text-gray-300 ${compact ? 'text-sm' : 'text-base'}`
          }`}
        >
          {title}
        </h3>
        {description && (
          <p
            className={`font-inter leading-relaxed ${
              solid
                ? 'text-gray-500 dark:text-gray-400 text-xs sm:text-sm'
                : 'text-gray-400 dark:text-gray-500 text-xs'
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center justify-center gap-3 mt-3">{actions}</div>}
    </div>
  );
}

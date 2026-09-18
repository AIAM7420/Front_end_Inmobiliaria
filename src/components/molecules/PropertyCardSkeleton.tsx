// src/components/molecules/PropertyCardSkeleton.tsx
import React from 'react';
import { Skeleton } from '../atoms/Skeleton'; // Importando el átomo previo

interface PropertyCardSkeletonProps {
  layout?: 'grid' | 'list';
}

export const PropertyCardSkeleton: React.FC<PropertyCardSkeletonProps> = ({ 
  layout = 'list' 
}) => {
  // Variante para el Bottom Sheet (Grid)[cite: 1]
  if (layout === 'grid') {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-32 w-full" variant="rectangular" />
        <Skeleton className="w-3/4" variant="text" />
        <Skeleton className="w-1/4" variant="text" />
      </div>
    );
  }

  // Variante para tarjetas grandes de resultados (List)[cite: 2]
  return (
    <div className="bg-white dark:bg-inmo-darkcard p-5 rounded-[30px] shadow-soft w-full">
      <Skeleton className="w-full h-[140px] mb-4" variant="rectangular" />
      <Skeleton className="w-3/4 mb-3" variant="text" />
      <Skeleton className="w-1/2" variant="text" />
    </div>
  );
};
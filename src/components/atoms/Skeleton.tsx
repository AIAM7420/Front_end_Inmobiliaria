// src/components/atoms/skeleton.tsx
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '',
  variant = 'rectangular' 
}) => {
  const baseStyles = "bg-gray-200 dark:bg-inmo-darkbg animate-pulse"; //[cite: 1, 2]
  
  const variants = {
    rectangular: "rounded-[20px]", // Para tarjetas o imágenes[cite: 2]
    circular: "rounded-atom",      // Para avatares o íconos
    text: "rounded-atom h-3"       // Para líneas de texto[cite: 1, 2]
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} />
  );
};
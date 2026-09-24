import React from 'react';

export interface AmenitySelectorProps {
  icon: React.ElementType;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function AmenitySelector({ icon: Icon, label, selected = false, onClick }: AmenitySelectorProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 active:scale-95 ${
        selected
          ? 'bg-inmo-accent/10 border-inmo-accent text-inmo-accent dark:bg-inmo-accent/20 dark:border-inmo-accent dark:text-inmo-accent shadow-sm'
          : 'bg-white border-inmo-tertiary text-gray-500 hover:border-inmo-secondary hover:text-inmo-secondary hover:shadow-soft dark:bg-inmo-darkcard dark:border-inmo-darktertiary dark:text-gray-400 dark:hover:border-gray-400 dark:hover:text-white'
      }`}
    >
      <Icon className={`w-7 h-7 mb-2.5 transition-transform duration-300 ${selected ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="text-sm font-inter font-bold text-center tracking-tight">{label}</span>
    </button>
  );
}

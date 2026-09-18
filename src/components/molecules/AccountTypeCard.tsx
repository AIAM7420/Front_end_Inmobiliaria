import React from 'react';
import { Button } from '../atoms/Button';

export interface AccountTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export const AccountTypeCard: React.FC<AccountTypeCardProps> = ({
  icon,
  title,
  description,
  isSelected,
  onClick,
}) => {
  const borderStyles = isSelected
    ? 'border-2 border-inmo-accent shadow-glow'
    : 'border-2 border-transparent shadow-soft hover:border-inmo-tertiary dark:hover:border-inmo-darktertiary';

  const iconBgStyles = isSelected
    ? 'bg-inmo-accent/10 dark:bg-inmo-accent/20'
    : 'bg-inmo-tertiary/50 dark:bg-inmo-darktertiary/50';

  const iconColorStyles = isSelected
    ? 'text-inmo-accent'
    : 'text-gray-400';

  return (
    <Button
      variant="text"
      onClick={onClick}
      className={`!bg-white dark:!bg-inmo-darkcard !rounded-card !p-6 transition-all cursor-pointer active:scale-95 hover:-translate-y-1 w-full ${borderStyles} !shadow-none !h-auto`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <div className={`${iconBgStyles} rounded-atom p-4 transition-colors`}>
          <div className={`${iconColorStyles} transition-colors`}>
            {icon}
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1 w-full">
          <span className="text-subtitle text-center !whitespace-normal break-words">{title}</span>
          <span className="text-body text-center text-xs leading-relaxed !whitespace-normal break-words">{description}</span>
        </div>

        {/* Selection indicator */}
        <div className={`w-5 h-5 rounded-atom border-2 flex items-center justify-center transition-all ${
          isSelected 
            ? 'border-inmo-accent bg-inmo-accent' 
            : 'border-gray-300 dark:border-inmo-darktertiary'
        }`}>
          {isSelected && (
            <div className="w-2 h-2 rounded-atom bg-white" />
          )}
        </div>
      </div>
    </Button>
  );
};

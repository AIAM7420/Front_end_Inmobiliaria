import React from 'react';
import { Button } from '../atoms/Button';

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  danger?: boolean;
}

interface ActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: ActionMenuItem[];
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ isOpen, onClose, items }) => {
  return (
    <div
      className={`absolute right-0 top-full mt-2 w-48 bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] z-[100] overflow-hidden transition-all duration-200 origin-top-right ${
        isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
      }`}
    >
      <div className="py-2 flex flex-col">
        {items.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={(e) => {
              item.onClick(e);
              onClose();
            }}
            className={`w-full flex items-center justify-start gap-3 px-4 py-2.5 !text-xs transition-colors !rounded-none !h-auto ${
              item.danger
                ? '!text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                : '!text-gray-600 dark:!text-gray-300 hover:!text-inmo-secondary dark:hover:!text-white hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
            icon={item.icon}
          >
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

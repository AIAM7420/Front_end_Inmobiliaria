import React from 'react';
import { Check, X, TriangleAlert, Info, EyeOff, Eye, Trash2, Save, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'danger' | 'warning' | 'info' | 'hide' | 'show' | 'delete' | 'create' | 'update';

export interface ToastProps {
  type: ToastType;
  title: string;
  message: string;
  onClose?: () => void;
}

const toastConfig = {
  success: { icon: Check, color: 'bg-inmo-success' },
  danger: { icon: X, color: 'bg-inmo-danger' },
  warning: { icon: TriangleAlert, color: 'bg-inmo-warning' },
  info: { icon: Info, color: 'bg-inmo-info' },
  hide: { icon: EyeOff, color: 'bg-gray-500' },
  show: { icon: Eye, color: 'bg-inmo-success' },
  delete: { icon: Trash2, color: 'bg-inmo-danger' },
  create: { icon: Sparkles, color: 'bg-inmo-accent' },
  update: { icon: Save, color: 'bg-inmo-info' }
};

export const SemanticToast: React.FC<ToastProps> = ({ type, title, message, onClose }) => {
  const { icon: Icon, color } = toastConfig[type];

  return (
    <div className="bg-gray-50 dark:bg-inmo-darkcard border border-gray-200 dark:border-inmo-darktertiary shadow-none text-inmo-secondary dark:text-white px-5 py-4 rounded-2xl flex items-center gap-4 relative">
      <div className={`${color} rounded-atom p-1.5 shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col flex-1 pr-4">
        <span className="font-inter font-bold text-sm leading-tight">{title}</span>
        <span className="font-inter text-xs text-gray-500 dark:text-gray-400 mt-0.5">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

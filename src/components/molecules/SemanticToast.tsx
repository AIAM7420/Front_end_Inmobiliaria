import React from 'react';
import { Check, X, TriangleAlert, Info } from 'lucide-react';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface ToastProps {
  type: ToastType;
  title: string;
  message: string;
}

const toastConfig = {
  success: { icon: Check, color: 'bg-inmo-success' },
  danger: { icon: X, color: 'bg-inmo-danger' },
  warning: { icon: TriangleAlert, color: 'bg-inmo-warning' },
  info: { icon: Info, color: 'bg-inmo-info' }
};

export const SemanticToast: React.FC<ToastProps> = ({ type, title, message }) => {
  const { icon: Icon, color } = toastConfig[type];

  return (
    <div className="bg-inmo-secondary dark:bg-white text-white dark:text-inmo-secondary px-5 py-4 rounded-2xl flex items-center gap-4 shadow-soft">
      <div className={`${color} rounded-atom p-1.5 shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-inter font-bold text-sm leading-tight">{title}</span>
        <span className="font-inter text-xs text-gray-400 dark:text-gray-500 mt-0.5">{message}</span>
      </div>
    </div>
  );
};
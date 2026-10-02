import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ToastType } from '../components/molecules/SemanticToast';
import { SemanticToast } from '../components/molecules/SemanticToast';
import { createPortal } from 'react-dom';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  autoClose?: boolean | number;
}

interface ToastContextType {
  addToast: (type: ToastType, title: string, message: string, autoClose?: boolean | number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastItem: React.FC<{ toast: ToastData, onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entry animation safely after mount
    const raf = requestAnimationFrame(() => {
      setIsEntering(false);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Wait for the exit animation duration (duration-300)
  }, [onRemove, toast.id]);

  useEffect(() => {
    if (toast.autoClose !== false) {
      const duration = typeof toast.autoClose === 'number' ? toast.autoClose : 4000;
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [toast.autoClose, handleClose]);

  return (
    <div
      className={`pointer-events-auto transform-gpu transition-all duration-300 ease-in-out ${
        isEntering ? 'opacity-0 translate-x-full' : isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      <SemanticToast 
        type={toast.type} 
        title={toast.title} 
        message={toast.message} 
        onClose={toast.autoClose === false ? handleClose : undefined}
      />
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message: string, autoClose?: boolean | number) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      const newToasts = [...prev, { id, type, title, message, autoClose }];
      if (newToasts.length > 5) {
        return newToasts.slice(newToasts.length - 5);
      }
      return newToasts;
    });
  }, []);

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed top-24 right-4 md:right-6 left-4 md:left-auto md:w-[400px] z-[9999] flex flex-col gap-3 pointer-events-none overflow-hidden pb-4">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

import React, { useEffect, useState, useRef } from 'react';
import { X, AlertTriangle, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface ProcessingConfig {
  title: string;
  steps?: string[];
  duration?: number;
  hideCancel?: boolean;
  successMessage?: string;
  type?: 'danger' | 'success' | 'warning' | 'info' | 'muted' | 'accent';
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'accent' | 'danger' | 'warning' | 'secondary';
  icon?: React.ReactNode;
  withDelay?: boolean;
  processingConfig?: ProcessingConfig;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'accent',
  icon = <AlertTriangle className="w-6 h-6 text-inmo-warning" />,
  withDelay = false,
  processingConfig
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsProcessing(false);
      setIsSuccess(false);
      setCurrentStep(0);
    } else {
      document.body.style.overflow = 'unset';
      if (timerRef.current) clearTimeout(timerRef.current);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (timerRef.current) clearTimeout(timerRef.current);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    if (withDelay) {
      setIsProcessing(true);
      setCurrentStep(0);
      const duration = processingConfig?.duration || 3000;
      
      if (processingConfig?.steps && processingConfig.steps.length > 0) {
        const stepTime = duration / processingConfig.steps.length;
        stepIntervalRef.current = setInterval(() => {
          setCurrentStep(prev => Math.min(prev + 1, processingConfig.steps!.length - 1));
        }, stepTime);
      }

      timerRef.current = setTimeout(() => {
        if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
        
        if (processingConfig?.successMessage) {
          setIsProcessing(false);
          setIsSuccess(true);
          timerRef.current = setTimeout(() => {
            onConfirm();
            onClose();
          }, 1500);
        } else {
          onConfirm();
          onClose();
        }
      }, duration);
    } else {
      onConfirm();
      onClose();
    }
  };

  const handleCancelClick = () => {
    if (isProcessing) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      setIsProcessing(false);
      onClose();
    } else {
      onClose();
    }
  };

  const renderSuccessState = () => {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-inmo-success/10 flex items-center justify-center mb-6 relative">
          <CheckCircle2 className="w-12 h-12 text-inmo-success animate-[bounce_1s_infinite]" />
        </div>
        <h3 className="font-montserrat font-bold text-[22px] text-inmo-secondary dark:text-white mb-2">
          {processingConfig?.successMessage}
        </h3>
      </div>
    );
  };

  const renderProcessingState = () => {
    const config = processingConfig || { title: 'Procesando...' };
    
    const getProcessingColors = (type?: string) => {
      switch (type) {
        case 'success': return { icon: 'text-inmo-success', bg: 'bg-inmo-success/10 border-inmo-success' };
        case 'danger': return { icon: 'text-inmo-danger', bg: 'bg-inmo-danger/10 border-inmo-danger' };
        case 'muted': return { icon: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800 border-gray-400' };
        case 'warning': return { icon: 'text-inmo-warning', bg: 'bg-inmo-warning/10 border-inmo-warning' };
        default: return { icon: 'text-inmo-accent', bg: 'bg-inmo-accent/10 border-inmo-accent' };
      }
    };
    const colors = getProcessingColors(config.type);
    
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
        <div className={`w-16 h-16 rounded-full ${colors.bg.split(' ')[0]} flex items-center justify-center mb-6`}>
          {config.type === 'muted' ? (
            <EyeOff className={`w-7 h-7 ${colors.icon} animate-pulse`} />
          ) : config.type === 'success' ? (
            <Eye className={`w-7 h-7 ${colors.icon} animate-pulse`} />
          ) : (
            <Loader2 className={`w-7 h-7 ${colors.icon} animate-spin`} />
          )}
        </div>
        
        <h3 className="font-montserrat font-bold text-[22px] text-inmo-secondary dark:text-white mb-2">
          {config.title}
        </h3>
        
        {config.steps && config.steps.length > 0 ? (
          <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mb-8 min-h-[20px] animate-pulse">
            {config.steps[currentStep]}
          </p>
        ) : (
          <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mb-8">
            {!config.hideCancel && 'Puedes cancelar esta acción mientras se procesa.'}
          </p>
        )}
        
        {!config.hideCancel && (
          <Button 
            variant="secondary" 
            className="w-full max-w-[200px] py-2.5 !rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-inmo-darkbg dark:hover:bg-white/10 dark:text-gray-300 border-none font-bold"
            onClick={handleCancelClick}
          >
            {cancelText}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={handleCancelClick} 
      />
      
      <div className="relative bg-white dark:bg-inmo-darkcard w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {isSuccess ? renderSuccessState() : isProcessing ? renderProcessingState() : (
          <div className="p-6 md:p-8 flex flex-col text-left">
            <h3 className="font-montserrat font-bold text-[22px] text-inmo-secondary dark:text-white mb-3">
              {title}
            </h3>
            
            <p className="font-inter text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 mb-8">
              {message}
            </p>
            
            <div className="flex flex-row w-full justify-end gap-3">
              <Button 
                variant="secondary" 
                className="px-6 py-2.5 !rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-inmo-darkbg dark:hover:bg-white/10 dark:text-gray-300 border-none font-bold"
                onClick={handleCancelClick}
              >
                {cancelText}
              </Button>
              <Button 
                variant={confirmVariant} 
                className="px-6 py-2.5 !rounded-full font-bold shadow-sm"
                onClick={handleConfirmClick}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Check } from 'lucide-react';

export interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  return (
    <div className={`w-full flex items-center justify-center gap-0 ${className}`}>
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={label}>
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2 min-w-[60px]">
              <div
                className={`w-9 h-9 rounded-atom flex items-center justify-center text-sm font-inter font-bold transition-all ${
                  isCompleted
                    ? 'bg-inmo-accent text-white shadow-glow'
                    : isCurrent
                      ? 'bg-inmo-accent text-white shadow-glow scale-110'
                      : 'bg-inmo-tertiary dark:bg-inmo-darktertiary text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" strokeWidth={3} />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-xs font-inter text-center leading-tight ${
                  isCompleted || isCurrent
                    ? 'font-bold text-inmo-secondary dark:text-white'
                    : 'font-normal text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={`flex-1 h-0.5 -mt-6 mx-1 rounded-atom transition-all ${
                  isCompleted
                    ? 'bg-inmo-accent'
                    : 'bg-inmo-tertiary dark:bg-inmo-darktertiary'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

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
  const renderItems = [];

  // Completed steps (merged into one)
  if (currentStep > 0) {
    renderItems.push({
      id: 'completed',
      type: 'completed',
      label: '',
      number: null,
    });
  }

  // Current step
  if (currentStep < steps.length) {
    renderItems.push({
      id: `current-${currentStep}`,
      type: 'current',
      label: steps[currentStep],
      number: currentStep + 1,
    });
  }

  // Remaining steps
  for (let i = currentStep + 1; i < steps.length; i++) {
    renderItems.push({
      id: `remaining-${i}`,
      type: 'remaining',
      label: '',
      number: i + 1,
    });
  }

  return (
    <div className={`w-full flex items-start justify-center gap-0 ${className}`}>
      {renderItems.map((item, index) => {
        const isLast = index === renderItems.length - 1;

        return (
          <React.Fragment key={item.id}>
            {/* Step circle + label */}
            <div className="flex flex-col items-center min-w-[40px] relative">
              <div
                className={`w-9 h-9 rounded-atom flex items-center justify-center text-sm font-inter font-bold transition-all duration-300 ${
                  item.type === 'completed'
                    ? 'bg-inmo-accent text-white shadow-glow'
                    : item.type === 'current'
                      ? 'bg-inmo-accent text-white shadow-glow scale-110'
                      : 'bg-inmo-tertiary dark:bg-inmo-darktertiary text-gray-400'
                }`}
              >
                {item.type === 'completed' ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : (
                  item.number
                )}
              </div>

              {/* Spacer for label height to maintain layout stability */}
              <div className="h-6 mt-2 relative w-full flex justify-center">
                {item.type === 'current' && item.label && (
                  <span className="text-xs font-inter font-bold text-inmo-secondary dark:text-white text-center leading-tight absolute whitespace-nowrap top-0">
                    {item.label}
                  </span>
                )}
              </div>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={`flex-1 h-[2px] mt-[17px] mx-2 rounded-full transition-all duration-300 ${
                  item.type === 'completed'
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

import React from 'react';
import { Button } from '../atoms/Button';
export interface PromoBannerProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  className?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
  className = ''
}) => {
  return (
    <div className={`col-span-full md:col-span-2 bg-inmo-accent rounded-[32px] p-6 sm:p-8 mt-4 shadow-glow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 animate-in slide-in-from-bottom-8 fade-in w-full ${className}`}>
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-banner-title font-montserrat text-white leading-tight">
          {title}
        </h3>
        <p className="text-banner-body font-inter text-white/90 leading-relaxed sm:pr-4">
          {description}
        </p>
      </div>
      <Button 
        onClick={onButtonClick}
        variant="secondary"
        className="!bg-white !text-inmo-accent self-start sm:self-center hover:scale-105 transition-transform shrink-0 !shadow-none px-8 py-3.5 text-base sm:text-lg w-full sm:w-auto"
      >
        {buttonText}
      </Button>
    </div>
  );
};

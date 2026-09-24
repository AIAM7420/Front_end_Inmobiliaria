import React from 'react';

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`flex flex-col items-center mb-8 ${className}`}>
      <h1 className="text-title text-center">{title}</h1>
      {subtitle && (
        <p className="text-body text-center mt-2 px-4 leading-relaxed">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
};

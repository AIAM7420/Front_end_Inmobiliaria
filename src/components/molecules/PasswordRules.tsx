import React from 'react';
import { Check, X } from 'lucide-react';

export interface PasswordRule {
  label: string;
  met: boolean;
}

export interface PasswordRulesProps {
  rules: PasswordRule[];
}

export const PasswordRules: React.FC<PasswordRulesProps> = ({ rules }) => {
  return (
    <div className="flex flex-col gap-2">
      {rules.map((rule) => (
        <div key={rule.label} className="flex items-center gap-2">
          {rule.met ? (
            <Check className="w-4 h-4 text-inmo-success shrink-0" strokeWidth={2} />
          ) : (
            <X className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={2} />
          )}
          <span
            className={`text-sm font-inter ${
              rule.met
                ? 'text-inmo-success'
                : 'text-gray-400'
            }`}
          >
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { Input } from '../atoms/Input';

export interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (val: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (onChange) {
      onChange(newOtp.join(''));
    }

    if (val !== '' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        if (onChange) {
          onChange(newOtp.join(''));
        }
      }
    }
  };

  return (
    <div className="flex justify-between gap-2 px-2 mt-2 w-full">
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[i]}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="!text-center !text-title !p-0"
          wrapperClassName="!w-12 !h-12 !min-w-[48px] !px-0 !gap-0 !rounded-xl !bg-white dark:!bg-inmo-darkcard !border border-gray-200 dark:border-inmo-darktertiary focus-within:!border-inmo-accent dark:focus-within:!border-inmo-accent !shadow-sm !ring-0 focus-within:!ring-0 dark:focus-within:!ring-0"
        />
      ))}
    </div>
  );
};

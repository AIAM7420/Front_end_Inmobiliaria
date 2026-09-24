import { Minus, Plus } from 'lucide-react';

export interface NumberFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

export function NumberField({ label, value, min = 0, max = 99, onChange }: NumberFieldProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center justify-between w-full py-2">
      <span className="text-base font-inter font-bold text-inmo-secondary dark:text-white">
        {label}
      </span>
      <div className="flex items-center space-x-3 bg-gray-50 dark:bg-inmo-darkbg border-2 border-gray-100 dark:border-inmo-darktertiary rounded-atom p-1.5 shadow-sm">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="p-2 rounded-atom text-inmo-secondary bg-white hover:bg-gray-100 disabled:opacity-50 dark:text-white dark:bg-inmo-darkcard dark:hover:bg-inmo-darkbg transition-all active:scale-95 shadow-sm"
        >
          <Minus className="w-4 h-4" strokeWidth={3} />
        </button>
        <span className="text-lg font-montserrat font-bold text-inmo-secondary dark:text-white min-w-[28px] text-center">
          {value}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="p-2 rounded-atom text-inmo-secondary bg-white hover:bg-gray-100 disabled:opacity-50 dark:text-white dark:bg-inmo-darkcard dark:hover:bg-inmo-darkbg transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

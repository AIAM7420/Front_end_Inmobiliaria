
export interface TagProps {
  label: string;
  variant?: 'outline' | 'solid';
  selected?: boolean;
  onClick?: () => void;
}

export function Tag({ label, variant = 'outline', selected = false, onClick }: TagProps) {
  const baseClasses = "px-4 py-1.5 rounded-atom text-sm font-inter font-bold transition-all duration-200 cursor-pointer inline-block active:scale-95 hover:-translate-y-0.5";
  
  let variantClasses = "";
  if (selected) {
    variantClasses = "bg-inmo-secondary text-white border-inmo-secondary shadow-sm dark:bg-white dark:text-inmo-secondary";
  } else if (variant === 'solid') {
    variantClasses = "bg-inmo-tertiary text-inmo-secondary border-transparent hover:bg-gray-300 dark:bg-inmo-darktertiary dark:text-white dark:hover:bg-gray-600";
  } else {
    variantClasses = "bg-transparent text-gray-500 border-2 border-inmo-tertiary hover:border-inmo-secondary hover:text-inmo-secondary dark:text-gray-400 dark:border-inmo-darktertiary dark:hover:border-white dark:hover:text-white";
  }

  return (
    <span onClick={onClick} className={`${baseClasses} ${variantClasses} ${onClick ? 'cursor-pointer' : 'cursor-default'}`}>
      {label}
    </span>
  );
}

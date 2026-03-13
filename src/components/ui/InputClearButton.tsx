import type { ButtonHTMLAttributes } from 'react';

import { X } from 'lucide-react';

import cn from '@/lib/utils';

type InputClearButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function InputClearButton({
  className,
  type = 'button',
  ...props
}: InputClearButtonProps) {
  return (
    <button
      aria-label="清除"
      type={type}
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-600 p-0 text-white',
        className,
      )}
      {...props}
    >
      <X className="h-3 w-3" strokeWidth={4} />
    </button>
  );
}

export default InputClearButton;

import { Plus } from 'lucide-react';

import cn from '@/lib/utils';

type FixedBottomButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
};

function FixedBottomButton({
  label,
  onClick,
  disabled = false,
  className,
  ref,
}: FixedBottomButtonProps) {
  return (
    <div
      ref={ref}
      className="fixed right-[max(20px,calc((100vw-800px)/2+20px))] bottom-6 z-10"
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'font-label-md inline-flex h-12 min-w-28.25 items-center justify-center gap-1 rounded-full border-2 border-neutral-50 bg-neutral-800 px-5 text-neutral-50',
          className,
        )}
      >
        {label} <Plus className="size-6" strokeWidth={1.5} />
      </button>
    </div>
  );
}

export default FixedBottomButton;

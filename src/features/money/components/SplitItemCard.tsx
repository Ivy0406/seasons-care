import { Check } from 'lucide-react';

import cn from '@/lib/utils';

type SplitItemCardProps = {
  title: string;
  amount: number;
  checked: boolean;
  readOnly?: boolean;
  onChange?: (checked: boolean) => void;
};

function SplitItemCard({
  title,
  amount,
  checked,
  readOnly = false,
  onChange,
}: SplitItemCardProps) {
  const content = (
    <div className="flex w-full items-center justify-between">
      <p className="font-paragraph-lg text-neutral-900">{title}</p>
      <p className="font-label-lg w-fit min-w-17 text-right text-neutral-900">
        $ {amount.toLocaleString()}
      </p>
    </div>
  );

  if (readOnly) {
    return (
      <div className="flex h-fit min-h-15.5 w-full items-center rounded-sm border-2 border-neutral-900 bg-neutral-100 px-7 py-4">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      className="flex h-fit min-h-15.5 w-full items-center justify-between gap-3 rounded-sm border-2 border-neutral-900 bg-neutral-100 px-7 py-4 text-left"
      onClick={() => onChange?.(!checked)}
    >
      <div
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full',
          checked ? 'bg-primary-default' : 'bg-neutral-400',
        )}
      >
        <Check className="size-2.5 text-white" strokeWidth={4.5} />
      </div>
      {content}
    </button>
  );
}

export default SplitItemCard;

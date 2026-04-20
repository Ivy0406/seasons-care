import { Plus } from 'lucide-react';

import cn from '@/lib/utils';

type CareLogEmptyStateProps = {
  message: string;
  onCreateEntry?: () => void;
  className?: string;
};

function CareLogEmptyState({
  message,
  onCreateEntry,
  className,
}: CareLogEmptyStateProps) {
  if (onCreateEntry) {
    return (
      <button
        type="button"
        onClick={onCreateEntry}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-5 rounded-md border border-neutral-300 bg-neutral-50 px-4 py-10 text-center text-neutral-700',
          className,
        )}
      >
        <p className="font-paragraph-md">{message}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-800 text-neutral-50">
          <Plus className="size-6" strokeWidth={2} />
        </span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        'rounded-md border border-neutral-300 bg-neutral-50 px-4 py-6 text-neutral-700',
        className,
      )}
    >
      <p className="font-paragraph-md">{message}</p>
    </div>
  );
}

export default CareLogEmptyState;

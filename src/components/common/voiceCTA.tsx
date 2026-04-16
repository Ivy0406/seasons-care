import { Sparkles, X } from 'lucide-react';

import cn from '@/lib/utils';

type VoiceCTAProps = {
  className?: string;
  title?: string;
  onClose: () => void;
  onInputClick: () => void;
};

export default function VoiceCTA({
  title,
  className,
  onClose,
  onInputClick,
}: VoiceCTAProps) {
  return (
    <div>
      <div className="flex justify-end px-4 pt-4 pb-3">
        <button
          type="button"
          aria-label={`關閉${title}`}
          className="inline-flex size-6 items-center justify-center rounded-full text-neutral-900"
          onClick={onClose}
        >
          <X className="size-4" strokeWidth={3} />
        </button>
      </div>

      <div
        className={cn(
          'bg-secondary-default border-y-2 border-neutral-900 px-4 py-3',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 shrink-0" strokeWidth={2.2} />
            <p className="font-label-md text-nowrap text-neutral-900">
              立即試用語音輸入{title}！
            </p>
          </div>
          <button
            type="button"
            className="font-label-md inline-flex h-10 w-20 items-center justify-center rounded-full bg-neutral-800 px-4 text-neutral-50"
            onClick={onInputClick}
          >
            輸入
          </button>
        </div>
      </div>
    </div>
  );
}

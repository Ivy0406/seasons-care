import type { ReactNode } from 'react';

import {
  NotebookText,
  ChartColumnIncreasing,
  Mic,
  PiggyBank,
  X,
} from 'lucide-react';

import BaseDrawer from '@/components/common/BaseDrawer';
import cn from '@/lib/utils';

type CreateEntryDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateDiary?: () => void;
  onCreateMoney?: () => void;
  onCreateHealth?: () => void;
  className?: string;
};

type ActionButtonProps = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  actionClassName?: string;
};

function ActionButton({
  label,
  icon,
  onClick,
  actionClassName,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-2.5 px-5 py-2 text-left text-neutral-900',
        actionClassName,
      )}
      onClick={(event) => {
        event.currentTarget.blur();
        onClick?.();
      }}
    >
      <span className="inline-flex size-10 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="font-paragraph-md">{label}</span>
    </button>
  );
}

function CreateEntryDrawer({
  open,
  onOpenChange,
  onCreateDiary,
  onCreateMoney,
  onCreateHealth,
  className,
}: CreateEntryDrawerProps) {
  return (
    <BaseDrawer
      open={open}
      onOpenChange={onOpenChange}
      className={cn('gat-3 px-6', className)}
    >
      <div className="flex flex-col gap-2 text-neutral-900">
        <div className="relative flex h-10 items-center justify-center">
          <button
            type="button"
            aria-label="關閉新增選單"
            className="absolute left-0 inline-flex size-10 items-center justify-center"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-8" strokeWidth={1.5} />
          </button>

          <p className="font-label-lg">建立</p>
        </div>

        <div className="divide-y divide-neutral-400 overflow-hidden rounded-l-lg bg-neutral-300">
          <ActionButton
            label="任務"
            icon={<NotebookText className="size-6" strokeWidth={2} />}
            onClick={onCreateDiary}
          />
          <ActionButton
            label="帳目"
            icon={<PiggyBank className="size-6" strokeWidth={2} />}
            onClick={onCreateMoney}
          />
          <ActionButton
            label="健康數據"
            icon={<ChartColumnIncreasing className="size-6" strokeWidth={2} />}
            onClick={onCreateHealth}
          />
          <ActionButton
            label="語音一鍵新增"
            actionClassName="text-primary-dark "
            icon={<Mic className="size-6" strokeWidth={2} />}
            onClick={onCreateHealth}
          />
        </div>
      </div>
    </BaseDrawer>
  );
}

export default CreateEntryDrawer;

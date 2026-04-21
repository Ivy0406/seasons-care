import { Pencil, Trash, X } from 'lucide-react';

import BaseDrawer from '@/components/common/BaseDrawer';
import cn from '@/lib/utils';

type UpdateDeleteDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  className?: string;
};

type DrawerActionButtonProps = {
  label: string;
  tone?: 'default' | 'danger';
  onClick?: () => void;
  icon: React.ReactNode;
  actionClassName?: string;
  labelClassName?: string;
};

function DrawerActionButton({
  actionClassName,
  labelClassName,
  label,
  tone = 'default',
  onClick,
  icon,
}: DrawerActionButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-5 px-6 py-7 text-left',
        tone === 'danger' ? 'text-error' : 'text-neutral-900',
        actionClassName,
      )}
      onClick={onClick}
    >
      <span className="shrink-0">{icon}</span>
      <span className={cn('font-heading-md', labelClassName)}>{label}</span>
    </button>
  );
}

function UpdateDeleteDrawer({
  open,
  onOpenChange,
  onEdit,
  onDelete,
  editLabel = '編輯',
  deleteLabel = '刪除',
  className,
}: UpdateDeleteDrawerProps) {
  return (
    <BaseDrawer
      open={open}
      onOpenChange={onOpenChange}
      className={cn('px-6', className)}
    >
      <div className="flex flex-col gap-2 text-neutral-900">
        <div className="flex items-center">
          <button
            type="button"
            aria-label="關閉操作選單"
            className="inline-flex size-10 items-center justify-center"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-8" strokeWidth={1.5} />
          </button>
        </div>

        <div className="font-paragraph-md overflow-hidden rounded-[8px] bg-neutral-300">
          <DrawerActionButton
            label={editLabel}
            actionClassName="py-3"
            labelClassName="font-paragraph-md"
            icon={<Pencil className="size-6" strokeWidth={2} />}
            onClick={() => {
              onOpenChange(false);
              onEdit?.();
            }}
          />
          <div className="d mx-0 border-t border-neutral-400" />
          <DrawerActionButton
            label={deleteLabel}
            actionClassName="py-3 border-b"
            labelClassName="font-paragraph-md"
            tone="danger"
            icon={<Trash className="size-6" strokeWidth={2} />}
            onClick={() => {
              onOpenChange(false);
              onDelete?.();
            }}
          />
        </div>
      </div>
    </BaseDrawer>
  );
}

export default UpdateDeleteDrawer;

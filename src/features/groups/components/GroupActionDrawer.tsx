import type { ReactNode } from 'react';

import { Pencil, SquareArrowRightExit, UserRoundCog, X } from 'lucide-react';

import BaseDrawer from '@/components/common/BaseDrawer';
import cn from '@/lib/utils';

type GroupActionDrawerProps = {
  open: boolean;
  groupName?: string;
  onOpenChange: (open: boolean) => void;
  onManageMembers?: () => void;
  onEditGroup?: () => void;
  onLeaveGroup?: () => void;
  className?: string;
};

type ActionButtonProps = {
  label: string;
  icon: ReactNode;
  tone?: 'default' | 'danger';
  onClick?: () => void;
  actionClassName?: string;
};

function ActionButton({
  label,
  icon,
  tone = 'default',
  onClick,
  actionClassName,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-2.5 px-5 py-2 text-left',
        tone === 'danger' ? 'text-error' : 'text-neutral-900',
        actionClassName,
      )}
      onClick={(event) => {
        event.currentTarget.blur();
        onClick?.();
      }}
    >
      <span className="inline-flex size-8 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="font-paragraph-md">{label}</span>
    </button>
  );
}

function GroupActionDrawer({
  open,
  groupName,
  onOpenChange,
  onManageMembers,
  onEditGroup,
  onLeaveGroup,
  className,
}: GroupActionDrawerProps) {
  return (
    <BaseDrawer
      open={open}
      onOpenChange={onOpenChange}
      className={cn('px-6', className)}
    >
      <div className="flex flex-col gap-2 text-neutral-900">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="關閉群組操作選單"
            className="inline-flex size-10 items-center justify-center"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-8" strokeWidth={1.5} />
          </button>
          {groupName ? (
            <p className="font-label-sm text-neutral-700">{groupName}</p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-[8px] bg-neutral-300">
          <ActionButton
            label="管理/新增成員"
            icon={<UserRoundCog className="size-6" strokeWidth={2} />}
            onClick={onManageMembers}
          />
          <div className="border-t border-neutral-400" />
          <ActionButton
            label="編輯群組"
            icon={<Pencil className="size-6" strokeWidth={2} />}
            onClick={onEditGroup}
          />
          <div className="border-t border-neutral-400" />
          <ActionButton
            label="退出群組"
            tone="danger"
            icon={<SquareArrowRightExit className="size-6" strokeWidth={2} />}
            onClick={onLeaveGroup}
          />
        </div>
      </div>
    </BaseDrawer>
  );
}

export default GroupActionDrawer;

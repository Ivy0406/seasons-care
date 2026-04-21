import { Bell, ChevronDown, ChevronLeft, Menu, Plus } from 'lucide-react';

import notificationBellBadge from '@/assets/icons/notification-bell-badge.svg';
import cn from '@/lib/utils';

type NavigationTitleProps = {
  children: React.ReactNode;
  className?: string;
};

type NavigationActionButtonProps = {
  onClick?: () => void;
  className?: string;
};

type GroupSwitcherProps = {
  groupName: string;
  onBackClick?: () => void;
  onOpenClick?: () => void;
  className?: string;
};

type NavigationSubheaderProps = {
  title: string;
  onBackClick?: () => void;
  className?: string;
};

type NavigationTopActionsProps = {
  hasNotification?: boolean;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
};

type NavigationMenuButtonProps = {
  onClick?: () => void;
  className?: string;
};

type NavigationHeaderRowProps = {
  title: React.ReactNode;
  className?: string;
};

function NavigationTitle({ children, className }: NavigationTitleProps) {
  return (
    <h2 className={cn('font-heading-lg text-neutral-900', className)}>
      {children}
    </h2>
  );
}

function NavigationActionButton({
  onClick,
  className,
}: NavigationActionButtonProps) {
  return (
    <button
      type="button"
      aria-label="新增"
      onClick={onClick}
      className={cn(
        'inline-flex size-10 items-center justify-center bg-transparent text-neutral-900',
        className,
      )}
    >
      <Plus className="size-8" strokeWidth={2} />
    </button>
  );
}

function NavigationMenuButton({
  onClick,
  className,
}: NavigationMenuButtonProps) {
  return (
    <button
      type="button"
      aria-label="開啟選單"
      onClick={onClick}
      className={cn(
        'inline-flex size-10 items-center justify-center bg-transparent text-black',
        className,
      )}
    >
      <Menu className="size-8" strokeWidth={2} />
    </button>
  );
}

function GroupSwitcher({
  groupName,
  onBackClick,
  onOpenClick,
  className,
}: GroupSwitcherProps) {
  return (
    <div className={cn('flex items-center gap-1 py-3', className)}>
      <button
        type="button"
        aria-label="返回"
        onClick={onBackClick}
        className="inline-flex size-10 items-center justify-center bg-transparent text-neutral-900"
      >
        <ChevronLeft className="size-8" strokeWidth={2} />
      </button>
      <button
        type="button"
        aria-label={`切換群組，目前為${groupName}`}
        onClick={onOpenClick}
        className="inline-flex min-w-0 items-center gap-1 text-left text-neutral-900"
      >
        <span className="font-heading-sm truncate">{groupName}</span>
        <ChevronDown
          className="size-6 shrink-0 text-neutral-900"
          strokeWidth={2}
        />
      </button>
    </div>
  );
}

function NavigationSubheader({
  title,
  onBackClick,
  className,
}: NavigationSubheaderProps) {
  return (
    <div className={cn('flex items-center gap-4 py-5', className)}>
      <div className="relative flex min-w-0 flex-1 items-center justify-center">
        <button
          type="button"
          aria-label="返回上一層"
          onClick={onBackClick}
          className="absolute left-0 flex size-10 items-center justify-center bg-transparent text-neutral-50"
        >
          <ChevronLeft className="size-8" strokeWidth={2} />
        </button>
        <h2 className="font-heading-sm truncate text-neutral-50">{title}</h2>
      </div>
    </div>
  );
}

function NavigationTopActions({
  hasNotification = false,
  onNotificationClick,
  onMenuClick,
  className,
}: NavigationTopActionsProps) {
  return (
    <div className={cn('flex justify-end gap-5 py-3', className)}>
      <button
        type="button"
        aria-label={hasNotification ? '查看通知，有未讀項目' : '查看通知'}
        onClick={onNotificationClick}
        className="inline-flex size-10 items-center justify-center bg-transparent text-neutral-900"
      >
        {hasNotification ? (
          <img
            src={notificationBellBadge}
            alt=""
            aria-hidden="true"
            className="size-8"
          />
        ) : (
          <Bell className="size-8" strokeWidth={2} />
        )}
      </button>
      <NavigationMenuButton onClick={onMenuClick} />
    </div>
  );
}

function NavigationHeaderRow({ title, className }: NavigationHeaderRowProps) {
  return (
    <div
      className={cn(
        'text-heading-lg flex items-center justify-between gap-4 py-3.75',
        className,
      )}
    >
      <NavigationTitle>{title}</NavigationTitle>
    </div>
  );
}

export {
  GroupSwitcher,
  NavigationActionButton,
  NavigationHeaderRow,
  NavigationMenuButton,
  NavigationSubheader,
  NavigationTopActions,
  NavigationTitle,
};

import { Bell, ChevronDown, ChevronLeft, Menu, Plus } from 'lucide-react';
import { Link } from 'react-router';

import notificationBellBadge from '@/assets/icons/notification-bell-badge.svg';
import brandMark from '@/assets/icons/seasons-care-icon.svg';
import useCurrentDateLabel from '@/features/navigationbar/hooks/useCurrentDateLabel';
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
  const dateLabel = useCurrentDateLabel();

  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_auto_1fr] items-center py-3',
        className,
      )}
    >
      <div className="flex w-22.75 items-center justify-center gap-1 rounded-sm border-2 border-neutral-900 py-3">
        <p className="font-label-md">{dateLabel.day}</p>
        <p className="font-label-sm">{dateLabel.weekday}</p>
      </div>
      <Link
        to="/homepage"
        aria-label="回到首頁"
        className="justify-self-center"
      >
        <img src={brandMark} alt="Seasons Care" className="h-6 w-auto" />
      </Link>
      <div className="flex items-center gap-5 justify-self-end">
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

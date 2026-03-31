import { Bell, ChevronDown } from 'lucide-react';

import notificationBellBadge from '@/assets/icons/notification-bell-badge.svg';
import { NavigationMenuButton } from '@/components/common/NavigationBar';
import cn from '@/lib/utils';

type HomepageGroupNavigationBarProps = {
  groupName: string;
  hasNotification?: boolean;
  onGroupClick?: () => void;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
};

function HomepageGroupNavigationBar({
  groupName,
  hasNotification = false,
  onGroupClick,
  onNotificationClick,
  onMenuClick,
  className,
}: HomepageGroupNavigationBarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-3 text-neutral-900',
        className,
      )}
    >
      <button
        type="button"
        aria-label={`切換群組，目前為${groupName}`}
        onClick={onGroupClick}
        className="inline-flex min-w-0 items-center gap-2 text-left"
      >
        <span className="font-heading-sm truncate">{groupName}</span>
        <ChevronDown className="size-6 shrink-0" strokeWidth={2} />
      </button>

      <div className="flex items-center gap-5">
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

export default HomepageGroupNavigationBar;

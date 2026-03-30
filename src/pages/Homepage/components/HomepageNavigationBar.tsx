import { Bell } from 'lucide-react';
import { Link } from 'react-router';

import notificationBellBadge from '@/assets/icons/notification-bell-badge.svg';
import brandMark from '@/assets/icons/seasons-care-icon.svg';
import { NavigationMenuButton } from '@/components/common/NavigationBar';
import cn from '@/lib/utils';

import useCurrentDateLabel from '../hooks/useCurrentDateLabel';

type HomepageNavigationBarProps = {
  hasNotification?: boolean;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
};

function HomepageNavigationBar({
  hasNotification = false,
  onNotificationClick,
  onMenuClick,
  className,
}: HomepageNavigationBarProps) {
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

export default HomepageNavigationBar;

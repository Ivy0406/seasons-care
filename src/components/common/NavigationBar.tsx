import { useEffect, useState } from 'react';

import { Bell, ChevronDown, ChevronLeft, Menu } from 'lucide-react';
import { Link } from 'react-router';

import notificationBellBadge from '@/assets/icons/notification-bell-badge.svg';
import BrandMark from '@/components/common/BrandMark';
import cn from '@/lib/utils';

type NavigationTitleProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'span';
};

type NavigationSubheaderProps = {
  title: string;
  onBackClick?: () => void;
  layout?: 'inline' | 'centered';
  showChevron?: boolean;
  titleClassName?: string;
  iconClassName?: string;
  className?: string;
};

type NavigationMenuButtonProps = {
  onClick?: () => void;
  className?: string;
};

type NavigationNotificationButtonProps = {
  hasNotification?: boolean;
  onClick?: () => void;
  className?: string;
};

type HomepageNavigationBarProps = {
  hasNotification?: boolean;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
  selectedDate?: Date;
  onDateClick?: () => void;
  className?: string;
};

type PageNavigationBarProps = {
  title?: string;
  onMenuClick?: () => void;
  titleClassName?: string;
  className?: string;
  showTitle?: boolean;
  showMenuButton?: boolean;
  centerBrandLinkToHomepage?: boolean;
};

type HomepageGroupNavigationBarProps = {
  groupName: string;
  hasNotification?: boolean;
  onGroupClick?: () => void;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
};

type NavigationGroupTriggerProps = {
  groupName: string;
  onClick?: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  showChevron?: boolean;
  titleClassName?: string;
  iconClassName?: string;
  className?: string;
};

type NavigationActionGroupProps = {
  hasNotification?: boolean;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
};

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const;
const navigationTitleClass = 'font-heading-lg text-neutral-900';

function createDateLabel(date: Date) {
  return {
    day: `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`,
    weekday: `(${WEEKDAY_LABELS[date.getDay()]})`,
  };
}

function useCurrentDateLabel() {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextRefresh = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );

      timeoutId = setTimeout(() => {
        setCurrentDate(new Date());
        scheduleNextRefresh();
      }, nextMidnight.getTime() - now.getTime());
    };

    scheduleNextRefresh();

    return () => clearTimeout(timeoutId);
  }, []);

  return createDateLabel(currentDate);
}

function NavigationTitle({
  children,
  className,
  as: Component = 'h2',
}: NavigationTitleProps) {
  return (
    <Component className={cn(navigationTitleClass, className)}>
      {children}
    </Component>
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
        'inline-flex size-8 items-center justify-center bg-transparent text-black',
        className,
      )}
    >
      <Menu className="size-8" strokeWidth={1.5} />
    </button>
  );
}

function NavigationNotificationButton({
  hasNotification = false,
  onClick,
  className,
}: NavigationNotificationButtonProps) {
  return (
    <button
      type="button"
      aria-label={hasNotification ? '查看通知，有未讀項目' : '查看通知'}
      onClick={onClick}
      className={cn(
        'inline-flex size-8 items-center justify-center bg-transparent text-neutral-900',
        className,
      )}
    >
      {hasNotification ? (
        <img
          src={notificationBellBadge}
          alt=""
          aria-hidden="true"
          className="size-6"
        />
      ) : (
        <Bell className="size-6" strokeWidth={1.5} />
      )}
    </button>
  );
}

function NavigationActionGroup({
  hasNotification = false,
  onNotificationClick,
  onMenuClick,
  className,
}: NavigationActionGroupProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <NavigationNotificationButton
        hasNotification={hasNotification}
        onClick={onNotificationClick}
      />
      <NavigationMenuButton onClick={onMenuClick} />
    </div>
  );
}

function NavigationGroupTrigger({
  groupName,
  onClick,
  onBackClick,
  showBackButton = false,
  showChevron = true,
  titleClassName,
  iconClassName,
  className,
}: NavigationGroupTriggerProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {showBackButton ? (
        <button
          type="button"
          aria-label="返回"
          onClick={onBackClick}
          className="inline-flex size-10 items-center justify-center bg-transparent text-neutral-900"
        >
          <ChevronLeft
            className={cn('size-8', iconClassName)}
            strokeWidth={1.5}
          />
        </button>
      ) : null}
      <button
        type="button"
        onClick={onClick}
        aria-label={`切換群組，目前為${groupName}`}
        className="inline-flex min-w-0 items-center gap-2 py-2 text-left text-neutral-900"
      >
        <NavigationTitle as="span" className={cn('truncate', titleClassName)}>
          {groupName}
        </NavigationTitle>
        {showChevron ? (
          <ChevronDown
            className={cn('size-6 shrink-0', iconClassName)}
            strokeWidth={2}
          />
        ) : null}
      </button>
    </div>
  );
}

type NavigationDateBadgeProps = {
  selectedDate?: Date;
  onClick?: () => void;
};

function NavigationDateBadge({
  selectedDate,
  onClick,
}: NavigationDateBadgeProps) {
  const currentDateLabel = useCurrentDateLabel();
  const dateLabel = selectedDate
    ? createDateLabel(selectedDate)
    : currentDateLabel;
  const WrapperTag = onClick ? 'button' : 'div';

  return (
    <WrapperTag
      {...(onClick
        ? {
            type: 'button' as const,
            onClick,
            'aria-label': `選擇日期，目前為${dateLabel.day}${dateLabel.weekday}`,
          }
        : {})}
      className="text-primary-dark inline-flex items-center gap-0.5 justify-self-start rounded-sm py-3"
    >
      <p className="font-label-lg">{dateLabel.day}</p>
      <p className="font-label-md">{dateLabel.weekday}</p>
    </WrapperTag>
  );
}

function HomepageNavigationBar({
  hasNotification = false,
  onNotificationClick,
  onMenuClick,
  selectedDate,
  onDateClick,
  className,
}: HomepageNavigationBarProps) {
  return (
    <div className="border-b-2 border-neutral-900">
      <div
        className={cn(
          'grid grid-cols-[1fr_auto_1fr] items-center pt-2 pb-5',
          className,
        )}
      >
        <NavigationDateBadge
          selectedDate={selectedDate}
          onClick={onDateClick}
        />
        <Link
          to="/homepage"
          aria-label="回到首頁"
          className="justify-self-center"
        >
          <BrandMark className="h-8.25 w-auto" />
        </Link>
        <NavigationActionGroup
          hasNotification={hasNotification}
          onNotificationClick={onNotificationClick}
          onMenuClick={onMenuClick}
          className="justify-self-end"
        />
      </div>
    </div>
  );
}

function PageNavigationBar({
  title = '',
  onMenuClick,
  titleClassName,
  className,
  showTitle = true,
  showMenuButton = true,
  centerBrandLinkToHomepage = true,
}: PageNavigationBarProps) {
  return (
    <div className="border-b-2 border-neutral-900">
      <div
        className={cn(
          'grid grid-cols-[1fr_auto_1fr] items-center pt-2 pb-5',
          className,
        )}
      >
        {showTitle ? (
          <NavigationTitle
            as="span"
            className={cn('font-label-lg justify-self-start', titleClassName)}
          >
            {title}
          </NavigationTitle>
        ) : (
          <div />
        )}
        {centerBrandLinkToHomepage ? (
          <Link
            to="/homepage"
            aria-label="回到首頁"
            className="justify-self-center"
          >
            <BrandMark className="h-8.25 w-auto" />
          </Link>
        ) : (
          <div className="justify-self-center">
            <BrandMark className="h-8.25 w-auto" />
          </div>
        )}
        {showMenuButton ? (
          <NavigationMenuButton
            onClick={onMenuClick}
            className="justify-self-end"
          />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

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
        'flex items-center justify-between border-b-2 border-neutral-900 pt-2 pb-5 text-neutral-900',
        className,
      )}
    >
      <NavigationGroupTrigger
        groupName={groupName}
        onClick={onGroupClick}
        titleClassName="font-heading-sm truncate"
        className="min-w-0 flex-1"
      />

      <NavigationActionGroup
        hasNotification={hasNotification}
        onNotificationClick={onNotificationClick}
        onMenuClick={onMenuClick}
        className="shrink-0"
      />
    </div>
  );
}

function NavigationSubheader({
  title,
  onBackClick,
  layout = 'inline',
  showChevron = true,
  titleClassName,
  iconClassName,
  className,
}: NavigationSubheaderProps) {
  if (layout === 'centered') {
    return (
      <div
        className={cn(
          'grid grid-cols-[1fr_auto_1fr] items-center pt-3 pb-6',
          className,
        )}
      >
        <button
          type="button"
          aria-label="返回"
          onClick={onBackClick}
          className="inline-flex size-10 items-center justify-center justify-self-start bg-transparent text-neutral-900"
        >
          <ChevronLeft
            className={cn('size-8', iconClassName)}
            strokeWidth={1.5}
          />
        </button>
        <NavigationTitle
          as="span"
          className={cn('font-heading-sm justify-self-center', titleClassName)}
        >
          {title}
        </NavigationTitle>
        {showChevron ? (
          <ChevronDown
            className={cn('size-6 shrink-0 justify-self-end', iconClassName)}
            strokeWidth={2}
          />
        ) : (
          <div />
        )}
      </div>
    );
  }

  return (
    <NavigationGroupTrigger
      groupName={title}
      onBackClick={onBackClick}
      showBackButton
      showChevron={showChevron}
      titleClassName={cn('font-heading-sm', titleClassName)}
      iconClassName={iconClassName}
      className={cn('pt-3 pb-6', className)}
    />
  );
}
function RecordingResultHeader() {
  return (
    <NavigationSubheader
      className="bg-neutral-800"
      layout="centered"
      title="錄製結果"
      titleClassName="text-neutral-50"
      iconClassName="text-neutral-50"
      showChevron={false}
    />
  );
}

export {
  HomepageGroupNavigationBar,
  HomepageNavigationBar,
  PageNavigationBar,
  NavigationGroupTrigger,
  NavigationMenuButton,
  NavigationNotificationButton,
  NavigationSubheader,
  NavigationTitle,
  RecordingResultHeader,
};

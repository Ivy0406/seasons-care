import { ChevronRight } from 'lucide-react';

import cn from '@/lib/utils';

type NotificationBarProps = {
  icon: React.ReactNode;
  iconClassName?: string;
  eventType?: string;
  title: string;
  time?: string;
  showChevron?: boolean;
  onClick?: () => void;
};

function NotificationBar({
  icon,
  iconClassName,
  eventType,
  title,
  time,
  showChevron = true,
  onClick,
}: NotificationBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 py-2 text-neutral-900"
    >
      <span
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-800 text-neutral-50 [&_svg]:size-6 [&_svg]:stroke-[1.5]',
          iconClassName,
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="flex flex-1 flex-col text-left">
        {eventType ? <p className="font-paragraph-md">{eventType}</p> : null}
        <div className="flex gap-1">
          {time ? <p className="font-paragraph-sm">{time}</p> : null}
          <p className="font-paragraph-sm">{title}</p>
        </div>
      </div>
      {showChevron ? (
        <div className="flex aspect-square w-10 items-center justify-center">
          <ChevronRight className="size-8" />
        </div>
      ) : null}
    </button>
  );
}

export default NotificationBar;

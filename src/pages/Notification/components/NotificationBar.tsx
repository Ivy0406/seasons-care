import { ChevronRight } from 'lucide-react';

import { CircleButtonPrimary } from '@/components/common/CircleIButton';

type NotificationBarProps = {
  icon: React.ReactNode;
  eventType: string;
  title: string;
  time: string;
  onClick?: () => void;
};

function NotificationBar({
  icon,
  eventType,
  title,
  time,
  onClick,
}: NotificationBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 text-neutral-900"
    >
      <CircleButtonPrimary>{icon}</CircleButtonPrimary>
      <div className="flex flex-1 flex-col text-left">
        <p className="font-paragraph-md">{eventType}</p>
        <div className="flex gap-1">
          <p className="font-paragraph-sm">{time}</p>
          <p className="font-paragraph-sm">{title}</p>
        </div>
      </div>
      <div className="flex aspect-square w-10 items-center justify-center">
        <ChevronRight className="size-8" />
      </div>
    </button>
  );
}

export default NotificationBar;

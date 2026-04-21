import { useEffect, useState } from 'react';

import { format, parseISO } from 'date-fns';
import { Check, EllipsisVertical } from 'lucide-react';

import { CheckBoxButton } from '@/components/common/CircleIButton';
import SingleAvatar from '@/components/common/SingleAvatar';
import cn from '@/lib/utils';

export type CalendarDiaryCardParticipant = {
  id: string;
  name: string;
  src: string;
};

export type DiaryCardStatus = 'pending' | 'completed';

export type DiaryCardItem = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  updatedAt?: string;
  repeatPattern?: 'none' | 'daily' | 'weeklyDay' | 'monthly';
  participants: CalendarDiaryCardParticipant[];
  status: DiaryCardStatus;
  isImportant?: boolean;
};

type DiaryCardProps = {
  item: DiaryCardItem;
  className?: string;
  onClick?: () => void;
  onMoreClick?: () => void;
  onStatusChange?: (checked: boolean) => Promise<boolean> | boolean;
  isStatusUpdating?: boolean;
};

function DiaryCardContent({
  item,
  isChecked,
  onCheckedChange,
  onMoreClick,
  isStatusUpdating = false,
}: {
  item: DiaryCardItem;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onMoreClick?: () => void;
  isStatusUpdating?: boolean;
}) {
  const startTime = parseISO(item.startsAt);
  const displayTime = format(startTime, 'HH:mm');
  const isNotStarted =
    item.status !== 'completed' && startTime.getTime() > Date.now();

  const getDotColor = () => {
    if (isChecked) return 'bg-primary-default';
    if (isNotStarted) return 'bg-neutral-500';
    return 'bg-neutral-800';
  };

  return (
    <>
      <div className="flex w-full items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2 text-neutral-900">
            <span className={cn('size-3 rounded-full', getDotColor())} />
            <p className="font-label-lg">{displayTime}</p>
          </div>
          <div className="pl-4.5">
            <h2 className="font-heading-sm">{item.title}</h2>
            <p className="font-paragraph-sm mt-3 text-neutral-700">
              {item.description}
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="更多選項"
          className="ml-7.75 inline-flex size-6 items-center justify-center rounded-full bg-transparent text-neutral-900"
          onClick={(event) => {
            event.stopPropagation();
            onMoreClick?.();
          }}
        >
          <EllipsisVertical className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 pl-4.5">
        <div className="flex items-center gap-2">
          {item.participants.map((participant) => (
            <SingleAvatar
              key={participant.id}
              src={participant.src}
              name={participant.name}
              className="size-7.5 ring-2"
            />
          ))}
        </div>
        <CheckBoxButton
          size="md"
          checked={isChecked}
          onCheckedChange={onCheckedChange}
          onClick={(event) => event.stopPropagation()}
          disabled={isStatusUpdating}
          aria-label={`標記${item.title}完成`}
          checkedClassName="bg-neutral-900 text-neutral-50  "
          uncheckedClassName="border-2 border-neutral-900 bg-neutral-50 text-neutral-900"
        >
          <Check />
        </CheckBoxButton>
      </div>
    </>
  );
}

function DiaryCard({
  item,
  className,
  onClick,
  onMoreClick,
  onStatusChange,
  isStatusUpdating = false,
}: DiaryCardProps) {
  const [isChecked, setIsChecked] = useState(item.status === 'completed');

  useEffect(() => {
    setIsChecked(item.status === 'completed');
  }, [item.status]);

  const handleCheckedChange = async (checked: boolean) => {
    setIsChecked(checked);

    const didUpdate = await onStatusChange?.(checked);

    if (didUpdate === false) {
      setIsChecked(item.status === 'completed');
    }
  };

  const sharedClassName = cn(
    'flex w-full flex-col gap-5 border-l-2 border-neutral-900 bg-neutral-100 py-1 pr-4 pl-3 text-neutral-900 text-left',
    className,
  );

  if (onClick) {
    return (
      <div
        className={cn(
          sharedClassName,
          'cursor-pointer transition-colors active:bg-neutral-200',
        )}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
          }
        }}
      >
        <DiaryCardContent
          item={item}
          isChecked={isChecked}
          onCheckedChange={handleCheckedChange}
          onMoreClick={onMoreClick}
          isStatusUpdating={isStatusUpdating}
        />
      </div>
    );
  }

  return (
    <div className={sharedClassName}>
      <DiaryCardContent
        item={item}
        isChecked={isChecked}
        onCheckedChange={handleCheckedChange}
        onMoreClick={onMoreClick}
        isStatusUpdating={isStatusUpdating}
      />
    </div>
  );
}

export default DiaryCard;

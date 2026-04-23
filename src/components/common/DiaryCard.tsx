import { useEffect, useState } from 'react';

import { format, parseISO } from 'date-fns';
import { EllipsisVertical, Repeat } from 'lucide-react';

import { CardLabelPrimary } from '@/components/common/CardLabel';
import SingleAvatar from '@/components/common/SingleAvatar';
import cn from '@/lib/utils';

import { RoundedButtonPrimary, RoundedButtonSecondary } from './RoundedButtons';

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
  sourceType?: 'care-log' | 'event-series';
  sourceId?: string;
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
  onCheckedChange?: (checked: boolean) => void;
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
            {item.isImportant ? (
              <CardLabelPrimary>重要任務</CardLabelPrimary>
            ) : null}
          </div>
          <div className="pl-4.5">
            <div className="flex items-center gap-3">
              <h2 className="font-heading-sm">{item.title}</h2>
              {item.sourceType === 'event-series' ? (
                <Repeat
                  className="size-5 shrink-0 text-neutral-500"
                  strokeWidth={1.5}
                />
              ) : null}
            </div>
            <p className="font-paragraph-sm mt-3 text-neutral-700">
              {item.description}
            </p>
          </div>
        </div>
        {onMoreClick ? (
          <button
            type="button"
            aria-label="更多選項"
            className="ml-7.75 inline-flex size-6 items-center justify-center rounded-full bg-transparent text-neutral-900"
            onClick={(event) => {
              event.stopPropagation();
              onMoreClick();
            }}
          >
            <EllipsisVertical className="size-4" strokeWidth={1.5} />
          </button>
        ) : null}
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
      </div>
      {isChecked ? (
        <RoundedButtonPrimary
          onClick={(e) => {
            e.stopPropagation();
            onCheckedChange?.(false);
          }}
          disabled={isStatusUpdating || onCheckedChange === undefined}
          className="border-2 border-neutral-200 bg-neutral-200 text-neutral-900"
        >
          已完成
        </RoundedButtonPrimary>
      ) : (
        <RoundedButtonSecondary
          onClick={(e) => {
            e.stopPropagation();
            onCheckedChange?.(true);
          }}
          disabled={isStatusUpdating || onCheckedChange === undefined}
          className="border-2 border-neutral-900 bg-neutral-800 text-neutral-50"
        >
          標示為完成
        </RoundedButtonSecondary>
      )}
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
    if (!onStatusChange) return;

    setIsChecked(checked);

    const didUpdate = await onStatusChange(checked);

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

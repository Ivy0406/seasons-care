import type { ComponentProps } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type MonthCaptionProps, UI, useDayPicker } from 'react-day-picker';

import getAvatarSrcByKey from '@/assets/images/avatars';
import SingleAvatar from '@/components/common/SingleAvatar';
import UserGroup from '@/components/common/UserGroup';
import BaseCalendar from '@/components/ui/calendar';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import cn from '@/lib/utils';

type CalendarProps = ComponentProps<typeof BaseCalendar>;

function CalendarMonthCaption({
  calendarMonth,
  className,
  displayIndex,
  children,
  ...props
}: MonthCaptionProps) {
  const { classNames, goToMonth, labels, months, nextMonth, previousMonth } =
    useDayPicker();
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId);

  const showPreviousButton = displayIndex === 0;
  const showNextButton = displayIndex === months.length - 1;
  const captionLabel =
    children ??
    `${calendarMonth.date.getFullYear()}.${String(calendarMonth.date.getMonth() + 1).padStart(2, '0')}`;
  const avatarSlot = (
    <UserGroup className="w-full max-w-25 min-w-0">
      {groupMembers.map((member) => (
        <SingleAvatar
          key={member.userId}
          src={getAvatarSrcByKey(member.avatarKey)}
          name={member.username}
          className="size-7 bg-neutral-300 ring-1 ring-neutral-800"
        />
      ))}
    </UserGroup>
  );

  return (
    <div
      className={cn(
        className,
        'grid w-full grid-cols-[max-content_1fr_max-content] items-center justify-stretch text-neutral-900',
      )}
      {...props}
    >
      <div className="invisible">{avatarSlot}</div>

      <div className="col-start-2 justify-self-center">
        <div className="flex items-center justify-center gap-1">
          {showPreviousButton ? (
            <button
              type="button"
              aria-label={labels.labelPrevious(previousMonth)}
              disabled={!previousMonth}
              onClick={() => {
                if (previousMonth) goToMonth(previousMonth);
              }}
              className={classNames[UI.PreviousMonthButton]}
            >
              <ChevronLeft className="size-2" strokeWidth={5} />
            </button>
          ) : (
            <span className="size-4" aria-hidden="true" />
          )}

          <div className={classNames[UI.CaptionLabel]}>{captionLabel}</div>

          {showNextButton ? (
            <button
              type="button"
              aria-label={labels.labelNext(nextMonth)}
              disabled={!nextMonth}
              onClick={() => {
                if (nextMonth) goToMonth(nextMonth);
              }}
              className={classNames[UI.NextMonthButton]}
            >
              <ChevronRight className="size-2" strokeWidth={5} />
            </button>
          ) : (
            <span className="size-4" aria-hidden="true" />
          )}
        </div>
      </div>

      <div className="col-start-3 justify-self-end">{avatarSlot}</div>
    </div>
  );
}

function Calendar({ components, ...props }: CalendarProps) {
  return (
    <BaseCalendar
      components={{
        MonthCaption: CalendarMonthCaption,
        ...components,
      }}
      {...props}
    />
  );
}

export default Calendar;

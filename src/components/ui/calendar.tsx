import { isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DayPicker,
  type DayButtonProps,
  type DayPickerProps,
  type MonthCaptionProps,
  getDefaultClassNames,
  UI,
  useDayPicker,
} from 'react-day-picker';

import cn from '@/lib/utils';

type CalendarProps = DayPickerProps & {
  markedDates?: Date[];
};

function CalendarDayButton({
  className,
  day,
  modifiers,
  children,
  ...props
}: DayButtonProps) {
  const hasEntry = Boolean(modifiers.hasEntry && !modifiers.outside);

  return (
    <button
      type="button"
      className={cn(
        'font-paragraph-md relative flex size-10 items-center justify-center rounded-full transition-colors',
        modifiers.outside && 'text-neutral-600/50',
        modifiers.today &&
          !modifiers.selected &&
          'font-semibold text-neutral-900',
        modifiers.selected && 'bg-neutral-900 text-neutral-50',
        !modifiers.selected &&
          !modifiers.outside &&
          'text-neutral-800 hover:bg-neutral-50/70',
        className,
      )}
      {...props}
    >
      <span className="leading-none">{children ?? day.date.getDate()}</span>
      {hasEntry ? (
        <span
          aria-hidden="true"
          className={cn(
            'absolute bottom-1 size-1 rounded-full',
            modifiers.selected ? 'bg-neutral-900' : 'bg-neutral-900',
          )}
        />
      ) : null}
    </button>
  );
}

function CalendarChevron({
  orientation,
  className,
}: {
  orientation?: string;
  className?: string;
}) {
  return orientation === 'left' ? (
    <ChevronLeft className={cn('size-2', className)} strokeWidth={5} />
  ) : (
    <ChevronRight className={cn('size-2', className)} strokeWidth={5} />
  );
}

function CalendarMonthCaption({
  calendarMonth,
  className,
  displayIndex,
  children,
  ...props
}: MonthCaptionProps) {
  const { classNames, goToMonth, labels, months, nextMonth, previousMonth } =
    useDayPicker();

  const showPreviousButton = displayIndex === 0;
  const showNextButton = displayIndex === months.length - 1;
  const captionLabel =
    children ??
    `${calendarMonth.date.getFullYear()}.${String(calendarMonth.date.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    >
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
          <CalendarChevron orientation="left" />
        </button>
      ) : (
        <span className="size-8" aria-hidden="true" />
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
          <CalendarChevron orientation="right" />
        </button>
      ) : (
        <span className="size-8" aria-hidden="true" />
      )}
    </div>
  );
}

function Calendar({
  className,
  classNames,
  components,
  formatters,
  markedDates = [],
  modifiers,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      hideNavigation
      showOutsideDays={showOutsideDays}
      weekStartsOn={0}
      formatters={{
        formatWeekdayName: (date) => {
          const weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

          return weekdayLabels[date.getDay()];
        },
        ...formatters,
      }}
      modifiers={{
        hasEntry: (date) =>
          markedDates.some((markedDate) => isSameDay(markedDate, date)),
        ...modifiers,
      }}
      className={cn('w-full', className)}
      classNames={{
        ...defaultClassNames,
        [UI.Root]: 'w-full',
        [UI.Months]: 'w-full',
        [UI.Month]: 'flex w-full flex-col gap-5',
        [UI.MonthCaption]: 'flex  items-center justify-center text-neutral-900',
        [UI.CaptionLabel]:
          'font-paragraph-md border-b-1 border-neutral-900 pb-1 tracking-[0.01em]',
        [UI.PreviousMonthButton]:
          'inline-flex size-4  items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-50/80',
        [UI.NextMonthButton]:
          'inline-flex size-4  items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-50/80',
        [UI.MonthGrid]: 'w-full',
        [UI.Weekdays]: 'grid grid-cols-7',
        [UI.Weekday]: 'font-paragraph-md flex items-center justify-center',
        [UI.Week]: 'mt-2 grid grid-cols-7',
        [UI.Day]: 'flex  items-center justify-center p-0',
        [UI.DayButton]: 'size-9',
        ...classNames,
      }}
      components={{
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        MonthCaption: CalendarMonthCaption,
        ...components,
      }}
      {...props}
    />
  );
}

export { Calendar };
export default Calendar;

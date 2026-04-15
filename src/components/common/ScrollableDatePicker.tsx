import { useEffect, useMemo, useRef, useState } from 'react';

import { format, getDaysInMonth, parse } from 'date-fns';

import cn from '@/lib/utils';

type ScrollableDatePickerProps = {
  value: string;
  onChange?: (value: string) => void;
  parseFormat?: string;
  outputFormat?: string;
  minYear?: number;
  maxYear?: number;
};

function updateDateSegment(
  currentDate: Date | undefined,
  segment: 'year' | 'month' | 'day',
  value: number,
) {
  const baseDate = currentDate ?? new Date();
  const nextDate = new Date(baseDate);

  if (segment === 'year') nextDate.setFullYear(value);
  if (segment === 'month') nextDate.setMonth(value - 1);

  const maxDay = getDaysInMonth(nextDate);

  if (segment === 'day') {
    nextDate.setDate(Math.min(value, maxDay));
    return nextDate;
  }

  nextDate.setDate(Math.min(baseDate.getDate(), maxDay));
  return nextDate;
}

function ScrollableDatePicker({
  value,
  onChange,
  parseFormat = 'yyyy-MM-dd',
  outputFormat = 'yyyy-MM-dd',
  minYear = 1920,
  maxYear = new Date().getFullYear(),
}: ScrollableDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const selectedDate = useMemo(() => {
    const parsed = parse(value, parseFormat, new Date());
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }, [value, parseFormat]);

  const selectedYear = selectedDate?.getFullYear() ?? maxYear;
  const selectedMonth = (selectedDate?.getMonth() ?? 0) + 1;
  const selectedDay = selectedDate?.getDate() ?? 1;

  const yearOptions = useMemo(
    () =>
      Array.from(
        { length: maxYear - minYear + 1 },
        (_, index) => maxYear - index,
      ),
    [minYear, maxYear],
  );

  const dayOptions = useMemo(() => {
    const daysInMonth = getDaysInMonth(
      new Date(selectedYear, selectedMonth - 1, 1),
    );
    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }, [selectedMonth, selectedYear]);

  const handleSegmentChange = (
    segment: 'year' | 'month' | 'day',
    nextValue: number,
  ) => {
    if (!onChange) return;
    const nextDate = updateDateSegment(selectedDate, segment, nextValue);
    onChange(format(nextDate, outputFormat));
  };

  const displayValue = value ? value.replace(/-/g, '/') : '請選擇';

  return (
    <div ref={containerRef} className="relative" data-vaul-no-drag="">
      <button
        type="button"
        onClick={() => {
          if (onChange) setIsOpen((prev) => !prev);
        }}
        className="font-label-md inline-flex min-h-8 items-center rounded-md border-none bg-neutral-200 px-2 py-1 text-right text-neutral-600 transition-colors hover:bg-neutral-300 active:bg-neutral-400"
      >
        {displayValue}
      </button>
      {onChange && isOpen ? (
        <div
          data-vaul-no-drag=""
          className="absolute right-0 bottom-full z-50 mb-2 rounded-sm bg-neutral-200 p-2 shadow-md ring-2 ring-neutral-900"
        >
          <div className="flex gap-2">
            <div
              data-vaul-no-drag=""
              className="max-h-44 w-20 overflow-y-auto overscroll-contain rounded-md bg-neutral-100 p-1"
            >
              {yearOptions.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={cn(
                    'font-label-md flex w-full items-center justify-center rounded-sm px-2 py-1 text-neutral-600',
                    year === selectedYear
                      ? 'bg-neutral-900 text-neutral-50'
                      : 'hover:bg-neutral-200 active:bg-neutral-300',
                  )}
                  onClick={() => handleSegmentChange('year', year)}
                >
                  {year}
                </button>
              ))}
            </div>
            <div
              data-vaul-no-drag=""
              className="max-h-44 w-16 overflow-y-auto overscroll-contain rounded-md bg-neutral-100 p-1"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <button
                  key={month}
                  type="button"
                  className={cn(
                    'font-label-md flex w-full items-center justify-center rounded-sm px-2 py-1 text-neutral-600',
                    month === selectedMonth
                      ? 'bg-neutral-900 text-neutral-50'
                      : 'hover:bg-neutral-200 active:bg-neutral-300',
                  )}
                  onClick={() => handleSegmentChange('month', month)}
                >
                  {month}月
                </button>
              ))}
            </div>
            <div
              data-vaul-no-drag=""
              className="max-h-44 w-16 overflow-y-auto overscroll-contain rounded-md bg-neutral-100 p-1"
            >
              {dayOptions.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={cn(
                    'font-label-md flex w-full items-center justify-center rounded-sm px-2 py-1 text-neutral-600',
                    day === selectedDay
                      ? 'bg-neutral-900 text-neutral-50'
                      : 'hover:bg-neutral-200 active:bg-neutral-300',
                  )}
                  onClick={() => {
                    handleSegmentChange('day', day);
                    setIsOpen(false);
                  }}
                >
                  {day}日
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ScrollableDatePicker;

import { useState } from 'react';

import { addDays, format, isSameDay, startOfWeek } from 'date-fns';
import { ChevronDown } from 'lucide-react';

import BaseDrawer from '@/components/common/BaseDrawer';
import Calendar from '@/components/ui/calendar';
import cn from '@/lib/utils';

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

type WeekStripProps = {
  selected: Date;
  onSelect: (date: Date) => void;
};

function WeekStrip({ selected, onSelect }: WeekStripProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const weekStart = startOfWeek(selected, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;
    onSelect(date);
    setDrawerOpen(false);
  };

  return (
    <div>
      <button
        type="button"
        className="font-label-sm mb-3 flex items-center gap-1 rounded-full border-2 border-neutral-900 bg-neutral-50 px-3 py-1 text-neutral-900"
        onClick={() => setDrawerOpen(true)}
      >
        {format(selected, 'M月  yyyy')}
        <ChevronDown className="size-2.5" strokeWidth={4} />
      </button>

      <div className="h-20.5 rounded-sm border-2 border-neutral-900 bg-neutral-50 px-3 py-2">
        <div className="grid grid-cols-7">
          {weekDays.map((day, index) => {
            const isSelected = isSameDay(day, selected);

            return (
              <button
                key={day.toISOString()}
                type="button"
                aria-label={format(day, 'yyyy-MM-dd')}
                onClick={() => onSelect(day)}
                className="flex flex-col items-center"
              >
                <span
                  className={cn(
                    'flex h-16.5 w-11 flex-col items-center gap-2 rounded-full px-2 py-1.5 transition-colors',
                    isSelected
                      ? 'bg-neutral-800 text-neutral-50'
                      : 'text-neutral-800',
                  )}
                >
                  <span className="font-paragraph-sm">
                    {WEEKDAY_LABELS[index]}
                  </span>
                  <span className="font-paragraph-sm">{format(day, 'd')}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <BaseDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleCalendarSelect}
          defaultMonth={selected}
        />
      </BaseDrawer>
    </div>
  );
}

export default WeekStrip;

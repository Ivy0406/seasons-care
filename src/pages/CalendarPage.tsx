import { useState } from 'react';

import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Plus } from 'lucide-react';

import Calendar from '@/components/common/Calendar';

type CalendarEntry = {
  id: string;
  date: Date;
  time: string;
  title: string;
  summary: string;
  tags: string[];
};

const calendarEntries: CalendarEntry[] = [
  {
    id: 'entry-1',
    date: new Date(2026, 2, 4),
    time: '10:00',
    title: '回診追蹤',
    summary: '陪爸爸回診，醫師建議持續觀察睡眠與食慾。',
    tags: ['回診', '紀錄', '提醒'],
  },
  {
    id: 'entry-2',
    date: new Date(2026, 2, 5),
    time: '14:30',
    title: '復健練習',
    summary: '下午完成 30 分鐘復健，整體精神比昨天穩定。',
    tags: ['復健', '觀察'],
  },
  {
    id: 'entry-3',
    date: new Date(2026, 2, 5),
    time: '19:10',
    title: '晚餐與用藥',
    summary: '晚餐進食量正常，飯後已完成晚間用藥。',
    tags: ['飲食', '用藥'],
  },
  {
    id: 'entry-4',
    date: new Date(2026, 2, 12),
    time: '09:20',
    title: '血壓量測',
    summary: '早上血壓量測正常，已同步到照護記錄。',
    tags: ['量測'],
  },
];

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date());

  const markedDates = calendarEntries.map((entry) => entry.date);

  return (
    <main className="flex min-h-screen w-full flex-col pb-10 text-neutral-900">
      <section>
        <div className="mx-auto flex w-full max-w-200 items-center justify-between px-6 py-3.75">
          <h2 className="font-heading-lg">日誌</h2>
          <button
            type="button"
            aria-label="新增日誌"
            className="inline-flex size-10 items-center justify-center text-neutral-900"
          >
            <Plus className="size-8" strokeWidth={2} />
          </button>
        </div>
      </section>

      <section className="border-y border-neutral-900">
        <div className="mx-auto w-full max-w-200 px-4 py-5">
          <Calendar
            mode="single"
            month={visibleMonth}
            onMonthChange={setVisibleMonth}
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              if (date) setVisibleMonth(date);
            }}
            markedDates={markedDates}
            formatters={{
              formatCaption: (date: Date) =>
                format(date, 'yyyy.MM', { locale: zhTW }),
            }}
          />
        </div>
      </section>
    </main>
  );
}

export default CalendarPage;

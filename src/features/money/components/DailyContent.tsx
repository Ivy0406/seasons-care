import { useState } from 'react';

import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

import Calendar from '@/components/common/Calendar';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import cn from '@/lib/utils';

const mockCategories = [
  { label: '醫療支出', amount: 1000, color: 'bg-primary-default' },
  { label: '生活雜支', amount: 200, color: 'bg-neutral-50' },
];

const mockTotal = mockCategories.reduce(
  (totalAmount, category) => totalAmount + category.amount,
  0,
);

function DailyContent() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date());

  return (
    <div className="w-full">
      <Calendar
        mode="single"
        month={visibleMonth}
        onMonthChange={setVisibleMonth}
        selected={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date ?? new Date());
          setVisibleMonth(date ?? new Date());
        }}
        formatters={{
          formatCaption: (date: Date) =>
            format(date, 'yyyy.MM', { locale: zhTW }),
        }}
        className="font-paragraph-sm border-b-2 border-neutral-900 pb-4"
        classNames={{
          day_button: 'font-bold',
          weekday: 'font-bold',
          caption_label: 'font-bold border-b-2 border-neutral-900 pb-1',
        }}
      />
      <div className="mb-1 py-3">
        <p className="font-display-lg mb-3 text-center">
          $ {mockTotal.toLocaleString()}
        </p>

        <div className="mb-5 flex h-3 overflow-hidden rounded-full">
          {mockCategories.map((category) => (
            <div
              key={category.label}
              className={cn('h-full', category.color)}
              style={{
                width:
                  mockTotal > 0
                    ? `${(category.amount / mockTotal) * 100}%`
                    : '0%',
              }}
            />
          ))}
        </div>

        <ul className="flex flex-col gap-2">
          {mockCategories.map((category) => (
            <li
              key={category.label}
              className="flex items-center justify-between"
            >
              <span className="font-label-md flex items-center gap-1">
                <span className={cn('inline-block size-2', category.color)} />
                {category.label}
              </span>
              <span className="font-label-md">
                ${category.amount.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <RoundedButtonPrimary>當日分帳</RoundedButtonPrimary>
    </div>
  );
}

export default DailyContent;

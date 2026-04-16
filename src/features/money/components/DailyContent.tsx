import { useMemo, useState } from 'react';

import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';

import Calendar from '@/components/common/Calendar';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import {
  EXPENSE_CATEGORY_CONFIGS,
  INITIAL_CATEGORY_TOTALS,
} from '@/features/money/constants';
import useExpenses from '@/features/money/hooks/useExpenses';
import useSelectedDate from '@/features/money/hooks/useSelectedDate';
import type { CategoryWithAmount } from '@/features/money/types';
import cn from '@/lib/utils';

import SplitDialog from './SplitDialog';

function DailyContent() {
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const [visibleMonth, setVisibleMonth] = useState<Date>(selectedDate);
  const [splitDialogOpen, setSplitDialogOpen] = useState(false);
  const visibleMonthStr = format(visibleMonth, 'yyyy-MM');
  const { expenses } = useExpenses(visibleMonthStr);

  const markedDates = useMemo(
    () => expenses.map((e) => parseISO(e.expenseDate)),
    [expenses],
  );

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dailyExpenses = useMemo(
    () => expenses.filter((e) => e.expenseDate.startsWith(selectedDateStr)),
    [expenses, selectedDateStr],
  );

  const categoryTotals = useMemo(() => {
    const totals = { ...INITIAL_CATEGORY_TOTALS };
    dailyExpenses.forEach((expense) => {
      totals[expense.category] += expense.amount;
    });
    return totals;
  }, [dailyExpenses]);

  const categoriesWithAmount: CategoryWithAmount[] =
    EXPENSE_CATEGORY_CONFIGS.map((config) => ({
      ...config,
      amount: categoryTotals[config.category],
    })).filter((cat) => cat.amount > 0);

  const dailyTotal = categoriesWithAmount.reduce(
    (sum, cat) => sum + cat.amount,
    0,
  );

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
        markedDates={markedDates}
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

      <div className="pt-3">
        <p className="font-display-lg mb-3 text-center">
          $ {dailyTotal.toLocaleString()}
        </p>

        {categoriesWithAmount.length > 0 && (
          <>
            <div className="mb-5 flex h-3 overflow-hidden rounded-full">
              {categoriesWithAmount.map((cat) => (
                <div
                  key={cat.label}
                  className={cn('h-full', cat.color)}
                  style={{
                    width: `${(cat.amount / dailyTotal) * 100}%`,
                  }}
                />
              ))}
            </div>

            <ul className="flex flex-col gap-2">
              {categoriesWithAmount.map((cat) => (
                <li
                  key={cat.label}
                  className="flex items-center justify-between"
                >
                  <span className="font-label-md flex items-center gap-1">
                    <span className={cn('inline-block size-2', cat.color)} />
                    {cat.label}
                  </span>
                  <span className="font-label-md">
                    ${cat.amount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <RoundedButtonPrimary
        className="mt-4"
        disabled={dailyTotal === 0}
        onClick={() => setSplitDialogOpen(true)}
      >
        當日分帳
      </RoundedButtonPrimary>

      <SplitDialog
        open={splitDialogOpen}
        onOpenChange={setSplitDialogOpen}
        scope="daily"
        onConfirm={() => setSplitDialogOpen(false)}
      />
    </div>
  );
}

export default DailyContent;

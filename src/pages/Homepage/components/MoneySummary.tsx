import { format } from 'date-fns';
import { Plus } from 'lucide-react';

import EntryCard from '@/features/money/components/EntryCard';
import useExpenses from '@/features/money/hooks/useExpenses';

type MoneySummaryProps = {
  selectedDate: Date;
  onCreateEntry: () => void;
};
function MoneySummary({ selectedDate, onCreateEntry }: MoneySummaryProps) {
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const currentMonth = format(selectedDate, 'yyyy-MM');

  const { expenses } = useExpenses(currentMonth);
  const dailyExpenses = expenses.filter((e) =>
    e.expenseDate.replace('Z', '').startsWith(selectedDateStr),
  );
  const hasExpenses = dailyExpenses.length > 0;

  return (
    <section>
      <div className="rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 pt-5 pb-3">
        {hasExpenses ? (
          <div className="flex flex-col gap-3">
            {dailyExpenses.map((item) => (
              <EntryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={onCreateEntry}
            className="flex w-full flex-col items-center justify-center gap-5 rounded-md bg-neutral-100 px-4 py-10 text-center text-neutral-700"
          >
            <p className="font-paragraph-md">當日尚未有帳目，快來新增吧！</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-800 text-neutral-50">
              <Plus className="size-6" strokeWidth={2} />
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

export default MoneySummary;

import { format } from 'date-fns';

import CreateEntryEmptyState from '@/components/common/CreateEntryEmptyState';
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
      {hasExpenses ? (
        <div className="flex flex-col gap-3">
          {dailyExpenses.map((item) => (
            <EntryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 pt-5 pb-3">
          <CreateEntryEmptyState
            message="當日尚未有帳目，快來新增吧！"
            onCreateEntry={onCreateEntry}
            className="border-0 bg-neutral-100"
          />
        </div>
      )}
    </section>
  );
}

export default MoneySummary;

import { format } from 'date-fns';

import EntryCard from '@/features/money/components/EntryCard';
import useExpenses from '@/features/money/hooks/useExpenses';

type MoneySummaryProps = {
  selectedDate: Date;
};
function MoneySummary({ selectedDate }: MoneySummaryProps) {
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const currentMonth = format(selectedDate, 'yyyy-MM');

  const { expenses } = useExpenses(currentMonth);
  const dailyExpenses = expenses.filter((e) =>
    e.expenseDate.replace('Z', '').startsWith(selectedDateStr),
  );

  return (
    <section>
      <div className="flex flex-col gap-3">
        {dailyExpenses.map((item) => (
          <EntryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default MoneySummary;

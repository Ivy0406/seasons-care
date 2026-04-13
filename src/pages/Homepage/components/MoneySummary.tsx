import { format } from 'date-fns';

import EntryCard from '@/features/money/components/EntryCard';
import useExpenses from '@/features/money/hooks/useExpenses';

function MoneySummary() {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const currentMonth = format(today, 'yyyy-MM');

  const { expenses } = useExpenses(currentMonth);
  const todayExpenses = expenses.filter((e) =>
    e.expenseDate.replace('Z', '').startsWith(todayStr),
  );

  return (
    <section>
      <div className="flex flex-col gap-3">
        {todayExpenses.map((item) => (
          <EntryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default MoneySummary;

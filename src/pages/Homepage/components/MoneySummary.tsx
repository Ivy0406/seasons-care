import EntryCard from '@/features/money/components/EntryCard';
import useExpenses from '@/features/money/hooks/useExpenses';

function MoneySummary() {
  const { expenses } = useExpenses();

  return (
    <section>
      <div className="flex flex-col gap-3">
        {expenses.map((item) => (
          <EntryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default MoneySummary;

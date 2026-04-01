import { NavigationHeaderRow } from '@/components/common/NavigationBar';
import CardsList from '@/features/money/components/CardsList';
import MoneyTabsCard from '@/features/money/components/MoneyTabsCard';
import useExpenses from '@/features/money/hooks/useExpenses';

function MoneyPage() {
  const { expenses } = useExpenses();

  return (
    <main className="flex min-h-screen w-full flex-col bg-neutral-200 text-neutral-900">
      <NavigationHeaderRow title="帳目" className="px-6" />
      <div className="pt-2">
        <MoneyTabsCard />
      </div>
      <CardsList items={expenses} />
    </main>
  );
}

export default MoneyPage;

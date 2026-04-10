import FixedBottomButton from '@/components/common/FixedBottomButton';
import { PageNavigationBar } from '@/components/common/NavigationBar';
import CardsList from '@/features/money/components/CardsList';
import MemberExpenseSummary from '@/features/money/components/MemberExpenseSummary';
import MoneyTabsCard from '@/features/money/components/MoneyTabsCard';
import useActivedMoneyTab from '@/features/money/hooks/useActivedMoneyTab';
import useExpenses from '@/features/money/hooks/useExpenses';
import useSelectedMonth from '@/features/money/hooks/useSelectedMonth';

function MoneyPage() {
  const { expenses } = useExpenses();
  const { selectedMonth } = useSelectedMonth();
  const { activeTab } = useActivedMoneyTab();
  const monthlyExpenses = expenses.filter((e) =>
    e.expenseDate.startsWith(selectedMonth),
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-200 flex-col bg-neutral-200 pb-20 text-neutral-900">
      <PageNavigationBar title="帳目" className="px-6" />
      <div className="pt-2">
        <MoneyTabsCard />
      </div>
      {activeTab === 'monthly' && (
        <MemberExpenseSummary expenses={monthlyExpenses} />
      )}
      <CardsList items={monthlyExpenses} />
      <FixedBottomButton onClick={() => {}} label="新增" />
    </main>
  );
}

export default MoneyPage;

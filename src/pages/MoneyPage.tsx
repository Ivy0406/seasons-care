import { NavigationHeaderRow } from '@/components/common/NavigationBar';
import MoneyTabsCard from '@/features/money/components/MoneyTabsCard';

function MoneyPage() {
  return (
    <main className="flex min-h-screen w-full flex-col text-neutral-900">
      <NavigationHeaderRow title="帳目" className="px-6" />
      <div className="pt-2">
        <MoneyTabsCard />
      </div>
    </main>
  );
}

export default MoneyPage;

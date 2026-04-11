import { useState } from 'react';

import FixedBottomButton from '@/components/common/FixedBottomButton';
import { PageNavigationBar } from '@/components/common/NavigationBar';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import CardsList from '@/features/money/components/CardsList';
import CreateDataCard from '@/features/money/components/CreateDataCard';
import MemberExpenseSummary from '@/features/money/components/MemberExpenseSummary';
import MoneyTabsCard from '@/features/money/components/MoneyTabsCard';
import useActivedMoneyTab from '@/features/money/hooks/useActivedMoneyTab';
import useExpenses from '@/features/money/hooks/useExpenses';
import useSelectedMonth from '@/features/money/hooks/useSelectedMonth';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';

function MoneyPage() {
  const { expenses } = useExpenses();
  const { selectedMonth } = useSelectedMonth();
  const { activeTab } = useActivedMoneyTab();
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showRecordingDrawer, setShowRecordingDrawer] = useState(false);

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
      <FixedBottomButton onClick={() => setShowCreateCard(true)} label="新增" />

      <AlertDialog
        open={showCreateCard}
        onOpenChange={(open) => {
          if (!open) setShowCreateCard(false);
        }}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="w-[calc(100vw-32px)] max-w-140 border-0 bg-transparent p-0 shadow-none">
            <CreateDataCard
              onClose={() => setShowCreateCard(false)}
              onVoiceInput={() => {
                setShowCreateCard(false);
                setShowRecordingDrawer(true);
              }}
            />
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      <RecordingDrawer
        open={showRecordingDrawer}
        onOpenChange={setShowRecordingDrawer}
        onFinish={() => setShowRecordingDrawer(false)}
      />
    </main>
  );
}

export default MoneyPage;

import { useEffect, useMemo, useState } from 'react';

import { isValid, parseISO } from 'date-fns';
import { useLocation } from 'react-router';

import FixedBottomButton from '@/components/common/FixedBottomButton';
import Loading from '@/components/common/Loading';
import Modal from '@/components/common/Modal';
import { PageNavigationBar } from '@/components/common/NavigationBar';
import SideMenu from '@/components/common/SideMenu';
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
import useActiveExpenses from '@/features/money/hooks/useActiveExpenses';
import useSelectedDate from '@/features/money/hooks/useSelectedDate';

function MoneyPage() {
  const location = useLocation();
  const { activeTab, setActivedMoneyTab } = useActivedMoneyTab();
  const { setSelectedDate } = useSelectedDate();
  const { cardListItems, isLoading } = useActiveExpenses();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const initialOpenExpenseId = useMemo(() => {
    if (
      !location.state ||
      typeof location.state !== 'object' ||
      !('expenseId' in location.state)
    ) {
      return undefined;
    }
    const { expenseId } = location.state as { expenseId?: unknown };
    return typeof expenseId === 'string' ? expenseId : undefined;
  }, [location.state]);

  useEffect(() => {
    if (
      !location.state ||
      typeof location.state !== 'object' ||
      !('date' in location.state)
    ) {
      return;
    }
    const { date } = location.state as { date?: unknown };
    if (typeof date !== 'string') return;
    const parsed = parseISO(date.replace('Z', ''));
    if (!isValid(parsed)) return;
    setSelectedDate(parsed);
    setActivedMoneyTab('daily');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [createSuccessOpen, setCreateSuccessOpen] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-200 flex-col bg-neutral-200 pb-20 text-neutral-900">
      <PageNavigationBar
        title="帳目"
        className="sticky top-0 z-20 border-0 bg-neutral-200 px-6"
        onMenuClick={() => setIsSideMenuOpen(true)}
      />
      <div className="pt-2">
        <MoneyTabsCard />
      </div>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <Loading />
        </div>
      ) : (
        <>
          {activeTab === 'monthly' && <MemberExpenseSummary />}
          <CardsList
            items={cardListItems}
            initialOpenExpenseId={initialOpenExpenseId}
          />
        </>
      )}
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
              onSuccess={() => {
                setShowCreateCard(false);
                setCreateSuccessOpen(true);
              }}
            />
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      <SideMenu open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen} />

      <Modal
        open={createSuccessOpen}
        variant="success"
        title="帳目建立完成！"
        statusLayout="icon-first"
        autoCloseMs={1500}
        onClose={() => setCreateSuccessOpen(false)}
      />
    </main>
  );
}

export default MoneyPage;

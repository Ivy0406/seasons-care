import { useState } from 'react';

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

function MoneyPage() {
  const { activeTab } = useActivedMoneyTab();
  const { cardListItems, isLoading } = useActiveExpenses();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
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
          <CardsList items={cardListItems} />
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

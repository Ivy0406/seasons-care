import { useEffect, useState } from 'react';

import { X } from 'lucide-react';

import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useActiveExpenses from '@/features/money/hooks/useActiveExpenses';
import useSplitPreview from '@/features/money/hooks/useSplitPreview';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';

import SplitItemsPreview from './SplitItemsPreview';
import SplitItemsSelector from './SplitItemsSelector';
import { SplitParticipantSelect } from './SplitParticipant';
import SplitResultPreview from './SplitResultPreview';

type SplitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: 'daily' | 'monthly';
  onConfirm: (selectedItemIds: string[], selectedMemberIds: string[]) => void;
};

function SplitDialog({
  open,
  onOpenChange,
  scope,
  onConfirm,
}: SplitDialogProps) {
  const { currentGroupId } = useCurrentGroupId();
  const { dailyExpenses, monthlyExpenses } = useActiveExpenses();
  const { data: members = [] } = useGetGroupMembers(currentGroupId);

  const expenses = scope === 'daily' ? dailyExpenses : monthlyExpenses;
  const pendingItems = expenses
    .filter(({ splitStatus }) => splitStatus === 'pending')
    .map(({ id, title, amount, createdBy }) => ({
      id,
      title,
      amount,
      createdBy,
    }));

  const [step, setStep] = useState<'select' | 'preview'>('select');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setSelectedItemIds(pendingItems.map(({ id }) => id));
    setSelectedMemberIds(members.map(({ userId }) => userId));
    setStep('select');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const { selectedItems, memberSplits } = useSplitPreview(
    selectedItemIds,
    selectedMemberIds,
    pendingItems,
    members,
  );

  const handleConfirm = () => {
    onConfirm(selectedItemIds, selectedMemberIds);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup className="h-95vh flex w-92.25 flex-col rounded-sm border-0 bg-neutral-200 px-6 pt-3 pb-5">
          <AlertDialogClose
            className="absolute top-4 right-6 flex size-7 items-center justify-center rounded-full text-neutral-900"
            aria-label="關閉"
          >
            <X className="size-4" strokeWidth={3} />
          </AlertDialogClose>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto pt-7">
            {step === 'select' ? (
              <>
                <SplitItemsSelector
                  items={pendingItems}
                  selectedIds={selectedItemIds}
                  onSelectedIdsChange={setSelectedItemIds}
                />

                <div className="flex flex-col pb-5">
                  <p className="font-heading-sm pb-3 text-neutral-900">
                    選擇平分對象
                  </p>

                  {members.map(({ userId, username, avatarKey }) => (
                    <SplitParticipantSelect
                      key={userId}
                      name={username}
                      avatarKey={avatarKey}
                      selected={selectedMemberIds.includes(userId)}
                      onToggle={() =>
                        setSelectedMemberIds((prev) =>
                          prev.includes(userId)
                            ? prev.filter((id) => id !== userId)
                            : [...prev, userId],
                        )
                      }
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <SplitItemsPreview items={selectedItems} />
                <SplitResultPreview memberSplits={memberSplits} />
              </>
            )}
          </div>

          {step === 'select' ? (
            <RoundedButtonPrimary
              className="h-[45.6px] w-full rounded-full bg-neutral-900 text-neutral-50"
              onClick={() => setStep('preview')}
            >
              確認分帳結果
            </RoundedButtonPrimary>
          ) : (
            <div className="flex h-10 items-center justify-between gap-2">
              <RoundedButtonPrimary
                onClick={() => setStep('select')}
                className="h-9 flex-1 bg-transparent px-0 text-neutral-900 ring-2 ring-neutral-900"
              >
                取消
              </RoundedButtonPrimary>

              <RoundedButtonPrimary
                className="h-full flex-1 bg-neutral-900 px-0 text-neutral-50"
                onClick={handleConfirm}
              >
                確定分帳
              </RoundedButtonPrimary>
            </div>
          )}
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}

export default SplitDialog;

import { useEffect, useMemo, useState } from 'react';

import { X } from 'lucide-react';

import Modal from '@/components/common/Modal';
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
import useFetchSplitPreview from '@/features/money/hooks/useFetchSplitPreview';
import useSubmitSplit from '@/features/money/hooks/useSubmitSplit';
import type { MemberSplit, SplitItem } from '@/features/money/types';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';

import SplitItemsPreview from './SplitItemsPreview';
import SplitItemsSelector from './SplitItemsSelector';
import { SplitParticipantSelect } from './SplitParticipant';
import SplitResultPreview from './SplitResultPreview';

type SplitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: 'daily' | 'monthly';
  onSuccess: () => void;
};

type PreviewData = {
  selectedItems: SplitItem[];
  memberSplits: MemberSplit[];
};

function SplitDialog({
  open,
  onOpenChange,
  scope,
  onSuccess,
}: SplitDialogProps) {
  const { currentGroupId } = useCurrentGroupId();
  const { dailyExpenses, monthlyExpenses } = useActiveExpenses();
  const { data: members = [] } = useGetGroupMembers(currentGroupId);
  const { isLoading: isPreviewing, fetchPreview } = useFetchSplitPreview();
  const { isLoading: isSubmitting, handleSubmitSplit } = useSubmitSplit();

  const expenses = scope === 'daily' ? dailyExpenses : monthlyExpenses;
  const pendingItems = useMemo(
    () =>
      expenses
        .filter(({ splitStatus }) => splitStatus === 'pending')
        .map(({ id, title, amount, createdBy }) => ({
          id,
          title,
          amount,
          createdBy,
        })),
    [expenses],
  );

  const [step, setStep] = useState<'select' | 'preview'>('select');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState<{
    open: boolean;
    message?: string;
  }>({ open: false });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsInitialized(false);
      setStep('select');
      setPreviewData(null);
      setPreviewError(null);
      return;
    }

    if (!isInitialized && pendingItems.length > 0 && members.length > 0) {
      setSelectedItemIds(pendingItems.map(({ id }) => id));
      setSelectedMemberIds(members.map(({ userId }) => userId));
      setIsInitialized(true);
    }
  }, [open, isInitialized, pendingItems, members]);

  const handleGoToPreview = async () => {
    setPreviewError(null);
    const result = await fetchPreview(selectedItemIds, selectedMemberIds);
    if (result.success) {
      setPreviewData({
        selectedItems: result.selectedItems,
        memberSplits: result.memberSplits,
      });
      setStep('preview');
    } else {
      setPreviewError(result.message);
    }
  };

  const handleConfirm = async () => {
    const result = await handleSubmitSplit(selectedItemIds, selectedMemberIds);
    if (result.success) {
      onSuccess();
    } else {
      setErrorModal({ open: true, message: result.message });
    }
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
              previewData && (
                <>
                  <SplitItemsPreview items={previewData.selectedItems} />
                  <SplitResultPreview memberSplits={previewData.memberSplits} />
                </>
              )
            )}
          </div>

          {step === 'select' ? (
            <div className="flex flex-col gap-2">
              {previewError && (
                <p className="font-paragraph-sm text-center text-red-500">
                  {previewError}
                </p>
              )}
              <RoundedButtonPrimary
                className="h-[45.6px] w-full rounded-full bg-neutral-900 text-neutral-50"
                onClick={handleGoToPreview}
                disabled={
                  isPreviewing ||
                  selectedItemIds.length === 0 ||
                  selectedMemberIds.length === 0
                }
              >
                {isPreviewing ? '計算中...' : '確認分帳結果'}
              </RoundedButtonPrimary>
            </div>
          ) : (
            <div className="flex h-10 items-center justify-between gap-2">
              <RoundedButtonPrimary
                onClick={() => setStep('select')}
                className="h-9 flex-1 bg-transparent px-0 text-neutral-900 ring-2 ring-neutral-900"
                disabled={isSubmitting}
              >
                取消
              </RoundedButtonPrimary>

              <RoundedButtonPrimary
                className="h-full flex-1 bg-neutral-900 px-0 text-neutral-50"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? '處理中...' : '確定分帳'}
              </RoundedButtonPrimary>
            </div>
          )}

          <Modal
            open={errorModal.open}
            variant="error"
            title="分帳失敗！"
            description={errorModal.message}
            statusLayout="icon-first"
            onClose={() => setErrorModal({ open: false })}
          />
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}

export default SplitDialog;

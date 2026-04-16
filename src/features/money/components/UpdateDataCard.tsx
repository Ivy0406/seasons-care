import { useState } from 'react';

import { format, parseISO } from 'date-fns';

import DataFormCard from '@/components/common/DataFormCard';
import Modal from '@/components/common/Modal';
import { RoundedButtonSecondary } from '@/components/common/RoundedButtons';
import { MoneyDataSmallForm } from '@/components/common/SmallDataForm';
import VoiceCTA from '@/components/common/voiceCTA';
import { Button } from '@/components/ui/button';
import useUpdateMoneyItem from '@/features/money/hooks/useUpdateMoneyItem';
import type { ExpenseItem, MoneyDraft } from '@/features/money/types';

type UpdateDataCardProps = {
  item: ExpenseItem;
  onClose: () => void;
  onDeleteClick: () => void;
  onVoiceInput?: () => void;
};

type ResultModal = {
  open: boolean;
  variant: 'success' | 'error';
  message?: string;
};

function itemToMoneyDraft(item: ExpenseItem): MoneyDraft {
  const date = parseISO(item.expenseDate);
  return {
    title: item.title,
    amount: String(item.amount),
    dateValue: format(date, 'yyyy/MM/dd'),
    timeValue: format(date, 'HH:mm'),
    category: item.category,
    needsSplit: item.splitStatus === 'pending',
    notes: item.notes ?? '',
    transcript: '',
    summary: '',
  };
}

function UpdateDataCard({
  item,
  onClose,
  onDeleteClick,
  onVoiceInput,
}: UpdateDataCardProps) {
  const [draft, setDraft] = useState<MoneyDraft>(() => itemToMoneyDraft(item));
  const [resultModal, setResultModal] = useState<ResultModal>({
    open: false,
    variant: 'success',
  });

  const { isLoading, handleUpdateMoneyItem } = useUpdateMoneyItem();

  const isSubmitDisabled =
    isLoading ||
    draft.title.trim() === '' ||
    draft.amount.trim() === '' ||
    draft.category === null;

  const handleChange = (updates: Partial<MoneyDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    const result = await handleUpdateMoneyItem(item.id, draft, item.updatedAt);
    setResultModal({
      open: true,
      variant: result.success ? 'success' : 'error',
      message: result.success ? undefined : result.message,
    });
  };

  const handleModalClose = () => {
    setResultModal((prev) => ({ ...prev, open: false }));
    if (resultModal.variant === 'success') onClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <DataFormCard
          title="編輯帳目"
          className="bg-neutral-800"
          toneClassName="bg-neutral-800 text-neutral-50"
          contentClassName="p-0"
        >
          <DataFormCard.Content>
            <div className="flex flex-col text-neutral-900">
              <VoiceCTA
                className="bg-primary-default text-neutral-900"
                title="記帳"
                onClose={onClose}
                onInputClick={() => onVoiceInput?.()}
              />
              <MoneyDataSmallForm
                className="w-full border-0 bg-neutral-50 px-3 pt-3"
                value={draft}
                onChange={handleChange}
              />
            </div>
          </DataFormCard.Content>
          <DataFormCard.Footer>
            <div className="flex gap-5">
              <Button
                type="button"
                variant="outline"
                className="h-10 flex-1 rounded-full border-neutral-50 bg-transparent text-neutral-50"
                onClick={onDeleteClick}
              >
                刪除帳目
              </Button>
              <RoundedButtonSecondary
                type="submit"
                className="bg-secondary-default h-10 flex-1 rounded-full border-0 text-neutral-900"
                disabled={isSubmitDisabled}
              >
                {isLoading ? '儲存中...' : '更新帳目'}
              </RoundedButtonSecondary>
            </div>
          </DataFormCard.Footer>
        </DataFormCard>
      </form>

      <Modal
        open={resultModal.open}
        variant={resultModal.variant}
        title={
          resultModal.variant === 'success'
            ? '帳目更新完成！'
            : '帳目更新失敗！'
        }
        description={resultModal.message}
        statusLayout="icon-first"
        autoCloseMs={resultModal.variant === 'success' ? 1500 : undefined}
        onClose={handleModalClose}
      />
    </>
  );
}

export default UpdateDataCard;

import { useState } from 'react';

import { format } from 'date-fns';

import DataFormCard from '@/components/common/DataFormCard';
import Modal from '@/components/common/Modal';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import { MoneyDataSmallForm } from '@/components/common/SmallDataForm';
import VoiceCTA from '@/components/common/voiceCTA';
import useCreateMoneyItem from '@/features/money/hooks/useCreateMoneyItem';
import type { MoneyDraft } from '@/features/money/types';
import { createEmptyMoneyDraft } from '@/features/voice/services/moneyParser';

type CreateDataCardProps = {
  onClose: () => void;
  onVoiceInput?: () => void;
  initialDate?: Date;
};

type ResultModal = {
  open: boolean;
  variant: 'success' | 'error';
  message?: string;
};

function CreateDataCard({
  onClose,
  onVoiceInput,
  initialDate,
}: CreateDataCardProps) {
  const [draft, setDraft] = useState<MoneyDraft>(() => {
    const base = createEmptyMoneyDraft();
    const now = initialDate ?? new Date();
    return {
      ...base,
      dateValue: format(now, 'yyyy/MM/dd'),
      timeValue: format(now, 'HH:mm'),
    };
  });

  const [resultModal, setResultModal] = useState<ResultModal>({
    open: false,
    variant: 'success',
  });

  const { isLoading, handleCreateMoneyItem } = useCreateMoneyItem();

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
    const result = await handleCreateMoneyItem(draft);
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
          title="新帳目"
          className="bg-secondary-default"
          toneClassName="bg-secondary-default"
          contentClassName="p-0"
        >
          <DataFormCard.Content>
            <VoiceCTA
              className="bg-primary-default"
              title="記帳"
              onClose={onClose}
              onInputClick={() => onVoiceInput?.()}
            />
            <MoneyDataSmallForm
              className="w-full border-0 bg-neutral-50 px-3 pt-3"
              value={draft}
              onChange={handleChange}
            />
          </DataFormCard.Content>
          <DataFormCard.Footer>
            <RoundedButtonPrimary
              type="submit"
              className="w-full"
              disabled={isSubmitDisabled}
            >
              新增帳目
            </RoundedButtonPrimary>
          </DataFormCard.Footer>
        </DataFormCard>
      </form>

      <Modal
        open={resultModal.open}
        variant={resultModal.variant}
        title={
          resultModal.variant === 'success'
            ? '帳目建立完成！'
            : '帳目建立失敗！'
        }
        description={resultModal.message}
        statusLayout="icon-first"
        autoCloseMs={resultModal.variant === 'success' ? 1500 : undefined}
        onClose={handleModalClose}
      />
    </>
  );
}

export default CreateDataCard;

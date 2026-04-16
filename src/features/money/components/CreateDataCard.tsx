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
  onSuccess: () => void;
  onVoiceInput?: () => void;
  initialDate?: Date;
};

function CreateDataCard({
  onClose,
  onSuccess,
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

  const [errorModal, setErrorModal] = useState<{
    open: boolean;
    message?: string;
  }>({ open: false });

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
    if (result.success) {
      onSuccess();
    } else {
      setErrorModal({ open: true, message: result.message });
    }
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
        open={errorModal.open}
        variant="error"
        title="帳目建立失敗！"
        description={errorModal.message}
        statusLayout="icon-first"
        onClose={() => setErrorModal({ open: false })}
      />
    </>
  );
}

export default CreateDataCard;

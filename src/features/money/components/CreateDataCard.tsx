import { useState } from 'react';

import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import DataFormCard from '@/components/common/DataFormCard';
import Modal from '@/components/common/Modal';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import { MoneyDataSmallForm } from '@/components/common/SmallDataForm';
import type { MoneyFormFields } from '@/components/common/SmallDataForm';
import VoiceFormSection from '@/components/common/VoiceFormSection';
import useCreateMoneyItem from '@/features/money/hooks/useCreateMoneyItem';
import type { MoneyCategoryValue, MoneyDraft } from '@/features/money/types';
import handleMoneyVoiceFinish from '@/features/money/utils/moneyVoice';
import { createEmptyMoneyDraft } from '@/features/voice/services/moneyParser';

type CreateDataCardProps = {
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date;
};

function CreateDataCard({
  onClose,
  onSuccess,
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

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<MoneyFormFields>({
    mode: 'onChange',
    defaultValues: { title: '', amount: '', category: '' },
  });

  const { isLoading, handleCreateMoneyItem } = useCreateMoneyItem();

  const handleChange = (updates: Partial<MoneyDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const applyVoiceDraft = (nextDraft: MoneyDraft, transcript: string) => {
    // RHF 管理的欄位用 setValue 更新，shouldValidate 確保即時重新驗證
    if (nextDraft.title.trim()) {
      setValue('title', nextDraft.title, { shouldValidate: true });
    }
    if (nextDraft.amount.trim()) {
      setValue('amount', nextDraft.amount, { shouldValidate: true });
    }
    if (nextDraft.category) {
      setValue('category', nextDraft.category, { shouldValidate: true });
    }

    // 非必填欄位維持原本 draft state 管理
    setDraft((currentDraft) => ({
      ...currentDraft,
      dateValue:
        /(今天|明天|後天|\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[/月]\d{1,2})/u.test(
          transcript,
        )
          ? nextDraft.dateValue.replaceAll('-', '/')
          : currentDraft.dateValue,
      timeValue:
        /(?:早上|上午|中午|下午|晚上)\s*\d{1,2}(?:[:：點時]\d{1,2})?(?:分)?|\d{1,2}[:：]\d{2}/u.test(
          transcript,
        )
          ? nextDraft.timeValue
          : currentDraft.timeValue,
      needsSplit: nextDraft.needsSplit,
      notes:
        nextDraft.notes.trim() !== '' ? nextDraft.notes : currentDraft.notes,
      transcript: nextDraft.transcript,
      summary: nextDraft.summary,
    }));
  };

  const onSubmit = async (formData: MoneyFormFields) => {
    const fullDraft: MoneyDraft = {
      ...draft,
      title: formData.title,
      amount: formData.amount,
      category: formData.category as MoneyCategoryValue,
    };
    const result = await handleCreateMoneyItem(fullDraft);
    if (result.success) {
      onSuccess();
    } else {
      setErrorModal({ open: true, message: result.message });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DataFormCard
          title="新帳目"
          className="bg-secondary-default"
          toneClassName="bg-secondary-default"
          contentClassName="p-0"
        >
          <DataFormCard.Content>
            <VoiceFormSection
              title="記帳"
              onClose={onClose}
              ctaClassName="bg-primary-default"
              onVoiceFinish={({ transcript }) =>
                handleMoneyVoiceFinish({
                  transcript,
                  applyVoiceDraft,
                })
              }
            >
              <MoneyDataSmallForm
                className="w-full border-0 bg-neutral-50 px-3 pt-3"
                value={draft}
                onChange={handleChange}
                register={register}
                control={control}
                errors={errors}
              />
            </VoiceFormSection>
          </DataFormCard.Content>
          <DataFormCard.Footer>
            <RoundedButtonPrimary
              type="submit"
              className="w-full"
              disabled={!isValid || isLoading}
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

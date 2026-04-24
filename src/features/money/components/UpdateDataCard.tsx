import { useState } from 'react';

import { format, parseISO } from 'date-fns';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import DataFormCard from '@/components/common/DataFormCard';
import Modal from '@/components/common/Modal';
import { RoundedButtonSecondary } from '@/components/common/RoundedButtons';
import { MoneyDataSmallForm } from '@/components/common/SmallDataForm';
import type { MoneyFormFields } from '@/components/common/SmallDataForm';
import { Button } from '@/components/ui/button';
import useUpdateMoneyItem from '@/features/money/hooks/useUpdateMoneyItem';
import type {
  ExpenseItem,
  MoneyCategoryValue,
  MoneyDraft,
} from '@/features/money/types';

type UpdateDataCardProps = {
  item: ExpenseItem;
  onClose: () => void;
  onSuccess: () => void;
  onDeleteClick: () => void;
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
  onSuccess,
  onDeleteClick,
}: UpdateDataCardProps) {
  const [draft, setDraft] = useState<MoneyDraft>(() => itemToMoneyDraft(item));
  const [errorModal, setErrorModal] = useState<{
    open: boolean;
    message?: string;
  }>({ open: false });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<MoneyFormFields>({
    mode: 'onChange',
    defaultValues: {
      title: item.title,
      amount: String(item.amount),
      category: item.category,
    },
  });

  const { isLoading, handleUpdateMoneyItem } = useUpdateMoneyItem();

  const handleChange = (updates: Partial<MoneyDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const onSubmit = async (formData: MoneyFormFields) => {
    const fullDraft: MoneyDraft = {
      ...draft,
      title: formData.title,
      amount: formData.amount,
      category: formData.category as MoneyCategoryValue,
    };
    const result = await handleUpdateMoneyItem(
      item.id,
      fullDraft,
      item.updatedAt,
    );
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
          title="編輯帳目"
          className="bg-neutral-800"
          toneClassName="bg-neutral-800 text-neutral-50"
          contentClassName="p-0"
        >
          <DataFormCard.Content>
            <div className="flex justify-end px-4 pt-4">
              <button
                type="button"
                aria-label="關閉編輯帳目"
                className="inline-flex size-6 items-center justify-center rounded-full text-neutral-900"
                onClick={onClose}
              >
                <X className="size-4" strokeWidth={3} />
              </button>
            </div>
            <MoneyDataSmallForm
              className="w-full border-0 bg-neutral-50 px-3 pt-3"
              value={draft}
              onChange={handleChange}
              register={register}
              control={control}
              errors={errors}
            />
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
                disabled={!isValid || isLoading}
              >
                {isLoading ? '儲存中...' : '更新帳目'}
              </RoundedButtonSecondary>
            </div>
          </DataFormCard.Footer>
        </DataFormCard>
      </form>

      <Modal
        open={errorModal.open}
        variant="error"
        title="帳目更新失敗！"
        description={errorModal.message}
        statusLayout="icon-first"
        onClose={() => setErrorModal({ open: false })}
      />
    </>
  );
}

export default UpdateDataCard;

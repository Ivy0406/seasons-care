import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import DataFormCard from '@/components/common/DataFormCard';
import {
  MoneyDataSmallForm,
  type MoneyFormFields,
} from '@/components/common/SmallDataForm';
import type { MoneyDraft } from '@/features/money/types';

type MoneyDataFormCardProps = {
  value: MoneyDraft;
  onChange: (updates: Partial<MoneyDraft>) => void;
  onValidityChange?: (valid: boolean) => void;
};

function MoneyDataFormCard({
  value,
  onChange,
  onValidityChange,
}: MoneyDataFormCardProps) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MoneyFormFields>({
    mode: 'onChange',
    defaultValues: {
      title: value.title,
      amount: value.amount,
      category: value.category ?? '',
    },
  });
  const watchedTitle = watch('title');
  const watchedAmount = watch('amount');
  const watchedCategory = watch('category');
  const isValid =
    watchedTitle.trim().length > 0 &&
    watchedCategory.trim().length > 0 &&
    !Number.isNaN(Number(watchedAmount)) &&
    Number(watchedAmount) > 0;

  useEffect(() => {
    setValue('title', value.title, { shouldValidate: true });
    setValue('amount', value.amount, { shouldValidate: true });
    setValue('category', value.category ?? '', { shouldValidate: true });
  }, [
    setValue,
    value.amount,
    value.category,
    value.summary,
    value.title,
    value.transcript,
  ]);

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <DataFormCard
      title="新帳目"
      className="bg-secondary-default"
      toneClassName="bg-secondary-default"
    >
      <DataFormCard.Content>
        <MoneyDataSmallForm
          className="w-full border-0 bg-neutral-50 px-0 pt-3"
          value={value}
          onChange={onChange}
          register={register}
          control={control}
          errors={errors}
        />
      </DataFormCard.Content>
    </DataFormCard>
  );
}

export default MoneyDataFormCard;

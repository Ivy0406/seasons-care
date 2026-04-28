import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import DataFormCard from '@/components/common/DataFormCard';
import {
  JournalDataSmallForm,
  type JournalFormFields,
} from '@/components/common/SmallDataForm';
import type { DiaryDraft } from '@/pages/CareLog/types';
import type { GroupMember } from '@/types/group';

type DiaryDataFormCardProps = {
  title?: string;
  value: DiaryDraft;
  onChange: (updates: Partial<DiaryDraft>) => void;
  groupMembers?: GroupMember[];
  participantIds?: string[];
  onParticipantsChange?: (ids: string[]) => void;
  onValidityChange?: (valid: boolean) => void;
};

function DiaryDataFormCard({
  title = '新任務',
  value,
  onChange,
  groupMembers = [],
  participantIds = [],
  onParticipantsChange,
  onValidityChange,
}: DiaryDataFormCardProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JournalFormFields>({
    mode: 'onChange',
    defaultValues: {
      title: value.title,
    },
  });
  const watchedTitle = watch('title');
  const isValid =
    watchedTitle.trim().length > 0 &&
    value.dateValue.trim().length > 0 &&
    value.timeValue.trim().length > 0;

  useEffect(() => {
    setValue('title', value.title, { shouldValidate: true });
  }, [setValue, value.id, value.summary, value.title, value.transcript]);

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <DataFormCard
      title={title}
      className="bg-primary-default"
      toneClassName="bg-primary-default"
    >
      <DataFormCard.Content>
        <JournalDataSmallForm
          className="w-full border-0 bg-neutral-50 px-0 pt-3"
          value={value}
          onChange={onChange}
          groupMembers={groupMembers}
          participantIds={participantIds}
          onParticipantsChange={onParticipantsChange}
          register={register}
          errors={errors}
          onDateChange={(dateValue) => onChange({ dateValue })}
          onTimeChange={(timeValue) => onChange({ timeValue })}
        />
      </DataFormCard.Content>
    </DataFormCard>
  );
}

export default DiaryDataFormCard;

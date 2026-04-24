import { useEffect, useState } from 'react';

import { format, parse, parseISO } from 'date-fns';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import getAvatarSrcByKey from '@/assets/images/avatars';
import DataFormCard from '@/components/common/DataFormCard';
import {
  ListFormDateTimeRow,
  ListFormImportantRow,
  ListFormInputRow,
  ListFormNoteRow,
  ListFormParticipantsRow,
  ListFormRepeatRow,
  type RepeatPatternValue,
} from '@/components/common/ListFormRows';
import {
  RoundedButtonPrimary,
  RoundedButtonSecondary,
} from '@/components/common/RoundedButtons';
import VoiceFormSection from '@/components/common/VoiceFormSection';
import type { CareLogEntry } from '@/pages/CareLog/types';
import { handleCareLogVoiceFinish } from '@/pages/CareLog/utils/careLogVoice';
import type { GroupMember } from '@/types/group';

type CareLogFormCardProps = {
  entry: CareLogEntry;
  title: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (entry: CareLogEntry) => void | Promise<void>;
  isSubmitting?: boolean;
  cardClassName?: string;
  toneClassName?: string;
  footerMode?: 'default' | 'submitOnly';
  groupMembers?: GroupMember[];
  showVoiceInput?: boolean;
  editMode?: 'default' | 'recurring-occurrence';
};

function CareLogFormCard({
  entry,
  title,
  submitLabel,
  onClose,
  onSubmit,
  isSubmitting = false,
  cardClassName = 'bg-neutral-800',
  toneClassName = '-mt-0.5 bg-neutral-800 text-neutral-50',
  footerMode = 'default',
  groupMembers = [],
  showVoiceInput = true,
  editMode = 'default',
}: CareLogFormCardProps) {
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    setValue: setTitleValue,
    watch,
    formState: { errors: titleErrors },
  } = useForm<{ title: string }>({
    mode: 'onChange',
    defaultValues: { title: entry.title },
  });

  const titleValue = watch('title');

  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [repeatPattern, setRepeatPattern] = useState<RepeatPatternValue>(
    entry.repeatPattern ?? 'none',
  );
  const [status, setStatus] = useState(entry.status);
  const [isImportant, setIsImportant] = useState(entry.isImportant ?? false);
  const [note, setNote] = useState(entry.description);
  const [participantIds, setParticipantIds] = useState<string[]>(
    entry.participants.map((p) => p.id),
  );

  const memberOptions = groupMembers.map((m) => ({
    id: m.userId,
    name: m.username,
    avatar: getAvatarSrcByKey(m.avatarKey),
  }));

  useEffect(() => {
    const startedAt = parseISO(entry.startsAt);

    setTitleValue('title', entry.title);
    setDateValue(format(startedAt, 'yyyy/MM/dd'));
    setTimeValue(format(startedAt, 'HH:mm'));
    setRepeatPattern(entry.repeatPattern ?? 'none');
    setStatus(entry.status);
    setIsImportant(entry.isImportant ?? false);
    setNote(entry.description);
    setParticipantIds(entry.participants.map((p) => p.id));
  }, [entry]);

  const isSubmitDisabled =
    isSubmitting ||
    (editMode === 'default' &&
      (titleValue.trim().length === 0 ||
        dateValue.trim().length === 0 ||
        timeValue.trim().length === 0));

  const doSubmit = (formData: { title: string }) => {
    const startsAt =
      editMode === 'default'
        ? format(
            parse(
              `${dateValue} ${timeValue}`,
              'yyyy/MM/dd HH:mm',
              parseISO(entry.startsAt),
            ),
            "yyyy-MM-dd'T'HH:mm:ssxxx",
          )
        : entry.startsAt;

    const selectedParticipants = memberOptions.filter((m) =>
      participantIds.includes(m.id),
    );

    onSubmit({
      ...entry,
      title: formData.title,
      description: note,
      startsAt,
      status,
      isImportant,
      repeatPattern: repeatPattern ?? 'none',
      participants: selectedParticipants.map((m) => ({
        id: m.id,
        name: m.name,
        src: m.avatar,
      })),
    });
  };

  const handleSubmit = () => {
    if (isSubmitDisabled) return;
    rhfHandleSubmit(doSubmit)();
  };

  const formFields = (
    <div className="px-4 py-2">
      {editMode === 'default' ? (
        <>
          <ListFormInputRow
            label="任務名稱"
            required
            inputProps={{
              id: `${entry.id}-title`,
              ...register('title', { required: '任務名稱為必填' }),
            }}
            error={titleErrors.title?.message}
            className="border-neutral-900"
          />
          <ListFormDateTimeRow
            label="時間"
            dateValue={dateValue}
            timeValue={timeValue}
            onDateChange={setDateValue}
            onTimeChange={setTimeValue}
            className="border-neutral-900"
          />
          <ListFormRepeatRow
            value={repeatPattern}
            onChange={setRepeatPattern}
            selectedDateValue={dateValue}
            className="border-neutral-900"
          />
        </>
      ) : null}
      <ListFormParticipantsRow
        label="參與者"
        members={memberOptions}
        selectedIds={participantIds}
        onSelectedChange={setParticipantIds}
        fallbackParticipants={entry.participants.map((p) => ({
          id: p.id,
          name: p.name,
          avatar: p.src,
        }))}
        className="border-neutral-900"
      />
      {editMode === 'default' ? (
        <ListFormImportantRow
          label="是否標記為重要"
          checked={isImportant}
          onCheckedChange={setIsImportant}
          className="border-neutral-900"
        />
      ) : (
        <ListFormImportantRow
          label="是否已完成"
          checked={status === 'completed'}
          onCheckedChange={(checked) =>
            setStatus(checked ? 'completed' : 'pending')
          }
          className="border-neutral-900"
        />
      )}
      <ListFormNoteRow
        label="備註"
        textareaProps={{
          id: `${entry.id}-description`,
          value: note,
          onChange: (event) => setNote(event.target.value),
        }}
        onClear={() => setNote('')}
        className="border-b-0"
      />
    </div>
  );

  return (
    <DataFormCard
      title={title}
      className={cardClassName}
      toneClassName={toneClassName}
      contentClassName="px-0 py-0"
    >
      <DataFormCard.Content>
        <div className="flex flex-col text-neutral-900">
          {showVoiceInput ? (
            <VoiceFormSection
              title="任務"
              onClose={onClose}
              onVoiceFinish={({ transcript }) =>
                handleCareLogVoiceFinish({
                  transcript,
                  groupMembers,
                  setters: {
                    setTitleValue: (value: string) =>
                      setTitleValue('title', value, { shouldValidate: true }),
                    setDateValue,
                    setTimeValue,
                    setRepeatPattern,
                    setNote,
                    setParticipantIds,
                    setIsImportant,
                  },
                })
              }
            >
              {formFields}
            </VoiceFormSection>
          ) : (
            <>
              <div className="flex justify-end px-4 pt-4">
                <button
                  type="button"
                  aria-label={`關閉${title}`}
                  className="inline-flex size-6 items-center justify-center rounded-full text-neutral-900"
                  onClick={onClose}
                >
                  <X className="size-4" strokeWidth={3} />
                </button>
              </div>
              {formFields}
            </>
          )}
        </div>
      </DataFormCard.Content>

      <DataFormCard.Footer>
        {footerMode === 'submitOnly' ? (
          <RoundedButtonPrimary
            onClick={handleSubmit}
            className="font-label-md active:bg-primary-dark w-full border-neutral-900 bg-neutral-900 text-neutral-50 disabled:border-neutral-300 disabled:bg-neutral-300 disabled:text-neutral-600 disabled:active:bg-neutral-300"
            disabled={isSubmitDisabled}
          >
            {submitLabel}
          </RoundedButtonPrimary>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <RoundedButtonSecondary
              onClick={onClose}
              className="min-w-0 border-neutral-50 bg-transparent py-2 text-neutral-50"
            >
              捨棄變更
            </RoundedButtonSecondary>
            <RoundedButtonPrimary
              onClick={handleSubmit}
              className="bg-primary-default font-label-md active:bg-primary-dark min-w-0 border-neutral-900 text-neutral-900 disabled:border-neutral-300 disabled:bg-neutral-300 disabled:text-neutral-600 disabled:active:bg-neutral-300"
              disabled={isSubmitDisabled}
            >
              {submitLabel}
            </RoundedButtonPrimary>
          </div>
        )}
      </DataFormCard.Footer>
    </DataFormCard>
  );
}

export default CareLogFormCard;

import { useEffect, useState } from 'react';

import { format, parse, parseISO } from 'date-fns';

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
import VoiceCTA from '@/components/common/voiceCTA';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';
import type { CareLogEntry } from '@/pages/CareLog/types';
import type { GroupMember } from '@/types/group';

type CareLogFormCardProps = {
  entry: CareLogEntry;
  title: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (entry: CareLogEntry) => void | Promise<void>;
  onVoiceInput?: () => void;
  isSubmitting?: boolean;
  cardClassName?: string;
  toneClassName?: string;
  footerMode?: 'default' | 'submitOnly';
  groupMembers?: GroupMember[];
};

function CareLogFormCard({
  entry,
  title,
  submitLabel,
  onClose,
  onSubmit,
  onVoiceInput,
  isSubmitting = false,
  cardClassName = 'bg-neutral-800',
  toneClassName = '-mt-0.5 bg-neutral-800 text-neutral-50',
  footerMode = 'default',
  groupMembers = [],
}: CareLogFormCardProps) {
  const [titleValue, setTitleValue] = useState(entry.title);
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [repeatPattern, setRepeatPattern] = useState<RepeatPatternValue>(
    entry.repeatPattern ?? 'none',
  );
  const [isImportant, setIsImportant] = useState(entry.isImportant ?? false);
  const [note, setNote] = useState(entry.description);
  const [showRecordingDrawer, setShowRecordingDrawer] = useState(false);
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

    setTitleValue(entry.title);
    setDateValue(format(startedAt, 'yyyy/MM/dd'));
    setTimeValue(format(startedAt, 'HH:mm'));
    setRepeatPattern(entry.repeatPattern ?? 'none');
    setIsImportant(entry.isImportant ?? false);
    setNote(entry.description);
    setParticipantIds(entry.participants.map((p) => p.id));
  }, [entry]);

  const isSubmitDisabled =
    isSubmitting ||
    titleValue.trim().length === 0 ||
    dateValue.trim().length === 0 ||
    timeValue.trim().length === 0;

  const handleSubmit = () => {
    if (isSubmitDisabled) return;

    const parsedStartsAt = parse(
      `${dateValue} ${timeValue}`,
      'yyyy/MM/dd HH:mm',
      parseISO(entry.startsAt),
    );

    const selectedParticipants = memberOptions.filter((m) =>
      participantIds.includes(m.id),
    );

    onSubmit({
      ...entry,
      title: titleValue,
      description: note,
      startsAt: format(parsedStartsAt, "yyyy-MM-dd'T'HH:mm:ssxxx"),
      isImportant,
      repeatPattern: repeatPattern ?? 'none',
      participants: selectedParticipants.map((m) => ({
        id: m.id,
        name: m.name,
        src: m.avatar,
      })),
    });
  };

  return (
    <>
      <DataFormCard
        title={title}
        className={cardClassName}
        toneClassName={toneClassName}
        contentClassName="px-0 py-0"
      >
        <DataFormCard.Content>
          <div className="flex flex-col text-neutral-900">
            <VoiceCTA
              title="日誌"
              onClose={onClose}
              onInputClick={() => {
                if (onVoiceInput) {
                  onClose();
                  onVoiceInput();
                  return;
                }

                setShowRecordingDrawer(true);
              }}
            />

            <div className="px-4 py-2">
              <ListFormInputRow
                label="日誌名稱"
                inputProps={{
                  id: `${entry.id}-title`,
                  value: titleValue,
                  onChange: (event) => setTitleValue(event.target.value),
                }}
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
                className="border-neutral-900"
              />
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
              <ListFormImportantRow
                label="是否標記為重要"
                checked={isImportant}
                onCheckedChange={setIsImportant}
                className="border-neutral-900"
              />
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

      <RecordingDrawer
        open={showRecordingDrawer}
        onOpenChange={setShowRecordingDrawer}
        onFinish={() => setShowRecordingDrawer(false)}
      />
    </>
  );
}

export default CareLogFormCard;

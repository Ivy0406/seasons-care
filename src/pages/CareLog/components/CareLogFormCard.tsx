import { useEffect, useState } from 'react';

import { format, parse, parseISO } from 'date-fns';
import { ChevronRight } from 'lucide-react';

import DataFormCard from '@/components/common/DataFormCard';
import {
  ListFormDateTimeRow,
  ListFormImportantRow,
  ListFormInputRow,
  ListFormNoteRow,
  ListFormRow,
  ListFormRepeatRow,
  type RepeatPatternValue,
} from '@/components/common/ListFormRows';
import {
  RoundedButtonPrimary,
  RoundedButtonSecondary,
} from '@/components/common/RoundedButtons';
import SingleAvatar from '@/components/common/SingleAvatar';
import VoiceCTA from '@/components/common/voiceCTA';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';
import type { CareLogEntry } from '@/pages/CareLog/types';

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

  useEffect(() => {
    const startedAt = parseISO(entry.startsAt);

    setTitleValue(entry.title);
    setDateValue(format(startedAt, 'yyyy/MM/dd'));
    setTimeValue(format(startedAt, 'HH:mm'));
    setRepeatPattern(entry.repeatPattern ?? 'none');
    setIsImportant(entry.isImportant ?? false);
    setNote(entry.description);
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

    onSubmit({
      ...entry,
      title: titleValue,
      description: note,
      startsAt: format(parsedStartsAt, "yyyy-MM-dd'T'HH:mm:ssxxx"),
      isImportant,
      repeatPattern: repeatPattern ?? 'none',
    });
  };

  return (
    <>
      <DataFormCard
        title={title}
        className={cardClassName}
        toneClassName={toneClassName}
        contentClassName="overflow-hidden px-0 py-0"
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
              <ListFormRow
                label="參與者"
                htmlFor={`${entry.id}-participants`}
                className="border-neutral-900"
              >
                <div
                  id={`${entry.id}-participants`}
                  className="flex items-center gap-2 text-neutral-900"
                >
                  <div className="flex items-center gap-2">
                    {entry.participants.map((participant) => (
                      <SingleAvatar
                        key={participant.id}
                        src={participant.src}
                        name={participant.name}
                        className="size-7 ring-1"
                      />
                    ))}
                  </div>
                  <ChevronRight className="size-4 shrink-0" strokeWidth={2.4} />
                </div>
              </ListFormRow>
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

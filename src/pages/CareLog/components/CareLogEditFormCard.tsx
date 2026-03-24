import { useEffect, useState } from 'react';

import { format, parse, parseISO } from 'date-fns';
import { ChevronRight, Sparkles, X } from 'lucide-react';

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
import type { CareLogEntry } from '@/pages/CareLog/data/mockCareLogEntries';

type CareLogEditFormCardProps = {
  entry: CareLogEntry;
  onClose: () => void;
  onSubmit: (entry: CareLogEntry) => void;
};

function CareLogEditFormCard({
  entry,
  onClose,
  onSubmit,
}: CareLogEditFormCardProps) {
  const [title, setTitle] = useState(entry.title);
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [repeatPattern, setRepeatPattern] = useState<RepeatPatternValue>(
    entry.repeatPattern ?? 'none',
  );
  const [isImportant, setIsImportant] = useState(entry.isImportant ?? false);
  const [note, setNote] = useState(entry.description);

  useEffect(() => {
    const startedAt = parseISO(entry.startsAt);

    setTitle(entry.title);
    setDateValue(format(startedAt, 'yyyy/MM/dd'));
    setTimeValue(format(startedAt, 'HH:mm'));
    setRepeatPattern(entry.repeatPattern ?? 'none');
    setIsImportant(entry.isImportant ?? false);
    setNote(entry.description);
  }, [entry]);

  const handleSubmit = () => {
    const parsedStartsAt = parse(
      `${dateValue} ${timeValue}`,
      'yyyy/MM/dd HH:mm',
      parseISO(entry.startsAt),
    );

    onSubmit({
      ...entry,
      title,
      description: note,
      startsAt: format(parsedStartsAt, "yyyy-MM-dd'T'HH:mm:ssxxx"),
      isImportant,
      repeatPattern: repeatPattern ?? 'none',
    });
  };

  return (
    <DataFormCard
      title="編輯日誌"
      className="bg-neutral-800"
      toneClassName="-mt-0.5 bg-neutral-800 text-neutral-50"
      contentClassName="overflow-hidden px-0 py-0"
    >
      <DataFormCard.Content>
        <div className="flex flex-col text-neutral-900">
          <div className="flex justify-end px-4 pt-4 pb-3">
            <button
              type="button"
              aria-label="關閉編輯日誌"
              className="inline-flex size-6 items-center justify-center rounded-full text-neutral-900"
              onClick={onClose}
            >
              <X className="size-4" strokeWidth={3} />
            </button>
          </div>

          <div className="bg-secondary-default border-y-2 border-neutral-900 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 shrink-0" strokeWidth={2.2} />
                <p className="font-label-md text-neutral-900">
                  立即試用語音輸入記帳！
                </p>
              </div>
              <button
                type="button"
                className="font-label-md inline-flex h-10 min-w-24 items-center justify-center rounded-full bg-neutral-800 px-4 text-neutral-50"
              >
                輸入
              </button>
            </div>
          </div>

          <div className="px-4 py-2">
            <ListFormInputRow
              label="日誌名稱"
              inputProps={{
                id: `${entry.id}-title`,
                value: title,
                onChange: (event) => setTitle(event.target.value),
              }}
              className="border-neutral-900"
            />
            <ListFormDateTimeRow
              label="時間"
              dateValue={dateValue}
              timeValue={timeValue}
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
        <div className="grid grid-cols-2 gap-4">
          <RoundedButtonSecondary
            onClick={onClose}
            className="min-w-0 border-neutral-50 bg-transparent py-2 text-neutral-50"
          >
            捨棄變更
          </RoundedButtonSecondary>
          <RoundedButtonPrimary
            onClick={handleSubmit}
            className="bg-primary-default font-label-md active:bg-primary-dark min-w-0 border-neutral-900 text-neutral-900"
          >
            更新日誌
          </RoundedButtonPrimary>
        </div>
      </DataFormCard.Footer>
    </DataFormCard>
  );
}

export default CareLogEditFormCard;

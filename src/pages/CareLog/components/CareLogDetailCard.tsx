import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { X } from 'lucide-react';

import DataFormCard from '@/components/common/DataFormCard';
import {
  RoundedButtonPrimary,
  RoundedButtonSecondary,
} from '@/components/common/RoundedButtons';
import SingleAvatar from '@/components/common/SingleAvatar';
import type { CareLogEntry } from '@/pages/CareLog/types';

type CareLogDetailCardProps = {
  entry: CareLogEntry;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
};

function CareLogDetailCard({
  entry,
  onClose,
  onDelete,
  onEdit,
}: CareLogDetailCardProps) {
  const startedAt = parseISO(entry.startsAt);
  const statusLabel = entry.status === 'completed' ? '已完成' : '進行中';
  const statusToneClassName =
    entry.status === 'completed'
      ? 'bg-primary-default'
      : 'bg-secondary-default';

  return (
    <DataFormCard
      title="任務"
      className="bg-neutral-800"
      toneClassName="-mt-0.5 text-neutral-50 bg-neutral-800"
      contentClassName="px-4 py-4"
    >
      <DataFormCard.Content>
        <div className="flex flex-col text-neutral-900">
          <div className="flex justify-end">
            <button
              type="button"
              aria-label="關閉任務詳情"
              className="inline-flex size-6 items-center justify-center rounded-full text-neutral-900"
              onClick={onClose}
            >
              <X className="size-4" strokeWidth={3} />
            </button>
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-1 py-0.5">
              <span
                className={`size-3 rounded-full ${statusToneClassName}`}
                aria-hidden="true"
              />
              <p className="font-label-sm">{statusLabel}</p>
            </div>
            <p className="font-paragraph-md text-neutral-900">
              <span>{format(startedAt, 'yyyy/MM/dd', { locale: zhTW })}</span>
              <span className="ml-2">
                {format(startedAt, 'HH:mm', { locale: zhTW })}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-heading-md">{entry.title}</h3>
            {entry.isImportant ? (
              <div className="bg-primary-default inline-flex w-fit px-2 py-1">
                <p className="font-label-sm leading-5 tracking-[0.01em] text-neutral-900">
                  重要任務
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex gap-3 pt-3">
            <p className="font-paragraph-md text-nowrap">參與人</p>
            <div className="flex flex-wrap gap-3">
              {entry.participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-2">
                  <SingleAvatar
                    src={participant.src}
                    name={participant.name}
                    className="size-7 ring-1"
                  />
                  <span className="font-paragraph-sm">{participant.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="my-3 border-t-2 border-neutral-900" />

          <p className="font-paragraph-md leading-6 text-neutral-900">
            {entry.description}
          </p>
        </div>
      </DataFormCard.Content>

      <DataFormCard.Footer>
        <div className="grid grid-cols-2 gap-4">
          <RoundedButtonSecondary
            onClick={onDelete}
            className="min-w-0 border-neutral-50 bg-transparent text-neutral-50"
          >
            刪除任務
          </RoundedButtonSecondary>
          <RoundedButtonPrimary
            onClick={onEdit}
            className="bg-primary-default min-w-0 border-neutral-900 text-neutral-900"
          >
            編輯任務
          </RoundedButtonPrimary>
        </div>
      </DataFormCard.Footer>
    </DataFormCard>
  );
}

export default CareLogDetailCard;

import { useMemo, useState } from 'react';

import { isSameDay, parseISO } from 'date-fns';
import { Plus } from 'lucide-react';

import DiaryCard, { type DiaryCardItem } from '@/components/common/DiaryCard';
import DiaryCardActionLayer from '@/features/calendar/components/DiaryCardActionLayer';
import useDiaryCardActions from '@/features/calendar/useDiaryCardActions';
import CreateCareLogDialog from '@/pages/CareLog/components/CreateCareLogDialog';
import useDeleteCareLogEntry from '@/pages/CareLog/hooks/useDeleteCareLogEntry';
import useGetCareLogEntries from '@/pages/CareLog/hooks/useGetCareLogEntries';
import useUpdateCareLogEntry from '@/pages/CareLog/hooks/useUpdateCareLogEntry';
import type { CareLogEntry } from '@/pages/CareLog/types';
import createDraftCareLogEntry from '@/pages/CareLog/utils/createDraftCareLogEntry';

type StatusGroup = '進行中' | '未完成' | '已完成';

function getStatusText(card: DiaryCardItem): StatusGroup {
  if (card.status === 'completed') return '已完成';
  if (parseISO(card.startsAt).getTime() <= Date.now()) return '進行中';
  return '未完成';
}

const STATUS_ORDER: StatusGroup[] = ['進行中', '未完成', '已完成'];

function groupByStatus(
  cards: DiaryCardItem[],
): Record<StatusGroup, DiaryCardItem[]> {
  return cards.reduce(
    (totalCards, card) => {
      const status = getStatusText(card);
      totalCards[status].push(card);
      return totalCards;
    },
    { 進行中: [], 未完成: [], 已完成: [] } as Record<
      StatusGroup,
      DiaryCardItem[]
    >,
  );
}

function DiarySummary({ selectedDate }: { selectedDate: Date }) {
  const [creatingEntry, setCreatingEntry] = useState<CareLogEntry | null>(null);
  const { entries, refetchEntries } = useGetCareLogEntries();
  const { isLoading: isUpdatingEntry, handleUpdateCareLogEntry } =
    useUpdateCareLogEntry();
  const { isLoading: isDeletingEntry, handleDeleteCareLogEntry } =
    useDeleteCareLogEntry();
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) =>
      isSameDay(parseISO(entry.startsAt), selectedDate),
    );
  }, [entries, selectedDate]);
  const grouped = useMemo(() => {
    return groupByStatus(filteredEntries);
  }, [filteredEntries]);
  const hasEntries = filteredEntries.length > 0;
  const diaryCardActions = useDiaryCardActions({
    items: filteredEntries,
    isUpdatingEntry,
    isDeletingEntry,
    onUpdateEntry: async (updatedEntry) => {
      const persistedEntry = await handleUpdateCareLogEntry(updatedEntry);

      if (persistedEntry === null) {
        return false;
      }

      await refetchEntries();
      return true;
    },
    onDeleteEntry: async (entryId) => {
      const didDelete = await handleDeleteCareLogEntry(entryId);

      if (!didDelete) {
        return false;
      }

      const nextEntries = await refetchEntries();
      return !nextEntries.some((entry) => entry.id === entryId);
    },
  });
  const openCreateEntry = () => {
    setCreatingEntry(createDraftCareLogEntry(selectedDate));
  };

  return (
    <section>
      <div className="rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 pt-5 pb-3">
        {hasEntries ? (
          STATUS_ORDER.map((status) => {
            const cards = grouped[status];
            if (cards.length === 0) return null;
            return (
              <div key={status} className="mb-3">
                <p className="font-label-md mb-3 text-neutral-700">{status}</p>
                {cards.map((item) => (
                  <DiaryCard
                    key={item.id}
                    item={item}
                    className="mb-3"
                    isStatusUpdating={isUpdatingEntry}
                    onClick={() => diaryCardActions.openDetail(item.id)}
                    onMoreClick={() => diaryCardActions.openActions(item.id)}
                    onStatusChange={async (checked) => {
                      const persistedEntry = await handleUpdateCareLogEntry({
                        ...item,
                        status: checked ? 'completed' : 'pending',
                      });

                      if (persistedEntry === null) {
                        return false;
                      }

                      await refetchEntries();
                      return true;
                    }}
                  />
                ))}
              </div>
            );
          })
        ) : (
          <button
            type="button"
            onClick={openCreateEntry}
            className="flex w-full flex-col items-center justify-center gap-5 rounded-md bg-neutral-100 px-4 py-10 text-center text-neutral-700"
          >
            <p className="font-paragraph-md">當日尚未有紀錄，快來新增吧！</p>
            <span className="flex items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-800 text-neutral-50">
              <Plus className="size-6" strokeWidth={2} />
            </span>
          </button>
        )}
      </div>
      <DiaryCardActionLayer actions={diaryCardActions} />

      <CreateCareLogDialog
        entry={creatingEntry}
        onClose={() => setCreatingEntry(null)}
        onCreated={async () => {
          await refetchEntries();
        }}
      />
    </section>
  );
}

export default DiarySummary;

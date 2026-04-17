import { useMemo } from 'react';

import { isSameDay, parseISO } from 'date-fns';

import DiaryCard, { type DiaryCardItem } from '@/components/common/DiaryCard';
import DiaryCardActionLayer from '@/features/calendar/components/DiaryCardActionLayer';
import useDiaryCardActions from '@/features/calendar/useDiaryCardActions';
import useGetEventSeries from '@/features/calendar/hooks/useGetEventSeries';
import toEventSeriesEntries from '@/features/calendar/utils/eventSeriesEntries';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import CareLogEmptyState from '@/pages/CareLog/components/CareLogEmptyState';
import useDeleteCareLogEntry from '@/pages/CareLog/hooks/useDeleteCareLogEntry';
import useGetCareLogEntries from '@/pages/CareLog/hooks/useGetCareLogEntries';
import useUpdateCareLogEntry from '@/pages/CareLog/hooks/useUpdateCareLogEntry';

type StatusGroup = '進行中' | '未完成' | '已完成';
type DiarySummaryProps = {
  selectedDate: Date;
  onCreateEntry: () => void;
};

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

function DiarySummary({ selectedDate, onCreateEntry }: DiarySummaryProps) {
  const { entries, refetchEntries } = useGetCareLogEntries();
  const { eventSeries } = useGetEventSeries();
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId ?? '');
  const { isLoading: isUpdatingEntry, handleUpdateCareLogEntry } =
    useUpdateCareLogEntry();
  const { isLoading: isDeletingEntry, handleDeleteCareLogEntry } =
    useDeleteCareLogEntry();
  const filteredEntries = useMemo(() => {
    const recurringEntries = toEventSeriesEntries(
      eventSeries,
      selectedDate,
      groupMembers,
    );
    return [...entries, ...recurringEntries].filter((entry) =>
      isSameDay(parseISO(entry.startsAt), selectedDate),
    );
  }, [entries, eventSeries, groupMembers, selectedDate]);
  const grouped = useMemo(() => {
    return groupByStatus(filteredEntries);
  }, [filteredEntries]);

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

  return (
    <section>
      <div className="rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 pt-5 pb-3">
        {filteredEntries.length === 0 ? (
          <CareLogEmptyState
            message="當日尚未有紀錄，快來新增吧！"
            onCreateEntry={onCreateEntry}
            className="border-0 bg-neutral-100"
          />
        ) : null}
        {STATUS_ORDER.map((status) => {
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
                  isStatusUpdating={
                    item.sourceType === 'event-series' ? true : isUpdatingEntry
                  }
                  onClick={() => diaryCardActions.openDetail(item.id)}
                  onMoreClick={
                    item.sourceType === 'event-series'
                      ? undefined
                      : () => diaryCardActions.openActions(item.id)
                  }
                  onStatusChange={
                    item.sourceType === 'event-series'
                      ? undefined
                      : async (checked) => {
                          const persistedEntry = await handleUpdateCareLogEntry(
                            {
                              ...item,
                              status: checked ? 'completed' : 'pending',
                            },
                          );

                          if (persistedEntry === null) {
                            return false;
                          }

                          await refetchEntries();
                          return true;
                        }
                  }
                />
              ))}
            </div>
          );
        })}
      </div>
      <DiaryCardActionLayer actions={diaryCardActions} />
    </section>
  );
}

export default DiarySummary;

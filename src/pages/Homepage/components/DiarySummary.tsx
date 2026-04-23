import { useMemo } from 'react';

import { isSameDay, parseISO } from 'date-fns';

import DiaryCard, { type DiaryCardItem } from '@/components/common/DiaryCard';
import DiaryCardActionLayer from '@/features/calendar/components/DiaryCardActionLayer';
import useDeleteEventSeries from '@/features/calendar/hooks/useDeleteEventSeries';
import useGetEventSeries from '@/features/calendar/hooks/useGetEventSeries';
import useUpdateEventOccurrence from '@/features/calendar/hooks/useUpdateEventOccurrence';
import useUpdateEventSeries from '@/features/calendar/hooks/useUpdateEventSeries';
import useDiaryCardActions from '@/features/calendar/useDiaryCardActions';
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
  const { eventSeries, refetch: refetchEventSeries } =
    useGetEventSeries(selectedDate);
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId ?? '');
  const { isLoading: isUpdatingCareLog, handleUpdateCareLogEntry } =
    useUpdateCareLogEntry();
  const { isLoading: isUpdatingEventOccurrence, handleUpdateEventOccurrence } =
    useUpdateEventOccurrence();
  const { isLoading: isUpdatingEventSeries, handleUpdateEventSeries } =
    useUpdateEventSeries();
  const { isLoading: isDeletingCareLog, handleDeleteCareLogEntry } =
    useDeleteCareLogEntry();
  const { isLoading: isDeletingEventSeries, handleDeleteEventSeries } =
    useDeleteEventSeries();
  const filteredEntries = useMemo(() => {
    const recurringEntries = toEventSeriesEntries(
      eventSeries,
      selectedDate,
      groupMembers,
    );
    return [...entries, ...recurringEntries]
      .filter((entry) => isSameDay(parseISO(entry.startsAt), selectedDate))
      .sort(
        (a, b) =>
          parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime(),
      );
  }, [entries, eventSeries, groupMembers, selectedDate]);
  const grouped = useMemo(() => {
    return groupByStatus(filteredEntries);
  }, [filteredEntries]);

  const diaryCardActions = useDiaryCardActions({
    items: filteredEntries,
    isUpdatingEntry:
      isUpdatingCareLog || isUpdatingEventOccurrence || isUpdatingEventSeries,
    isDeletingEntry: isDeletingCareLog || isDeletingEventSeries,
    onUpdateEntry: async (updatedEntry, editMode) => {
      if (
        updatedEntry.sourceType === 'event-series' &&
        editMode === 'recurring-occurrence'
      ) {
        const persistedEntry = await handleUpdateEventOccurrence(updatedEntry);

        if (persistedEntry === null) {
          return false;
        }

        await refetchEventSeries();
        return true;
      }

      if (updatedEntry.sourceType === 'event-series') {
        const persistedEntry = await handleUpdateEventSeries(updatedEntry);

        if (persistedEntry === null) {
          return false;
        }

        await refetchEventSeries();
        return true;
      }

      const persistedEntry = await handleUpdateCareLogEntry(updatedEntry);

      if (persistedEntry === null) {
        return false;
      }

      await refetchEntries();
      return true;
    },
    onDeleteEntry: async (entryId) => {
      const targetEntry = filteredEntries.find((entry) => entry.id === entryId);

      if (targetEntry?.sourceType === 'event-series') {
        if (!targetEntry.sourceId) {
          return false;
        }

        const didDelete = await handleDeleteEventSeries(targetEntry.sourceId);

        if (!didDelete) {
          return false;
        }

        await refetchEventSeries();
        return true;
      }

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
                    isUpdatingCareLog ||
                    isUpdatingEventOccurrence ||
                    isUpdatingEventSeries
                  }
                  onClick={() => diaryCardActions.openDetail(item.id)}
                  onMoreClick={
                    item.sourceType === 'event-series'
                      ? undefined
                      : () => diaryCardActions.openActions(item.id)
                  }
                  onStatusChange={async (checked) => {
                    if (item.sourceType === 'event-series') {
                      const persistedEntry = await handleUpdateEventOccurrence({
                        ...item,
                        status: checked ? 'completed' : 'pending',
                      });

                      if (persistedEntry === null) {
                        return false;
                      }

                      await refetchEventSeries();
                      return true;
                    }

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
        })}
      </div>
      <DiaryCardActionLayer actions={diaryCardActions} />
    </section>
  );
}

export default DiarySummary;

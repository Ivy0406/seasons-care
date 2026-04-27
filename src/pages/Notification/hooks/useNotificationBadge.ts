import { useCallback, useMemo } from 'react';

import { addDays, format, isSameDay, parseISO } from 'date-fns';

import useGetEventSeries from '@/features/calendar/hooks/useGetEventSeries';
import toEventSeriesEntries from '@/features/calendar/utils/eventSeriesEntries';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useExpenses from '@/features/money/hooks/useExpenses';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import useGetCareLogEntries from '@/pages/CareLog/hooks/useGetCareLogEntries';

const getStorageKey = (groupId: string) => `notification_snapshot_${groupId}`;

function computeSnapshot(ids: string[]) {
  return [...ids].sort().join(',');
}

function useNotificationBadge() {
  const { currentGroupId } = useCurrentGroupId();
  const { entries } = useGetCareLogEntries();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId ?? '');
  const { eventSeries: thisMonthEventSeries } = useGetEventSeries(new Date());
  const { eventSeries: nextMonthEventSeries } = useGetEventSeries(
    addDays(new Date(), 7),
  );
  const { expenses: thisMonthExpenses } = useExpenses(
    format(new Date(), 'yyyy-MM'),
  );
  const { expenses: nextMonthExpenses } = useExpenses(
    format(addDays(new Date(), 7), 'yyyy-MM'),
  );

  const allExpenses = useMemo(
    () => [
      ...thisMonthExpenses,
      ...nextMonthExpenses.filter(
        (expense) =>
          !thisMonthExpenses.some((existing) => existing.id === expense.id),
      ),
    ],
    [thisMonthExpenses, nextMonthExpenses],
  );

  const recurringEntries = useMemo(
    () => [
      ...toEventSeriesEntries(thisMonthEventSeries, new Date(), groupMembers),
      ...toEventSeriesEntries(
        nextMonthEventSeries,
        addDays(new Date(), 7),
        groupMembers,
      ).filter(
        (entry) =>
          !thisMonthEventSeries.some(
            (eventSeries) =>
              `${eventSeries.eventSeriesId}__${eventSeries.scheduledAt ?? eventSeries.startsAt ?? ''}` ===
              entry.id,
          ),
      ),
    ],
    [groupMembers, nextMonthEventSeries, thisMonthEventSeries],
  );
  const allEntries = useMemo(
    () => [...entries, ...recurringEntries],
    [entries, recurringEntries],
  );

  const currentSnapshot = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    const isTodayImportantEntry = (entry: (typeof allEntries)[number]) =>
      entry.isImportant && isSameDay(parseISO(entry.startsAt), today);

    const isTodaySettledBatch = (
      expense: (typeof allExpenses)[number],
    ): expense is typeof expense & { splitBatchId: string } =>
      expense.splitStatus === 'settled' &&
      !!expense.splitBatchId &&
      expense.updatedAt.replace('Z', '').startsWith(todayStr);

    const pendingImportantEntryIds = allEntries
      .filter(
        (entry) => isTodayImportantEntry(entry) && entry.status === 'pending',
      )
      .map((entry) => entry.id);

    const completedImportantEntryIds = allEntries
      .filter(
        (entry) => isTodayImportantEntry(entry) && entry.status === 'completed',
      )
      .map((entry) => `c_${entry.id}`);

    const todaySplitBatchIds = [
      ...new Set(
        allExpenses
          .filter(isTodaySettledBatch)
          .map((expense) => `s_${expense.splitBatchId}`),
      ),
    ];

    return computeSnapshot([
      ...pendingImportantEntryIds,
      ...completedImportantEntryIds,
      ...todaySplitBatchIds,
    ]);
  }, [allEntries, allExpenses]);

  const storageKey = getStorageKey(currentGroupId ?? '');
  const storedSnapshot = localStorage.getItem(storageKey) ?? '';
  const hasUnread =
    currentSnapshot !== '' && currentSnapshot !== storedSnapshot;

  const markAsRead = useCallback(() => {
    localStorage.setItem(storageKey, currentSnapshot);
  }, [storageKey, currentSnapshot]);

  return { hasUnread, markAsRead };
}

export default useNotificationBadge;

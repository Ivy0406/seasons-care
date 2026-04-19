import { useCallback, useMemo } from 'react';

import { addDays, format, isSameDay, parseISO } from 'date-fns';

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

  const currentSnapshot = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    const pendingIds = entries
      .filter(
        (entry) =>
          entry.isImportant &&
          isSameDay(parseISO(entry.startsAt), today) &&
          entry.status === 'pending',
      )
      .map((entry) => entry.id);

    const completedIds = entries
      .filter(
        (entry) =>
          entry.isImportant &&
          isSameDay(parseISO(entry.startsAt), today) &&
          entry.status === 'completed',
      )
      .map((entry) => `c_${entry.id}`);

    const splitIds = allExpenses
      .filter(
        (expense) =>
          expense.splitStatus === 'settled' &&
          expense.updatedAt.replace('Z', '').startsWith(todayStr),
      )
      .map((expense) => `s_${expense.id}`);

    return computeSnapshot([...pendingIds, ...completedIds, ...splitIds]);
  }, [entries, allExpenses]);

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

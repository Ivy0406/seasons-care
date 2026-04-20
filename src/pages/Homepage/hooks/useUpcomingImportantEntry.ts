import { useMemo } from 'react';

import { isSameDay, parseISO } from 'date-fns';

import useGetEventSeries from '@/features/calendar/hooks/useGetEventSeries';
import toEventSeriesEntries from '@/features/calendar/utils/eventSeriesEntries';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import useGetCareLogEntries from '@/pages/CareLog/hooks/useGetCareLogEntries';
import type { CareLogEntry } from '@/pages/CareLog/types';

function useUpcomingImportantEntry(selectedDate: Date): CareLogEntry | null {
  const { currentGroupId } = useCurrentGroupId();
  const { entries } = useGetCareLogEntries();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId ?? '');
  const { eventSeries } = useGetEventSeries(selectedDate);

  return useMemo(() => {
    const recurringEntries = toEventSeriesEntries(
      eventSeries,
      selectedDate,
      groupMembers,
    );

    const allEntries = [...entries, ...recurringEntries];

    return (
      allEntries
        .filter(
          (entry) =>
            entry.isImportant &&
            entry.status !== 'completed' &&
            isSameDay(parseISO(entry.startsAt), selectedDate) &&
            parseISO(entry.startsAt).getTime() >= Date.now(),
        )
        .sort(
          (a, b) =>
            parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime(),
        )[0] ?? null
    );
  }, [entries, eventSeries, groupMembers, selectedDate]);
}

export default useUpcomingImportantEntry;

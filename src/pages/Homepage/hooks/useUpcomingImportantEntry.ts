import { useMemo } from 'react';

import useGetEventSeries from '@/features/calendar/hooks/useGetEventSeries';
import toEventSeriesEntries from '@/features/calendar/utils/eventSeriesEntries';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import useGetCareLogEntries from '@/pages/CareLog/hooks/useGetCareLogEntries';
import type { CareLogEntry } from '@/pages/CareLog/types';

import getUpcomingImportantEntry from '../utils/getUpcomingImportantEntry';

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

    return getUpcomingImportantEntry(allEntries, selectedDate);
  }, [entries, eventSeries, groupMembers, selectedDate]);
}

export default useUpcomingImportantEntry;

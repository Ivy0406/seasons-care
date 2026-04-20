import { isSameDay, parseISO } from 'date-fns';

import type { CareLogEntry } from '@/pages/CareLog/types';

function getUpcomingImportantEntry(
  entries: CareLogEntry[],
  selectedDate: Date,
): CareLogEntry | null {
  const upcomingEntries = entries
    .map((entry) => ({
      entry,
      startsAt: parseISO(entry.startsAt).getTime(),
    }))
    .filter(
      ({ entry, startsAt }) =>
        entry.isImportant &&
        entry.status !== 'completed' &&
        isSameDay(new Date(startsAt), selectedDate) &&
        startsAt >= Date.now(),
    )
    .sort((a, b) => a.startsAt - b.startsAt);

  return upcomingEntries[0]?.entry ?? null;
}

export default getUpcomingImportantEntry;

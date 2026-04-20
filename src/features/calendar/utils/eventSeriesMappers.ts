import { getDay, parseISO } from 'date-fns';

import type { CareLogEntry } from '@/pages/CareLog/types';
import type { CreateEventSeriesPayload } from '@/types/eventSeries';

const toCreateEventSeriesPayload = (
  entry: CareLogEntry,
  currentUserId?: string | null,
): CreateEventSeriesPayload => {
  const startDate = parseISO(entry.startsAt);
  const participants = Array.from(
    new Set([
      ...entry.participants.map((participant) => participant.id),
      ...(currentUserId ? [currentUserId] : []),
    ]),
  );

  return {
    title: entry.title,
    description: entry.description,
    startsAt: startDate.toISOString(),
    repeatPattern: entry.repeatPattern ?? 'none',
    daysOfWeek: entry.repeatPattern === 'weeklyDay' ? [getDay(startDate)] : [],
    participants,
    isImportant: entry.isImportant ?? false,
  };
};

export default toCreateEventSeriesPayload;

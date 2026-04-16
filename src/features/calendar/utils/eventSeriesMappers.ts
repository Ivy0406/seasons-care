import { addDays, addMonths, addWeeks, getDay, parseISO } from 'date-fns';

import type { CareLogEntry } from '@/pages/CareLog/types';
import type { CreateEventSeriesPayload } from '@/types/eventSeries';

const DEFAULT_EVENT_SERIES_DURATION_MINUTES = 10;
const DEFAULT_EVENT_SERIES_END_TYPE = 0;
const DEFAULT_EVENT_SERIES_OCCURRENCE_COUNT = 0;
const DEFAULT_EVENT_SERIES_REPEAT_INTERVAL = 1;
const DEFAULT_EVENT_SERIES_STATUS = 'active';

function getDefaultEventSeriesEndAt(entry: CareLogEntry) {
  const startDate = parseISO(entry.startsAt);

  if (entry.repeatPattern === 'daily') {
    return addDays(startDate, DEFAULT_EVENT_SERIES_REPEAT_INTERVAL).toISOString();
  }

  if (entry.repeatPattern === 'weeklyDay') {
    return addWeeks(startDate, DEFAULT_EVENT_SERIES_REPEAT_INTERVAL).toISOString();
  }

  if (entry.repeatPattern === 'monthly') {
    return addMonths(startDate, DEFAULT_EVENT_SERIES_REPEAT_INTERVAL).toISOString();
  }

  return startDate.toISOString();
}

const toCreateEventSeriesPayload = (
  entry: CareLogEntry,
  currentUserId?: string | null,
): CreateEventSeriesPayload => {
  const startsAt = new Date(entry.startsAt).toISOString();
  const startDate = parseISO(entry.startsAt);
  const endAt = getDefaultEventSeriesEndAt(entry);
  const participants = Array.from(
    new Set([
      ...entry.participants.map((participant) => participant.id),
      ...(currentUserId ? [currentUserId] : []),
    ]),
  );

  return {
    title: entry.title,
    description: entry.description,
    startsAt,
    durationMinutes: DEFAULT_EVENT_SERIES_DURATION_MINUTES,
    repeatPattern: entry.repeatPattern ?? 'none',
    repeatInterval:
      entry.repeatPattern && entry.repeatPattern !== 'none'
        ? DEFAULT_EVENT_SERIES_REPEAT_INTERVAL
        : 0,
    daysOfWeek: entry.repeatPattern === 'weeklyDay' ? [getDay(startDate)] : [],
    endType: DEFAULT_EVENT_SERIES_END_TYPE,
    endAt,
    occurrenceCount: DEFAULT_EVENT_SERIES_OCCURRENCE_COUNT,
    participants,
    status: DEFAULT_EVENT_SERIES_STATUS,
    isImportant: entry.isImportant ?? false,
  };
};

export default toCreateEventSeriesPayload;

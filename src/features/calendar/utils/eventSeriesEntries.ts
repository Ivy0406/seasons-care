import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  formatISO,
  getDay,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
} from 'date-fns';

import getAvatarSrcByKey from '@/assets/images/avatars';
import type { CareLogEntry } from '@/pages/CareLog/types';
import type { EventSeriesItem } from '@/types/eventSeries';
import type { GroupMember } from '@/types/group';

function toParticipants(
  participantIds: string[],
  groupMembers: GroupMember[],
): CareLogEntry['participants'] {
  return participantIds.map((participantId) => {
    const matchedMember = groupMembers.find(
      (member) => member.userId === participantId,
    );

    return {
      id: participantId,
      name: matchedMember?.username ?? '成員',
      src: matchedMember ? getAvatarSrcByKey(matchedMember.avatarKey) : '',
    };
  });
}

function createEntryFromOccurrence(
  series: EventSeriesItem,
  occurrenceDate: Date,
  groupMembers: GroupMember[],
): CareLogEntry {
  const startsAt = formatISO(occurrenceDate);

  return {
    id: `${series.id}__${startsAt}`,
    sourceId: series.id,
    sourceType: 'event-series',
    title: series.title,
    description: series.description,
    startsAt,
    updatedAt: series.updatedAt,
    repeatPattern: series.repeatPattern,
    participants: toParticipants(series.participants, groupMembers),
    status: 'pending',
    isImportant: series.isImportant,
  };
}

function getOccurrencesForWeeklySeries(
  series: EventSeriesItem,
  month: Date,
  groupMembers: GroupMember[],
): CareLogEntry[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const seriesStart = parseISO(series.startsAt);
  const seriesEnd = parseISO(series.endAt);
  const weekdays =
    series.daysOfWeek.length > 0 ? series.daysOfWeek : [getDay(seriesStart)];

  return eachDayOfInterval({ start: monthStart, end: monthEnd })
    .filter((date) => {
      if (isBefore(date, seriesStart)) return false;
      if (isAfter(date, seriesEnd)) return false;
      if (!weekdays.includes(getDay(date))) return false;

      const diffDays = Math.floor(
        (date.getTime() - seriesStart.getTime()) / (1000 * 60 * 60 * 24),
      );
      const weekIndex = Math.floor(diffDays / 7);

      return weekIndex % Math.max(series.repeatInterval, 1) === 0;
    })
    .map((date) => createEntryFromOccurrence(series, date, groupMembers));
}

function getOccurrencesForIntervalSeries(
  series: EventSeriesItem,
  month: Date,
  groupMembers: GroupMember[],
): CareLogEntry[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const seriesStart = parseISO(series.startsAt);
  const seriesEnd = parseISO(series.endAt);
  const occurrences: CareLogEntry[] = [];
  let cursor = seriesStart;

  while (!isAfter(cursor, seriesEnd)) {
    if (!isBefore(cursor, monthStart) && !isAfter(cursor, monthEnd)) {
      occurrences.push(createEntryFromOccurrence(series, cursor, groupMembers));
    }

    if (series.repeatPattern === 'daily') {
      cursor = addDays(cursor, Math.max(series.repeatInterval, 1));
    } else if (series.repeatPattern === 'monthly') {
      cursor = addMonths(cursor, Math.max(series.repeatInterval, 1));
    } else {
      break;
    }
  }

  return occurrences;
}

function toEventSeriesEntries(
  items: EventSeriesItem[],
  month: Date,
  groupMembers: GroupMember[] = [],
): CareLogEntry[] {
  return items.flatMap((item) => {
    if (item.repeatPattern === 'weeklyDay') {
      return getOccurrencesForWeeklySeries(item, month, groupMembers);
    }

    if (item.repeatPattern === 'daily' || item.repeatPattern === 'monthly') {
      return getOccurrencesForIntervalSeries(item, month, groupMembers);
    }

    return [
      createEntryFromOccurrence(item, parseISO(item.startsAt), groupMembers),
    ];
  });
}

export default toEventSeriesEntries;

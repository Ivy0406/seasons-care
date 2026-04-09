import type { CareLogEntry } from '@/pages/CareLog/types';
import type { CareLogApiItem, CreateCareLogPayload } from '@/types/careLog';

const toCreateCareLogPayload = (
  entry: CareLogEntry,
  currentUserId: string,
): CreateCareLogPayload => {
  const payload: CreateCareLogPayload = {
    title: entry.title,
    description: entry.description,
    startsAt: new Date(entry.startsAt).toISOString(),
    repeatPattern: entry.repeatPattern ?? 'none',
    participants: [currentUserId],
    status: entry.status,
    isImportant: entry.isImportant ?? false,
  };

  return payload;
};

function toCareLogStatus(
  status: CareLogApiItem['status'],
  fallbackStatus: CareLogEntry['status'] = 'pending',
) {
  if (status === 'pending' || status === 'completed') {
    return status;
  }

  return fallbackStatus;
}

const toCareLogEntry = (
  item: CareLogApiItem,
  fallbackEntry?: CareLogEntry,
): CareLogEntry => ({
  id: item.id,
  title: item.title,
  description:
    item.description ?? item.content ?? fallbackEntry?.description ?? '',
  startsAt:
    item.startsAt ??
    item.recordDate ??
    fallbackEntry?.startsAt ??
    new Date().toISOString(),
  repeatPattern: item.repeatPattern ?? fallbackEntry?.repeatPattern ?? 'none',
  participants: fallbackEntry?.participants ?? [],
  status: toCareLogStatus(item.status, fallbackEntry?.status),
  isImportant: item.isImportant ?? fallbackEntry?.isImportant ?? false,
});

const toCareLogEntries = (items: CareLogApiItem[]) =>
  items.map((item) => toCareLogEntry(item));

export { toCreateCareLogPayload, toCareLogEntry, toCareLogEntries };

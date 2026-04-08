import type { CareLogEntry } from '@/pages/CareLog/types';
import type { CareLogApiItem, CreateCareLogPayload } from '@/types/careLog';

const toCreateCareLogPayload = (entry: CareLogEntry): CreateCareLogPayload => ({
  title: entry.title,
  content: entry.description,
  logType: 'diary',
  recordDate: entry.startsAt,
});

const toCareLogEntry = (
  item: CareLogApiItem,
  fallbackEntry?: CareLogEntry,
): CareLogEntry => ({
  id: item.id,
  title: item.title,
  description: item.content,
  startsAt: item.recordDate,
  repeatPattern: fallbackEntry?.repeatPattern ?? 'none',
  participants: fallbackEntry?.participants ?? [],
  status: fallbackEntry?.status ?? 'pending',
  isImportant: fallbackEntry?.isImportant ?? false,
});

const toCareLogEntries = (items: CareLogApiItem[]) =>
  items.map((item) => toCareLogEntry(item));

export { toCreateCareLogPayload, toCareLogEntry, toCareLogEntries };

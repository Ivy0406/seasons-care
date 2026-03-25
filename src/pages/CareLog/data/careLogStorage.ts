import type { CareLogEntry } from '@/pages/CareLog/data/mockCareLogEntries';
import mockCareLogEntries from '@/pages/CareLog/data/mockCareLogEntries';

const CARE_LOG_STORAGE_KEY = 'seasons-care:care-log-entries';

function cloneCareLogEntries(entries: CareLogEntry[]) {
  return entries.map((entry) => ({
    ...entry,
    participants: entry.participants.map((participant) => ({ ...participant })),
  }));
}

function getFallbackCareLogEntries() {
  return cloneCareLogEntries(mockCareLogEntries);
}

function getStoredCareLogEntries() {
  if (typeof window === 'undefined') {
    return getFallbackCareLogEntries();
  }

  const rawValue = window.localStorage.getItem(CARE_LOG_STORAGE_KEY);

  if (rawValue === null) {
    const fallbackEntries = getFallbackCareLogEntries();

    window.localStorage.setItem(
      CARE_LOG_STORAGE_KEY,
      JSON.stringify(fallbackEntries),
    );

    return fallbackEntries;
  }

  try {
    const parsedEntries = JSON.parse(rawValue) as CareLogEntry[];

    return cloneCareLogEntries(parsedEntries);
  } catch {
    const fallbackEntries = getFallbackCareLogEntries();

    window.localStorage.setItem(
      CARE_LOG_STORAGE_KEY,
      JSON.stringify(fallbackEntries),
    );

    return fallbackEntries;
  }
}

function saveCareLogEntries(entries: CareLogEntry[]) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(CARE_LOG_STORAGE_KEY, JSON.stringify(entries));
}

export { getStoredCareLogEntries, saveCareLogEntries };

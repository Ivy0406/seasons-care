import type {
  HealthData,
  HealthDraft,
  HealthRecord,
} from '@/features/health/types';
import { getHealthDraftMetricValue } from '@/features/voice/services/healthParser';

const HEALTH_STORAGE_KEY = 'seasons-care:health-records';

const fallbackHealthRecords: HealthRecord[] = [
  {
    id: 'health-record-1',
    recordedAt: '2026-01-12T10:00:00.000Z',
    summary:
      '下午已完成血壓測量，數值偏高，建議傍晚減少咖啡因攝取。今日復健進度已達成 80%，再加油一點點！',
    transcript: '',
    bloodPressure: {
      systolic: 142,
      diastolic: 92,
    },
    temperature: 36.5,
    bloodOxygen: 98,
    weight: 70.1,
    bloodSugar: 155,
  },
];

function cloneHealthRecord(record: HealthRecord): HealthRecord {
  return {
    ...record,
    bloodPressure: {
      ...record.bloodPressure,
    },
  };
}

function cloneHealthRecords(records: HealthRecord[]) {
  return records.map(cloneHealthRecord);
}

function getFallbackHealthRecords() {
  return cloneHealthRecords(fallbackHealthRecords);
}

function getStoredHealthRecords() {
  if (typeof window === 'undefined') {
    return getFallbackHealthRecords();
  }

  const rawValue = window.localStorage.getItem(HEALTH_STORAGE_KEY);

  if (rawValue === null) {
    const fallbackRecords = getFallbackHealthRecords();

    window.localStorage.setItem(
      HEALTH_STORAGE_KEY,
      JSON.stringify(fallbackRecords),
    );

    return fallbackRecords;
  }

  try {
    const parsedRecords = JSON.parse(rawValue) as HealthRecord[];

    return cloneHealthRecords(parsedRecords);
  } catch {
    const fallbackRecords = getFallbackHealthRecords();

    window.localStorage.setItem(
      HEALTH_STORAGE_KEY,
      JSON.stringify(fallbackRecords),
    );

    return fallbackRecords;
  }
}

function saveHealthRecords(records: HealthRecord[]) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(records));
}

function appendHealthRecord(record: HealthRecord) {
  const records = getStoredHealthRecords();

  saveHealthRecords([record, ...records]);
}

function toHealthMetricValue(value: number | null) {
  return value === null ? '--' : value;
}

function toTimeValue(recordedAt: string) {
  const date = new Date(recordedAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function getHealthDataFromRecord(record: HealthRecord): HealthData {
  return {
    time: toTimeValue(record.recordedAt),
    summary: {
      content: record.summary,
    },
    bloodPressure: {
      systolic: toHealthMetricValue(record.bloodPressure.systolic),
      diastolic: toHealthMetricValue(record.bloodPressure.diastolic),
    },
    temperature: toHealthMetricValue(record.temperature),
    bloodOxygen: toHealthMetricValue(record.bloodOxygen),
    weight: toHealthMetricValue(record.weight),
    bloodSugar: {
      morning: toHealthMetricValue(record.bloodSugar),
      noon: '--',
      night: '--',
    },
  };
}

function getLatestHealthData() {
  const [latestRecord] = getStoredHealthRecords();

  return getHealthDataFromRecord(latestRecord);
}

function getRecordedAtFromDraft({ dateValue, timeValue }: HealthDraft) {
  const isoDate = `${dateValue}T${timeValue}:00`;
  const parsedDate = new Date(isoDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toISOString();
  }

  return parsedDate.toISOString();
}

function createHealthRecordFromDraft(draft: HealthDraft): HealthRecord {
  return {
    id: `health-record-${Date.now()}`,
    recordedAt: getRecordedAtFromDraft(draft),
    summary: draft.summary,
    transcript: draft.transcript,
    bloodPressure: {
      systolic: getHealthDraftMetricValue(draft.systolic),
      diastolic: getHealthDraftMetricValue(draft.diastolic),
    },
    temperature: getHealthDraftMetricValue(draft.temperature),
    bloodOxygen: getHealthDraftMetricValue(draft.bloodOxygen),
    weight: getHealthDraftMetricValue(draft.weight),
    bloodSugar: getHealthDraftMetricValue(draft.bloodSugar),
  };
}

export {
  appendHealthRecord,
  createHealthRecordFromDraft,
  getLatestHealthData,
  getStoredHealthRecords,
};

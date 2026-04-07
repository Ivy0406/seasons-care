import type { HealthDraft } from '@/features/health/types';

function padTimeUnit(value: number) {
  return value.toString().padStart(2, '0');
}

function formatDateValue(date: Date) {
  return `${date.getFullYear()}-${padTimeUnit(date.getMonth() + 1)}-${padTimeUnit(date.getDate())}`;
}

function formatTimeValue(date: Date) {
  return `${padTimeUnit(date.getHours())}:${padTimeUnit(date.getMinutes())}`;
}

function normalizeNumber(value: number | null) {
  return value === null ? '' : `${value}`;
}

function getHealthDraftSummarySource(
  draft: HealthDraft,
): Omit<HealthDraft, 'summary'> {
  return {
    dateValue: draft.dateValue,
    timeValue: draft.timeValue,
    systolic: draft.systolic,
    diastolic: draft.diastolic,
    temperature: draft.temperature,
    bloodOxygen: draft.bloodOxygen,
    weight: draft.weight,
    bloodSugar: draft.bloodSugar,
    transcript: draft.transcript,
  };
}

function buildHealthDraftSummary(draft: Omit<HealthDraft, 'summary'>) {
  const summaryParts: string[] = [];

  if (draft.systolic && draft.diastolic) {
    summaryParts.push(`血壓 ${draft.systolic}/${draft.diastolic} mmHg`);
  }

  if (draft.temperature) {
    summaryParts.push(`體溫 ${draft.temperature}°C`);
  }

  if (draft.bloodOxygen) {
    summaryParts.push(`血氧 ${draft.bloodOxygen}%`);
  }

  if (draft.weight) {
    summaryParts.push(`體重 ${draft.weight} kg`);
  }

  if (draft.bloodSugar) {
    summaryParts.push(`血糖 ${draft.bloodSugar} mg/dL`);
  }

  return summaryParts.length > 0
    ? `已從語音擷取健康數值：${summaryParts.join('、')}。`
    : '已建立語音健康紀錄，請確認欄位後再儲存。';
}

function createEmptyHealthDraft(date = new Date()): HealthDraft {
  return {
    dateValue: formatDateValue(date),
    timeValue: formatTimeValue(date),
    systolic: '',
    diastolic: '',
    temperature: '',
    bloodOxygen: '',
    weight: '',
    bloodSugar: '',
    transcript: '',
    summary: '請先錄音或手動輸入健康數值。',
  };
}

function mergeHealthDraft(
  currentDraft: HealthDraft,
  updates: Partial<HealthDraft>,
): HealthDraft {
  const nextDraft = {
    ...currentDraft,
    ...updates,
  };

  return {
    ...nextDraft,
    summary:
      updates.summary ??
      buildHealthDraftSummary(getHealthDraftSummarySource(nextDraft)),
  };
}

function getHealthDraftMetricValue(value: string) {
  if (value.trim() === '') {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function getHealthDraftDisplayValue(value: number | null) {
  return normalizeNumber(value);
}

export {
  buildHealthDraftSummary,
  createEmptyHealthDraft,
  formatTimeValue,
  getHealthDraftDisplayValue,
  getHealthDraftMetricValue,
  getHealthDraftSummarySource,
  mergeHealthDraft,
};

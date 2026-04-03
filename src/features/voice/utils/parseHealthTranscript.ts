import type { HealthDraft } from '@/features/health/types';

function padTimeUnit(value: number) {
  return value.toString().padStart(2, '0');
}

function formatDateValue(date: Date) {
  return `${date.getFullYear()}/${padTimeUnit(date.getMonth() + 1)}/${padTimeUnit(date.getDate())}`;
}

function formatTimeValue(date: Date) {
  return `${padTimeUnit(date.getHours())}:${padTimeUnit(date.getMinutes())}`;
}

function normalizeNumber(value: number | null) {
  return value === null ? '' : `${value}`;
}

function extractNumberValue(
  transcript: string,
  patterns: RegExp[],
  formatter?: (value: string) => string,
) {
  const matchedValue = patterns
    .map((pattern) => transcript.match(pattern)?.[1])
    .find((value) => value !== undefined);

  if (matchedValue !== undefined) {
    return formatter ? formatter(matchedValue) : matchedValue;
  }

  return '';
}

function extractTimeValue(transcript: string, fallbackDate: Date) {
  const timeMatch =
    transcript.match(
      /(上午|早上|中午|下午|晚上)?\s*(\d{1,2})(?:[:：點時](\d{1,2}))?(?:分)?/,
    ) ?? transcript.match(/(\d{1,2})[:：](\d{1,2})/);

  if (timeMatch === null) {
    return formatTimeValue(fallbackDate);
  }

  const period = timeMatch[1] ?? '';
  const rawHour = Number(timeMatch[2]);
  const rawMinute = Number(timeMatch[3] ?? 0);

  if (Number.isNaN(rawHour) || Number.isNaN(rawMinute)) {
    return formatTimeValue(fallbackDate);
  }

  let hour = rawHour;

  if ((period === '下午' || period === '晚上') && hour < 12) {
    hour += 12;
  }

  if (period === '中午' && hour < 11) {
    hour += 12;
  }

  return `${padTimeUnit(hour)}:${padTimeUnit(rawMinute)}`;
}

function buildSummary(draft: Omit<HealthDraft, 'summary'>) {
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

function getSummarySource(draft: HealthDraft): Omit<HealthDraft, 'summary'> {
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

function parseHealthTranscript(transcript: string): HealthDraft {
  const now = new Date();
  const emptyDraft = createEmptyHealthDraft(now);

  const baseDraft: Omit<HealthDraft, 'summary'> = {
    ...getSummarySource(emptyDraft),
    transcript: transcript.trim(),
    timeValue: extractTimeValue(transcript, now),
    systolic: extractNumberValue(transcript, [
      /血壓(?:是|為)?\s*(\d{2,3})\s*[/／]\s*\d{2,3}/,
      /(?:收縮壓|高壓)(?:是|為)?\s*(\d{2,3})/,
    ]),
    diastolic: extractNumberValue(transcript, [
      /血壓(?:是|為)?\s*\d{2,3}\s*[/／]\s*(\d{2,3})/,
      /(?:舒張壓|低壓)(?:是|為)?\s*(\d{2,3})/,
    ]),
    temperature: extractNumberValue(transcript, [
      /體溫(?:是|為)?\s*(\d{2}(?:\.\d)?)/,
    ]),
    bloodOxygen: extractNumberValue(transcript, [
      /血氧(?:是|為)?\s*(\d{2,3})/,
      /血氧濃度(?:是|為)?\s*(\d{2,3})/,
    ]),
    weight: extractNumberValue(transcript, [
      /體重(?:是|為)?\s*(\d{2,3}(?:\.\d)?)/,
    ]),
    bloodSugar: extractNumberValue(transcript, [
      /血糖(?:是|為)?\s*(\d{2,3}(?:\.\d)?)/,
    ]),
  };

  return {
    ...baseDraft,
    summary: buildSummary(baseDraft),
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
    summary: updates.summary ?? buildSummary(getSummarySource(nextDraft)),
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
  createEmptyHealthDraft,
  getHealthDraftDisplayValue,
  getHealthDraftMetricValue,
  parseHealthTranscript,
  mergeHealthDraft,
};

import type { HealthDraft } from '@/features/health/types';

type HealthExtractionResult = Pick<
  HealthDraft,
  | 'dateValue'
  | 'timeValue'
  | 'systolic'
  | 'diastolic'
  | 'temperature'
  | 'bloodOxygen'
  | 'weight'
  | 'bloodSugar'
  | 'summary'
>;

const HEALTH_EXTRACTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    dateValue: {
      type: 'string',
      description:
        'Date in YYYY/MM/DD format. Return an empty string if not mentioned.',
    },
    timeValue: {
      type: 'string',
      description:
        '24-hour time in HH:MM format. Return an empty string if not mentioned.',
    },
    systolic: {
      type: 'string',
      description:
        'Systolic blood pressure as digits only. Return an empty string if not mentioned.',
    },
    diastolic: {
      type: 'string',
      description:
        'Diastolic blood pressure as digits only. Return an empty string if not mentioned.',
    },
    temperature: {
      type: 'string',
      description:
        'Body temperature, for example 36.5. Return an empty string if not mentioned.',
    },
    bloodOxygen: {
      type: 'string',
      description:
        'Blood oxygen percentage as digits only. Return an empty string if not mentioned.',
    },
    weight: {
      type: 'string',
      description:
        'Weight in kilograms, for example 70.1. Return an empty string if not mentioned.',
    },
    bloodSugar: {
      type: 'string',
      description:
        'Blood sugar value as digits only. Return an empty string if not mentioned.',
    },
    summary: {
      type: 'string',
      description:
        'A one-sentence zh-TW summary of extracted health metrics for caregiver review.',
    },
  },
  required: [
    'dateValue',
    'timeValue',
    'systolic',
    'diastolic',
    'temperature',
    'bloodOxygen',
    'weight',
    'bloodSugar',
    'summary',
  ],
} as const;

const HEALTH_EXTRACTION_PROMPT = `
你是照護語音紀錄抽取器。請從使用者的中文語音轉文字中，擷取健康數值並輸出 JSON。

規則：
1. 只能回傳符合 schema 的 JSON，不要加任何說明文字。
2. 無法確認的欄位請回傳空字串，不要猜。
3. dateValue 格式固定 YYYY/MM/DD。
4. timeValue 格式固定 HH:MM，使用 24 小時制。
5. systolic、diastolic、bloodOxygen、bloodSugar 只回傳數字字串。
6. temperature、weight 回傳可含小數點的數字字串。
7. summary 用繁體中文，簡短描述已抽取到的健康數值。
`;

function isHealthExtractionResult(
  value: unknown,
): value is HealthExtractionResult {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const result = value as Record<string, unknown>;

  return (
    typeof result.dateValue === 'string' &&
    typeof result.timeValue === 'string' &&
    typeof result.systolic === 'string' &&
    typeof result.diastolic === 'string' &&
    typeof result.temperature === 'string' &&
    typeof result.bloodOxygen === 'string' &&
    typeof result.weight === 'string' &&
    typeof result.bloodSugar === 'string' &&
    typeof result.summary === 'string'
  );
}

export {
  HEALTH_EXTRACTION_PROMPT,
  HEALTH_EXTRACTION_SCHEMA,
  isHealthExtractionResult,
};

export type { HealthExtractionResult };

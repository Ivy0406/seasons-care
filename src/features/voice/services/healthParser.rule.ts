import type { HealthDraft } from '@/features/health/types';
import {
  buildHealthDraftSummary,
  createEmptyHealthDraft,
  formatTimeValue,
  getHealthDraftSummarySource,
} from '@/features/voice/services/healthParser.shared';
import type { ParseHealthTranscript } from '@/features/voice/services/healthParser.types';

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

  return `${hour.toString().padStart(2, '0')}:${rawMinute
    .toString()
    .padStart(2, '0')}`;
}

const parseHealthTranscriptWithRule: ParseHealthTranscript = async (
  transcript,
) => {
  const now = new Date();
  const emptyDraft = createEmptyHealthDraft(now);

  const baseDraft: Omit<HealthDraft, 'summary'> = {
    ...getHealthDraftSummarySource(emptyDraft),
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
    summary: buildHealthDraftSummary(baseDraft),
  };
};

export default parseHealthTranscriptWithRule;

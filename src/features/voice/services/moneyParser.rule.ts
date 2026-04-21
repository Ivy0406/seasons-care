import type { MoneyCategoryValue, MoneyDraft } from '@/features/money/types';
import {
  buildMoneyDraftSummary,
  createEmptyMoneyDraft,
  getMoneyDraftSummarySource,
  hasGlobalSplitIntent,
  normalizeMoneyTitleAndNote,
  splitMoneySegments,
} from '@/features/voice/services/moneyParser.shared';
import type { ParseMoneyTranscript } from '@/features/voice/services/moneyParser.types';
import { hasMoneyIntent } from '@/features/voice/services/voiceIntent';

function extractMoneyCategory(transcript: string): MoneyCategoryValue | null {
  if (/醫療|掛號|回診|藥費|檢查|住院/.test(transcript)) {
    return 'medical';
  }

  if (/吃飯|早餐|午餐|晚餐|飲料|餐費|便當/.test(transcript)) {
    return 'food';
  }

  if (/車費|交通|計程車|捷運|公車|高鐵|台鐵/.test(transcript)) {
    return 'traffic';
  }

  if (/支出|花費|買了|購買|採買/.test(transcript)) {
    return 'other';
  }

  return null;
}

function extractMoneyAmount(transcript: string) {
  const matchedAmount =
    transcript.match(/(\d{1,6})(?:\s*元|塊|塊錢|\$)/)?.[1] ??
    transcript.match(/\$\s*(\d{1,6})/)?.[1] ??
    transcript.match(/金額(?:是|為)?\s*(\d{1,6})/)?.[1] ??
    '';

  return matchedAmount;
}

function parseMoneySegment(segment: string): MoneyDraft {
  const emptyDraft = createEmptyMoneyDraft();
  const { title, notes } = normalizeMoneyTitleAndNote('', '', segment);
  const baseDraft: Omit<MoneyDraft, 'summary'> = {
    ...getMoneyDraftSummarySource(emptyDraft),
    transcript: segment,
    title,
    amount: extractMoneyAmount(segment),
    category: extractMoneyCategory(segment),
    needsSplit: /分帳|平分|一起出/.test(segment),
    notes,
  };
  return { ...baseDraft, summary: buildMoneyDraftSummary(baseDraft) };
}

const parseMoneyTranscriptWithRule: ParseMoneyTranscript = async (
  transcript,
) => {
  const normalizedTranscript = transcript.trim();

  if (!hasMoneyIntent(normalizedTranscript)) {
    return [{ ...createEmptyMoneyDraft(), transcript: normalizedTranscript }];
  }

  const segments = splitMoneySegments(normalizedTranscript);
  const globalSplit = hasGlobalSplitIntent(normalizedTranscript);
  return segments.map((segment) => {
    const draft = parseMoneySegment(segment);
    return globalSplit ? { ...draft, needsSplit: true } : draft;
  });
};

export default parseMoneyTranscriptWithRule;

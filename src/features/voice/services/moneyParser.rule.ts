import type { MoneyCategoryValue, MoneyDraft } from '@/features/money/types';
import {
  buildMoneyDraftSummary,
  createEmptyMoneyDraft,
  getMoneyDraftSummarySource,
  normalizeMoneyTitleAndNote,
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

const parseMoneyTranscriptWithRule: ParseMoneyTranscript = async (
  transcript,
) => {
  const emptyDraft = createEmptyMoneyDraft();
  const normalizedTranscript = transcript.trim();

  if (!hasMoneyIntent(normalizedTranscript)) {
    return {
      ...emptyDraft,
      transcript: normalizedTranscript,
    };
  }

  const { title, notes } = normalizeMoneyTitleAndNote(
    '',
    '',
    normalizedTranscript,
  );

  const baseDraft: Omit<MoneyDraft, 'summary'> = {
    ...getMoneyDraftSummarySource(emptyDraft),
    transcript: normalizedTranscript,
    title,
    amount: extractMoneyAmount(normalizedTranscript),
    category: extractMoneyCategory(normalizedTranscript),
    needsSplit: /分帳|平分|一起出/.test(normalizedTranscript),
    notes,
  };

  return {
    ...baseDraft,
    summary: buildMoneyDraftSummary(baseDraft),
  };
};

export default parseMoneyTranscriptWithRule;

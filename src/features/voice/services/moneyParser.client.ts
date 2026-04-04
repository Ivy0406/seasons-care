import {
  fetchMoneyExtractionWithGemini,
  fetchMoneyExtractionWithOpenAI,
} from '@/api/ai';
import type { MoneyDraft } from '@/features/money/types';
import parseMoneyTranscriptWithRule from '@/features/voice/services/moneyParser.rule';
import {
  createEmptyMoneyDraft,
  mergeMoneyDraft,
  normalizeMoneyTitleAndNote,
} from '@/features/voice/services/moneyParser.shared';
import type { ParseMoneyTranscript } from '@/features/voice/services/moneyParser.types';
import type { MoneyExtractionResult } from '@/types/ai';

function getAIProvider() {
  return import.meta.env.VITE_AI_PROVIDER ?? 'gemini';
}

function normalizeMoneyCategory(
  category: MoneyExtractionResult['category'],
): MoneyDraft['category'] {
  if (
    category === 'medical' ||
    category === 'food' ||
    category === 'traffic' ||
    category === 'other'
  ) {
    return category;
  }

  return 'none';
}

function createMoneyDraftFromAIResult(
  transcript: string,
  extraction: MoneyExtractionResult,
) {
  const draft = createEmptyMoneyDraft();
  const normalizedSummary = extraction.summary.trim();
  const normalizedContent = normalizeMoneyTitleAndNote(
    extraction.title,
    extraction.note,
    transcript,
  );

  return mergeMoneyDraft(draft, {
    transcript: transcript.trim(),
    title: normalizedContent.title,
    amount: extraction.amount.trim(),
    dateValue: extraction.dateValue.trim() || draft.dateValue,
    timeValue: extraction.timeValue.trim() || draft.timeValue,
    category: normalizeMoneyCategory(extraction.category),
    needsSplit: extraction.needsSplit === 'true',
    note: normalizedContent.note,
    ...(normalizedSummary ? { summary: normalizedSummary } : {}),
  });
}

async function fetchMoneyExtractionWithProvider(transcript: string) {
  if (getAIProvider() === 'openai') {
    return fetchMoneyExtractionWithOpenAI(transcript);
  }

  return fetchMoneyExtractionWithGemini(transcript);
}

const parseMoneyTranscriptWithClient: ParseMoneyTranscript = async (
  transcript,
) => {
  try {
    const extraction = await fetchMoneyExtractionWithProvider(transcript);

    return createMoneyDraftFromAIResult(transcript, extraction);
  } catch {
    return parseMoneyTranscriptWithRule(transcript);
  }
};

export default parseMoneyTranscriptWithClient;

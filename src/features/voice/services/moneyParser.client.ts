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
  splitMoneySegments,
} from '@/features/voice/services/moneyParser.shared';
import type { ParseMoneyTranscript } from '@/features/voice/services/moneyParser.types';
import { hasMoneyIntent } from '@/features/voice/services/voiceIntent';
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

  return null;
}

function createMoneyDraftFromAIResult(
  transcript: string,
  extraction: MoneyExtractionResult,
) {
  const draft = createEmptyMoneyDraft();
  const normalizedSummary = extraction.summary.trim();
  const normalizedContent = normalizeMoneyTitleAndNote(
    extraction.title,
    extraction.notes,
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
    notes: normalizedContent.notes,
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
  const normalizedTranscript = transcript.trim();

  if (!hasMoneyIntent(normalizedTranscript)) {
    return [{ ...createEmptyMoneyDraft(), transcript: normalizedTranscript }];
  }

  try {
    const segments = splitMoneySegments(normalizedTranscript);
    const drafts = await Promise.all(
      segments.map((segment) =>
        fetchMoneyExtractionWithProvider(segment).then((extraction) =>
          createMoneyDraftFromAIResult(segment, extraction),
        ),
      ),
    );
    return drafts;
  } catch {
    return parseMoneyTranscriptWithRule(normalizedTranscript);
  }
};

export default parseMoneyTranscriptWithClient;

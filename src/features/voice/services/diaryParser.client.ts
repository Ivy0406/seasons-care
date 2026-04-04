import {
  fetchDiaryExtractionWithGemini,
  fetchDiaryExtractionWithOpenAI,
} from '@/api/ai';
import parseDiaryTranscriptWithRule from '@/features/voice/services/diaryParser.rule';
import {
  createEmptyDiaryDraft,
  mergeDiaryDraft,
  normalizeDiaryTitleAndNote,
} from '@/features/voice/services/diaryParser.shared';
import type { ParseDiaryTranscript } from '@/features/voice/services/diaryParser.types';
import { hasDiaryIntent } from '@/features/voice/services/voiceIntent';
import type { DiaryExtractionResult } from '@/types/ai';

function getAIProvider() {
  return import.meta.env.VITE_AI_PROVIDER ?? 'gemini';
}

function createDiaryDraftFromAIResult(
  transcript: string,
  extraction: DiaryExtractionResult,
) {
  const draft = createEmptyDiaryDraft();
  const normalizedSummary = extraction.summary.trim();
  const normalizedContent = normalizeDiaryTitleAndNote(
    extraction.title,
    extraction.note,
    transcript,
  );

  return mergeDiaryDraft(draft, {
    transcript: transcript.trim(),
    title: normalizedContent.title,
    dateValue: extraction.dateValue.trim() || draft.dateValue,
    timeValue: extraction.timeValue.trim() || draft.timeValue,
    repeatPattern: extraction.repeatPattern,
    note: normalizedContent.note,
    isImportant: extraction.isImportant === 'true',
    ...(normalizedSummary ? { summary: normalizedSummary } : {}),
  });
}

async function fetchDiaryExtractionWithProvider(transcript: string) {
  if (getAIProvider() === 'openai') {
    return fetchDiaryExtractionWithOpenAI(transcript);
  }

  return fetchDiaryExtractionWithGemini(transcript);
}

const parseDiaryTranscriptWithClient: ParseDiaryTranscript = async (
  transcript,
) => {
  if (!hasDiaryIntent(transcript)) {
    return {
      ...createEmptyDiaryDraft(),
      transcript: transcript.trim(),
    };
  }

  try {
    const extraction = await fetchDiaryExtractionWithProvider(transcript);

    return createDiaryDraftFromAIResult(transcript, extraction);
  } catch {
    return parseDiaryTranscriptWithRule(transcript);
  }
};

export default parseDiaryTranscriptWithClient;

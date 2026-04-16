import {
  fetchDiaryExtractionWithGemini,
  fetchDiaryExtractionWithOpenAI,
} from '@/api/ai';
import parseDiaryTranscriptWithRule from '@/features/voice/services/diaryParser.rule';
import {
  createEmptyDiaryDraft,
  hasRelativeDiaryDate,
  mergeDiaryDraft,
  normalizeDiaryTitleAndNote,
  resolveDiaryDateValue,
  resolveDiaryParticipantIds,
  resolveDiaryTimeValue,
  splitDiaryTranscriptIntoSegments,
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
  participantIds: string[],
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
    dateValue: hasRelativeDiaryDate(transcript)
      ? resolveDiaryDateValue(transcript, draft.dateValue)
      : extraction.dateValue.trim() || draft.dateValue,
    timeValue:
      extraction.timeValue.trim() ||
      resolveDiaryTimeValue(transcript, draft.timeValue),
    repeatPattern: extraction.repeatPattern,
    note: normalizedContent.note,
    participantIds,
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
  options,
) => {
  const shouldForceParse = options?.forceParse === true;

  if (!shouldForceParse && !hasDiaryIntent(transcript)) {
    return [];
  }

  try {
    const segments = splitDiaryTranscriptIntoSegments(transcript);
    let filteredSegments = segments.filter((segment) =>
      hasDiaryIntent(segment),
    );

    if (shouldForceParse) {
      filteredSegments = segments.length > 0 ? segments : [transcript];
    }

    const extractions = await Promise.all(
      filteredSegments.map((segment) =>
        fetchDiaryExtractionWithProvider(segment),
      ),
    );

    return extractions.map((extraction, index) =>
      createDiaryDraftFromAIResult(
        filteredSegments[index] ?? transcript,
        extraction,
        resolveDiaryParticipantIds(options?.groupMembers ?? [], {
          transcript: filteredSegments[index] ?? transcript,
          participantNames: extraction.participants,
        }),
      ),
    );
  } catch {
    return parseDiaryTranscriptWithRule(transcript, options);
  }
};

export default parseDiaryTranscriptWithClient;

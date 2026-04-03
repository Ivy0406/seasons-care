import fetchHealthExtractionWithGemini from '@/api/ai/gemini';
import fetchHealthExtractionWithOpenAI from '@/api/ai/openai';
import parseHealthTranscriptWithRule from '@/features/voice/services/healthParser.rule';
import {
  createEmptyHealthDraft,
  mergeHealthDraft,
} from '@/features/voice/services/healthParser.shared';
import type { ParseHealthTranscript } from '@/features/voice/services/healthParser.types';
import type { HealthExtractionResult } from '@/types/ai';

function getAIProvider() {
  return import.meta.env.VITE_AI_PROVIDER ?? 'gemini';
}

function createHealthDraftFromAIResult(
  transcript: string,
  extraction: HealthExtractionResult,
) {
  const draft = createEmptyHealthDraft();
  const normalizedSummary = extraction.summary.trim();

  return mergeHealthDraft(draft, {
    transcript: transcript.trim(),
    dateValue: extraction.dateValue.trim() || draft.dateValue,
    timeValue: extraction.timeValue.trim() || draft.timeValue,
    systolic: extraction.systolic.trim(),
    diastolic: extraction.diastolic.trim(),
    temperature: extraction.temperature.trim(),
    bloodOxygen: extraction.bloodOxygen.trim(),
    weight: extraction.weight.trim(),
    bloodSugar: extraction.bloodSugar.trim(),
    ...(normalizedSummary ? { summary: normalizedSummary } : {}),
  });
}

async function fetchHealthExtractionWithProvider(transcript: string) {
  if (getAIProvider() === 'openai') {
    return fetchHealthExtractionWithOpenAI(transcript);
  }

  return fetchHealthExtractionWithGemini(transcript);
}

const parseHealthTranscriptWithClient: ParseHealthTranscript = async (
  transcript,
) => {
  try {
    const extraction = await fetchHealthExtractionWithProvider(transcript);

    return createHealthDraftFromAIResult(transcript, extraction);
  } catch {
    return parseHealthTranscriptWithRule(transcript);
  }
};

export default parseHealthTranscriptWithClient;

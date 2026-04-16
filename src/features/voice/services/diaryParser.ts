import parseDiaryTranscriptWithClient from '@/features/voice/services/diaryParser.client';
import parseDiaryTranscriptWithRule from '@/features/voice/services/diaryParser.rule';
import parseDiaryTranscriptWithServer from '@/features/voice/services/diaryParser.server';
import {
  createEmptyDiaryDraft,
  hasDiaryDraftContent,
  mergeDiaryDraft,
} from '@/features/voice/services/diaryParser.shared';
import type { ParseDiaryTranscriptOptions } from '@/features/voice/services/diaryParser.types';
import { getVoiceParserMode } from '@/features/voice/services/voiceParserMode';

async function parseDiaryTranscript(
  transcript: string,
  options?: ParseDiaryTranscriptOptions,
) {
  const parserMode = getVoiceParserMode();

  if (parserMode === 'client') {
    return parseDiaryTranscriptWithClient(transcript, options);
  }

  if (parserMode === 'server') {
    try {
      return await parseDiaryTranscriptWithServer(transcript, options);
    } catch {
      return parseDiaryTranscriptWithRule(transcript, options);
    }
  }

  return parseDiaryTranscriptWithRule(transcript, options);
}

export {
  createEmptyDiaryDraft,
  hasDiaryDraftContent,
  mergeDiaryDraft,
  parseDiaryTranscript,
};

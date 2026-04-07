import parseDiaryTranscriptWithClient from '@/features/voice/services/diaryParser.client';
import parseDiaryTranscriptWithRule from '@/features/voice/services/diaryParser.rule';
import parseDiaryTranscriptWithServer from '@/features/voice/services/diaryParser.server';
import {
  createEmptyDiaryDraft,
  hasDiaryDraftContent,
  mergeDiaryDraft,
} from '@/features/voice/services/diaryParser.shared';
import { getVoiceParserMode } from '@/features/voice/services/voiceParserMode';

async function parseDiaryTranscript(transcript: string) {
  const parserMode = getVoiceParserMode();

  if (parserMode === 'client') {
    return parseDiaryTranscriptWithClient(transcript);
  }

  if (parserMode === 'server') {
    try {
      return await parseDiaryTranscriptWithServer(transcript);
    } catch {
      return parseDiaryTranscriptWithRule(transcript);
    }
  }

  return parseDiaryTranscriptWithRule(transcript);
}

export {
  createEmptyDiaryDraft,
  hasDiaryDraftContent,
  mergeDiaryDraft,
  parseDiaryTranscript,
};

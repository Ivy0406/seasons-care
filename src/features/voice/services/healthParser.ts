import parseHealthTranscriptWithClient from '@/features/voice/services/healthParser.client';
import parseHealthTranscriptWithRule from '@/features/voice/services/healthParser.rule';
import parseHealthTranscriptWithServer from '@/features/voice/services/healthParser.server';
import {
  createEmptyHealthDraft,
  getHealthDraftDisplayValue,
  getHealthDraftMetricValue,
  hasHealthDraftContent,
  mergeHealthDraft,
} from '@/features/voice/services/healthParser.shared';
import { getVoiceParserMode } from '@/features/voice/services/voiceParserMode';

async function parseHealthTranscript(transcript: string) {
  const parserMode = getVoiceParserMode();

  if (parserMode === 'client') {
    return parseHealthTranscriptWithClient(transcript);
  }

  if (parserMode === 'server') {
    try {
      return await parseHealthTranscriptWithServer(transcript);
    } catch {
      return parseHealthTranscriptWithRule(transcript);
    }
  }

  return parseHealthTranscriptWithRule(transcript);
}

export {
  createEmptyHealthDraft,
  getHealthDraftDisplayValue,
  getHealthDraftMetricValue,
  hasHealthDraftContent,
  mergeHealthDraft,
  parseHealthTranscript,
};

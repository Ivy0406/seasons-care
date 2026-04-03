import parseHealthTranscriptWithClient from '@/features/voice/services/healthParser.client';
import parseHealthTranscriptWithRule from '@/features/voice/services/healthParser.rule';
import parseHealthTranscriptWithServer from '@/features/voice/services/healthParser.server';
import {
  createEmptyHealthDraft,
  getHealthDraftDisplayValue,
  getHealthDraftMetricValue,
  mergeHealthDraft,
} from '@/features/voice/services/healthParser.shared';
import type { HealthParserMode } from '@/features/voice/services/healthParser.types';

function getHealthParserMode(): HealthParserMode {
  const parserMode = import.meta.env.VITE_HEALTH_PARSER_MODE;

  if (
    parserMode === 'client' ||
    parserMode === 'server' ||
    parserMode === 'rule'
  ) {
    return parserMode;
  }

  return 'rule';
}

async function parseHealthTranscript(transcript: string) {
  const parserMode = getHealthParserMode();

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
  mergeHealthDraft,
  parseHealthTranscript,
};

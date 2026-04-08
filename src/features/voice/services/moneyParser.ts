import parseMoneyTranscriptWithClient from '@/features/voice/services/moneyParser.client';
import parseMoneyTranscriptWithRule from '@/features/voice/services/moneyParser.rule';
import parseMoneyTranscriptWithServer from '@/features/voice/services/moneyParser.server';
import {
  createEmptyMoneyDraft,
  hasMoneyDraftContent,
  mergeMoneyDraft,
} from '@/features/voice/services/moneyParser.shared';
import { getVoiceParserMode } from '@/features/voice/services/voiceParserMode';

async function parseMoneyTranscript(transcript: string) {
  const parserMode = getVoiceParserMode();

  if (parserMode === 'client') {
    return parseMoneyTranscriptWithClient(transcript);
  }

  if (parserMode === 'server') {
    try {
      return await parseMoneyTranscriptWithServer(transcript);
    } catch {
      return parseMoneyTranscriptWithRule(transcript);
    }
  }

  return parseMoneyTranscriptWithRule(transcript);
}

export {
  createEmptyMoneyDraft,
  hasMoneyDraftContent,
  mergeMoneyDraft,
  parseMoneyTranscript,
};

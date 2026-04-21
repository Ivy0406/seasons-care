import type { MoneyDraft } from '@/features/money/types';
import parseMoneyTranscriptWithRule from '@/features/voice/services/moneyParser.rule';
import type { ParseMoneyTranscript } from '@/features/voice/services/moneyParser.types';

function isMoneyDraft(value: unknown): value is MoneyDraft {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const draft = value as Record<string, unknown>;

  return (
    typeof draft.title === 'string' &&
    typeof draft.amount === 'string' &&
    typeof draft.dateValue === 'string' &&
    typeof draft.timeValue === 'string' &&
    (draft.category === 'none' ||
      draft.category === 'medical' ||
      draft.category === 'food' ||
      draft.category === 'traffic' ||
      draft.category === 'other') &&
    typeof draft.needsSplit === 'boolean' &&
    typeof draft.notes === 'string' &&
    typeof draft.transcript === 'string' &&
    typeof draft.summary === 'string'
  );
}

const parseMoneyTranscriptWithServer: ParseMoneyTranscript = async (
  transcript,
) => {
  try {
    const response = await fetch('/api/money-extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      throw new Error('money-parser-server-request-failed');
    }

    const parsedResponse = (await response.json()) as unknown;

    if (!isMoneyDraft(parsedResponse)) {
      throw new Error('money-parser-server-invalid-response');
    }

    return [parsedResponse];
  } catch {
    return parseMoneyTranscriptWithRule(transcript);
  }
};

export default parseMoneyTranscriptWithServer;

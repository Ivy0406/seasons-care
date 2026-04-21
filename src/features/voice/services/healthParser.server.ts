import type { HealthDraft } from '@/features/health/types';
import type { ParseHealthTranscript } from '@/features/voice/services/healthParser.types';

function isHealthDraft(value: unknown): value is HealthDraft {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const draft = value as Record<string, unknown>;

  return (
    typeof draft.dateValue === 'string' &&
    typeof draft.timeValue === 'string' &&
    typeof draft.systolic === 'string' &&
    typeof draft.diastolic === 'string' &&
    typeof draft.temperature === 'string' &&
    typeof draft.bloodOxygen === 'string' &&
    typeof draft.weight === 'string' &&
    typeof draft.bloodSugar === 'string' &&
    typeof draft.transcript === 'string' &&
    typeof draft.summary === 'string'
  );
}

const parseHealthTranscriptWithServer: ParseHealthTranscript = async (
  transcript,
) => {
  const response = await fetch('/api/health-extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transcript }),
  });

  if (!response.ok) {
    throw new Error('health-parser-server-request-failed');
  }

  const parsedResponse = (await response.json()) as unknown;

  if (!isHealthDraft(parsedResponse)) {
    throw new Error('health-parser-server-invalid-response');
  }

  return parsedResponse;
};

export default parseHealthTranscriptWithServer;

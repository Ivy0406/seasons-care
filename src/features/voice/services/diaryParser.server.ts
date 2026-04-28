import {
  normalizeDateValue,
  createEmptyDiaryDraft,
} from '@/features/voice/services/diaryParser.shared';
import type { ParseDiaryTranscript } from '@/features/voice/services/diaryParser.types';
import type { DiaryDraft } from '@/pages/CareLog/types';

function isDiaryDraft(value: unknown): value is DiaryDraft {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const draft = value as Record<string, unknown>;

  return (
    typeof draft.id === 'string' &&
    typeof draft.title === 'string' &&
    typeof draft.dateValue === 'string' &&
    typeof draft.timeValue === 'string' &&
    (draft.repeatPattern === 'none' ||
      draft.repeatPattern === 'daily' ||
      draft.repeatPattern === 'weeklyDay' ||
      draft.repeatPattern === 'monthly') &&
    typeof draft.note === 'string' &&
    (draft.participantIds === undefined ||
      (Array.isArray(draft.participantIds) &&
        draft.participantIds.every((item) => typeof item === 'string'))) &&
    typeof draft.isImportant === 'boolean' &&
    typeof draft.transcript === 'string' &&
    typeof draft.summary === 'string'
  );
}

function isDiaryDraftList(value: unknown): value is DiaryDraft[] {
  return Array.isArray(value) && value.every((item) => isDiaryDraft(item));
}

const parseDiaryTranscriptWithServer: ParseDiaryTranscript = async (
  transcript,
) => {
  const response = await fetch('/api/diary-extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transcript }),
  });

  if (!response.ok) {
    throw new Error('diary-parser-server-request-failed');
  }

  const parsedResponse = (await response.json()) as unknown;

  if (!isDiaryDraftList(parsedResponse)) {
    throw new Error('diary-parser-server-invalid-response');
  }

  return parsedResponse.map((draft) => ({
    ...draft,
    dateValue:
      normalizeDateValue(draft.dateValue) || createEmptyDiaryDraft().dateValue,
    participantIds:
      draft.participantIds && draft.participantIds.length > 0
        ? draft.participantIds
        : createEmptyDiaryDraft().participantIds,
  }));
};

export default parseDiaryTranscriptWithServer;

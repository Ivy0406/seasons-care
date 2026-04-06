import {
  buildDiaryDraftSummary,
  createEmptyDiaryDraft,
  getDiaryDraftSummarySource,
  normalizeDiaryTitleAndNote,
  splitDiaryTranscriptIntoSegments,
} from '@/features/voice/services/diaryParser.shared';
import type { ParseDiaryTranscript } from '@/features/voice/services/diaryParser.types';
import { hasDiaryIntent } from '@/features/voice/services/voiceIntent';
import type { DiaryDraft } from '@/pages/CareLog/types';

function extractRepeatPattern(transcript: string): DiaryDraft['repeatPattern'] {
  if (/每天|每日/.test(transcript)) {
    return 'daily';
  }

  if (
    /每週|每周|每個星期|每個禮拜|週[一二三四五六日天]|星期[一二三四五六日天]/.test(
      transcript,
    )
  ) {
    return 'weeklyDay';
  }

  if (/每月|每個月/.test(transcript)) {
    return 'monthly';
  }

  return 'none';
}

function extractTitle(transcript: string) {
  return normalizeDiaryTitleAndNote('', '', transcript).title;
}

const parseDiaryTranscriptWithRule: ParseDiaryTranscript = async (
  transcript,
) => {
  const normalizedTranscript = transcript.trim();

  if (!hasDiaryIntent(normalizedTranscript)) {
    return [];
  }

  return splitDiaryTranscriptIntoSegments(normalizedTranscript)
    .filter((segment) => hasDiaryIntent(segment))
    .map((segment) => {
      const emptyDraft = createEmptyDiaryDraft();
      const title = extractTitle(segment);
      const { note } = normalizeDiaryTitleAndNote(title, '', segment);
      const baseDraft = {
        ...getDiaryDraftSummarySource(emptyDraft),
        transcript: segment,
        title,
        repeatPattern: extractRepeatPattern(segment),
        note,
        isImportant: /重要|緊急|記得|一定要|務必/.test(segment),
      };

      return {
        id: emptyDraft.id,
        ...baseDraft,
        summary: buildDiaryDraftSummary(baseDraft),
      };
    });
};

export default parseDiaryTranscriptWithRule;

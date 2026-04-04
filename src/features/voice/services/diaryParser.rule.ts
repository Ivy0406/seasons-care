import {
  buildDiaryDraftSummary,
  createEmptyDiaryDraft,
  getDiaryDraftSummarySource,
  normalizeDiaryTitleAndNote,
} from '@/features/voice/services/diaryParser.shared';
import type { ParseDiaryTranscript } from '@/features/voice/services/diaryParser.types';
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
  const emptyDraft = createEmptyDiaryDraft();
  const normalizedTranscript = transcript.trim();
  const title = extractTitle(normalizedTranscript);
  const { note } = normalizeDiaryTitleAndNote(title, '', normalizedTranscript);

  const baseDraft: Omit<DiaryDraft, 'summary'> = {
    ...getDiaryDraftSummarySource(emptyDraft),
    transcript: normalizedTranscript,
    title,
    repeatPattern: extractRepeatPattern(normalizedTranscript),
    note,
    isImportant: /重要|緊急|記得|一定要|務必/.test(normalizedTranscript),
  };

  return {
    ...baseDraft,
    summary: buildDiaryDraftSummary(baseDraft),
  };
};

export default parseDiaryTranscriptWithRule;

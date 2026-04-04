import type { DiaryDraft } from '@/pages/CareLog/types';

function padTimeUnit(value: number) {
  return value.toString().padStart(2, '0');
}

function formatDateValue(date: Date) {
  return `${date.getFullYear()}/${padTimeUnit(date.getMonth() + 1)}/${padTimeUnit(date.getDate())}`;
}

function formatTimeValue(date: Date) {
  return `${padTimeUnit(date.getHours())}:${padTimeUnit(date.getMinutes())}`;
}

function stripDiaryLeadIn(text: string) {
  return text
    .replace(
      /^(提醒我|幫我記錄|幫我新增|記一下|記得|新增日誌|寫日誌|幫我寫日誌)\s*/u,
      '',
    )
    .trim();
}

function createDiaryTitleCandidate(text: string) {
  const normalizedText = stripDiaryLeadIn(text).replace(/\s+/g, ' ').trim();

  if (normalizedText === '') {
    return '';
  }

  const firstSegment =
    normalizedText
      .split(/[，。,；;！!？?\n]/u)
      .find(Boolean)
      ?.trim() ?? '';

  if (firstSegment === '') {
    return '';
  }

  return firstSegment.slice(0, 16).trim();
}

function normalizeDiaryTitleAndNote(
  title: string,
  note: string,
  transcript: string,
) {
  const normalizedTranscript = transcript.trim();
  const normalizedTitle =
    title.trim() || createDiaryTitleCandidate(note || normalizedTranscript);
  let normalizedNote = note.trim();

  if (normalizedNote === normalizedTitle) {
    normalizedNote = '';
  } else if (
    normalizedTitle !== '' &&
    normalizedNote.startsWith(normalizedTitle)
  ) {
    normalizedNote = normalizedNote
      .slice(normalizedTitle.length)
      .replace(/^[：:，,\s]+/u, '')
      .trim();
  }

  if (normalizedNote === '' && normalizedTranscript !== normalizedTitle) {
    normalizedNote = normalizedTranscript
      .replace(normalizedTitle, '')
      .replace(/^[：:，,\s]+/u, '')
      .trim();
  }

  return {
    title: normalizedTitle,
    note: normalizedNote,
  };
}

function getRepeatPatternLabel(repeatPattern: DiaryDraft['repeatPattern']) {
  if (repeatPattern === 'daily') {
    return '每天重複';
  }

  if (repeatPattern === 'weeklyDay') {
    return '每週重複';
  }

  if (repeatPattern === 'monthly') {
    return '每月重複';
  }

  return '';
}

function getDiaryDraftSummarySource(
  draft: DiaryDraft,
): Omit<DiaryDraft, 'summary'> {
  return {
    title: draft.title,
    dateValue: draft.dateValue,
    timeValue: draft.timeValue,
    repeatPattern: draft.repeatPattern,
    note: draft.note,
    isImportant: draft.isImportant,
    transcript: draft.transcript,
  };
}

function buildDiaryDraftSummary(draft: Omit<DiaryDraft, 'summary'>) {
  const summaryParts: string[] = [];

  if (draft.title.trim() !== '') {
    summaryParts.push(`日誌名稱「${draft.title.trim()}」`);
  }

  if (draft.note.trim() !== '') {
    summaryParts.push(`內容「${draft.note.trim()}」`);
  }

  const repeatPatternLabel = getRepeatPatternLabel(draft.repeatPattern);

  if (repeatPatternLabel !== '') {
    summaryParts.push(repeatPatternLabel);
  }

  if (draft.isImportant) {
    summaryParts.push('已標記為重要');
  }

  return summaryParts.length > 0
    ? `已從語音擷取日誌內容：${summaryParts.join('、')}。`
    : '已建立語音日誌草稿，請確認欄位後再儲存。';
}

function createEmptyDiaryDraft(date = new Date()): DiaryDraft {
  return {
    title: '',
    dateValue: formatDateValue(date),
    timeValue: formatTimeValue(date),
    repeatPattern: 'none',
    note: '',
    isImportant: false,
    transcript: '',
    summary: '請先錄音或手動輸入日誌內容。',
  };
}

function hasDiaryDraftContent(draft: DiaryDraft) {
  return (
    draft.title.trim() !== '' ||
    draft.note.trim() !== '' ||
    draft.repeatPattern !== 'none' ||
    draft.isImportant
  );
}

function mergeDiaryDraft(
  currentDraft: DiaryDraft,
  updates: Partial<DiaryDraft>,
): DiaryDraft {
  const nextDraft = {
    ...currentDraft,
    ...updates,
  };

  return {
    ...nextDraft,
    summary:
      updates.summary ??
      buildDiaryDraftSummary(getDiaryDraftSummarySource(nextDraft)),
  };
}

export {
  buildDiaryDraftSummary,
  createEmptyDiaryDraft,
  formatDateValue,
  formatTimeValue,
  getDiaryDraftSummarySource,
  hasDiaryDraftContent,
  mergeDiaryDraft,
  normalizeDiaryTitleAndNote,
};

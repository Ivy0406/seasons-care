import type { DiaryDraft } from '@/pages/CareLog/types';

const DIARY_DATE_PATTERN = /(今天|明天|後天)/u;
const DIARY_DATE_PATTERN_GLOBAL = /(今天|明天|後天)/gu;
const DIARY_TIME_PATTERN =
  /(?:早上|上午|中午|下午|晚上)\s*\d{1,2}(?:[:：點時]\d{1,2})?(?:分)?|\d{1,2}[:：]\d{2}/gu;

function createDiaryDraftId() {
  return globalThis.crypto?.randomUUID?.() ?? `diary-${Date.now()}`;
}

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

function extractDiaryDateContext(text: string) {
  return text.match(DIARY_DATE_PATTERN)?.[0] ?? '';
}

function applyDiaryDateContext(segment: string, dateContext: string) {
  if (dateContext === '' || extractDiaryDateContext(segment) !== '') {
    return segment;
  }

  return `${dateContext} ${segment}`.trim();
}

function splitDiaryTranscriptIntoSegments(transcript: string) {
  const normalizedTranscript = transcript.replace(/\s+/g, ' ').trim();

  if (normalizedTranscript === '') {
    return [];
  }

  const splitPositions = new Set<number>();

  [...normalizedTranscript.matchAll(DIARY_DATE_PATTERN_GLOBAL)]
    .slice(1)
    .forEach((match) => {
      if (match.index !== undefined) {
        splitPositions.add(match.index);
      }
    });

  [...normalizedTranscript.matchAll(DIARY_TIME_PATTERN)]
    .slice(1)
    .forEach((match) => {
      if (match.index !== undefined) {
        splitPositions.add(match.index);
      }
    });

  const sortedSplitPositions = [...splitPositions]
    .filter((index) => index > 0)
    .sort((left, right) => left - right);

  if (sortedSplitPositions.length === 0) {
    return [normalizedTranscript];
  }

  const segments: string[] = [];
  let startIndex = 0;
  let currentDateContext = extractDiaryDateContext(normalizedTranscript);

  sortedSplitPositions.forEach((splitIndex) => {
    const segment = normalizedTranscript.slice(startIndex, splitIndex).trim();

    if (segment !== '') {
      const segmentWithDateContext = applyDiaryDateContext(
        segment,
        currentDateContext,
      );
      segments.push(segmentWithDateContext);
      currentDateContext =
        extractDiaryDateContext(segmentWithDateContext) || currentDateContext;
    }

    startIndex = splitIndex;
  });

  const lastSegment = normalizedTranscript.slice(startIndex).trim();

  if (lastSegment !== '') {
    segments.push(applyDiaryDateContext(lastSegment, currentDateContext));
  }

  return segments;
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

type DiaryDraftSummarySource = Omit<DiaryDraft, 'id' | 'summary'>;

function getDiaryDraftSummarySource(
  draft: DiaryDraft,
): DiaryDraftSummarySource {
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

function buildDiaryDraftSummary(draft: DiaryDraftSummarySource) {
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
    id: createDiaryDraftId(),
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
  createDiaryDraftId,
  createEmptyDiaryDraft,
  formatDateValue,
  formatTimeValue,
  getDiaryDraftSummarySource,
  hasDiaryDraftContent,
  mergeDiaryDraft,
  normalizeDiaryTitleAndNote,
  splitDiaryTranscriptIntoSegments,
};

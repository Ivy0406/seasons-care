import type { MoneyCategoryValue, MoneyDraft } from '@/features/money/types';

function padTimeUnit(value: number) {
  return value.toString().padStart(2, '0');
}

function formatDateValue(date: Date) {
  return `${date.getFullYear()}-${padTimeUnit(date.getMonth() + 1)}-${padTimeUnit(date.getDate())}`;
}

function formatTimeValue(date: Date) {
  return `${padTimeUnit(date.getHours())}:${padTimeUnit(date.getMinutes())}`;
}

function stripMoneyLeadIn(text: string) {
  return text
    .replace(
      /^(幫我記帳|幫我新增帳目|新增帳目|記帳|紀錄帳目|記一下支出|幫我記錄支出)\s*/u,
      '',
    )
    .trim();
}

function createMoneyTitleCandidate(text: string) {
  const normalizedText = stripMoneyLeadIn(text).replace(/\s+/g, ' ').trim();

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

function normalizeMoneyTitleAndNote(
  title: string,
  note: string,
  transcript: string,
) {
  const normalizedTranscript = transcript.trim();
  const normalizedTitle =
    title.trim() || createMoneyTitleCandidate(note || normalizedTranscript);
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
    notes: normalizedNote,
  };
}

function getMoneyCategoryLabel(category: MoneyCategoryValue) {
  if (category === 'medical') {
    return '醫療支出';
  }

  if (category === 'food') {
    return '飲食支出';
  }

  if (category === 'traffic') {
    return '交通費用';
  }

  if (category === 'other') {
    return '生活支出';
  }

  return '';
}

function getMoneyDraftSummarySource(
  draft: MoneyDraft,
): Omit<MoneyDraft, 'summary'> {
  return {
    title: draft.title,
    amount: draft.amount,
    dateValue: draft.dateValue,
    timeValue: draft.timeValue,
    category: draft.category,
    needsSplit: draft.needsSplit,
    notes: draft.notes,
    transcript: draft.transcript,
  };
}

function buildMoneyDraftSummary(draft: Omit<MoneyDraft, 'summary'>) {
  const summaryParts: string[] = [];

  if (draft.title.trim() !== '') {
    summaryParts.push(`帳目名稱「${draft.title.trim()}」`);
  }

  if (draft.amount.trim() !== '') {
    summaryParts.push(`金額 ${draft.amount} 元`);
  }

  const categoryLabel =
    draft.category !== null ? getMoneyCategoryLabel(draft.category) : '';

  if (categoryLabel !== '') {
    summaryParts.push(`類別 ${categoryLabel}`);
  }

  if (draft.needsSplit) {
    summaryParts.push('需分帳');
  }

  if (draft.notes.trim() !== '') {
    summaryParts.push(`備註「${draft.notes.trim()}」`);
  }

  return summaryParts.length > 0
    ? `已從語音擷取帳目內容：${summaryParts.join('、')}。`
    : '已建立語音帳目草稿，請確認欄位後再儲存。';
}

function createEmptyMoneyDraft(date = new Date()): MoneyDraft {
  return {
    title: '',
    amount: '',
    dateValue: formatDateValue(date),
    timeValue: formatTimeValue(date),
    category: null,
    needsSplit: false,
    notes: '',
    transcript: '',
    summary: '請先錄音或手動輸入帳目內容。',
  };
}

function hasMoneyDraftContent(draft: MoneyDraft) {
  return (
    draft.title.trim() !== '' ||
    draft.amount.trim() !== '' ||
    draft.category !== null ||
    draft.needsSplit ||
    draft.notes.trim() !== ''
  );
}

function mergeMoneyDraft(
  currentDraft: MoneyDraft,
  updates: Partial<MoneyDraft>,
): MoneyDraft {
  const nextDraft = {
    ...currentDraft,
    ...updates,
  };

  return {
    ...nextDraft,
    summary:
      updates.summary ??
      buildMoneyDraftSummary(getMoneyDraftSummarySource(nextDraft)),
  };
}

export {
  buildMoneyDraftSummary,
  createEmptyMoneyDraft,
  getMoneyDraftSummarySource,
  hasMoneyDraftContent,
  mergeMoneyDraft,
  normalizeMoneyTitleAndNote,
};

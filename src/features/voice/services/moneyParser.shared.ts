import type { MoneyCategoryValue, MoneyDraft } from '@/features/money/types';

const MONEY_AMOUNT_PATTERN = /\$\s*\d{1,6}|\d{1,6}(?:元|塊|塊錢)/g;

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
      /^(幫我記[帳賬]|幫我新增[帳賬]目|新增[帳賬]目|記[帳賬]|紀錄[帳賬]目|記一下支出|幫我記錄支出)\s*/u,
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

function hasGlobalSplitIntent(transcript: string): boolean {
  return /都要分(?:[帳賬]|錢)|全部要分(?:[帳賬]|錢)|全部分(?:[帳賬]|錢)|通通要分(?:[帳賬]|錢)|都分(?:[帳賬]|錢)|一起分(?:[帳賬]|錢)/.test(
    transcript,
  );
}

function splitMoneySegments(transcript: string): string[] {
  const normalized = transcript.trim();

  const amountCount = (normalized.match(MONEY_AMOUNT_PATTERN) ?? []).length;
  if (amountCount <= 1) return [normalized];

  // 切在「金額之後」、「下一筆支出開頭之前」（支援 800塊 / 800元 / $800）
  const segments = normalized.split(
    /(?<=(?:\$\s*\d{1,6}|\d{1,6}(?:元|塊|塊錢))(?:\s*(?:要分(?:[帳賬]|錢)|需分(?:[帳賬]|錢)|分(?:[帳賬]|錢)|平分|平攤|AA|一起出|大家分|分攤))?)[，,；;。\s]+(?=(?:買|購買)|\p{Script=Han}{1,8}(?:花了|費用|支出|費\d))/u,
  );

  if (segments.length > 1) {
    return segments.map((s) => s.trim()).filter(Boolean);
  }

  // fallback：用金額切（較不精確）
  const parts = normalized.split(/(\$\s*\d{1,6}|\d{1,6}(?:元|塊|塊錢))/);
  const result: string[] = [];
  for (let i = 0; i + 1 < parts.length; i += 2) {
    const segment = (parts[i] + parts[i + 1]).trim();
    if (segment !== '') result.push(segment);
  }
  return result.length > 1 ? result : [normalized];
}

export {
  buildMoneyDraftSummary,
  createEmptyMoneyDraft,
  getMoneyDraftSummarySource,
  hasGlobalSplitIntent,
  hasMoneyDraftContent,
  mergeMoneyDraft,
  normalizeMoneyTitleAndNote,
  splitMoneySegments,
};

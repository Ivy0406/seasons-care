import type { Dispatch, SetStateAction } from 'react';

import { toast } from 'sonner';

import getAvatarSrcByKey from '@/assets/images/avatars';
import type { RepeatPatternValue } from '@/components/common/ListFormRows';
import {
  hasDiaryDraftContent,
  parseDiaryTranscript,
} from '@/features/voice/services/diaryParser';
import type { CareLogEntry, DiaryDraft } from '@/pages/CareLog/types';
import type { GroupMember } from '@/types/group';

type CareLogVoiceFieldSetters = {
  setTitleValue: Dispatch<SetStateAction<string>>;
  setDateValue: Dispatch<SetStateAction<string>>;
  setTimeValue: Dispatch<SetStateAction<string>>;
  setRepeatPattern: Dispatch<SetStateAction<RepeatPatternValue>>;
  setNote: Dispatch<SetStateAction<string>>;
  setParticipantIds: Dispatch<SetStateAction<string[]>>;
  setIsImportant: Dispatch<SetStateAction<boolean>>;
};

function hasRelativeDiaryDateMention(transcript: string) {
  return /(今天|明天|後天|下(?:週|周|星期|禮拜)(?:[一二三四五六日天])?)/u.test(
    transcript,
  );
}

function hasDiaryTimeMention(transcript: string) {
  return /(?:早上|上午|中午|下午|晚上)\s*\d{1,2}(?:[:：點時]\d{1,2})?(?:分)?|\d{1,2}[:：]\d{2}/u.test(
    transcript,
  );
}

async function handleCareLogVoiceFinish({
  transcript,
  groupMembers,
  setters,
}: {
  transcript: string;
  groupMembers: GroupMember[];
  setters: CareLogVoiceFieldSetters;
}) {
  const parsedDrafts = await parseDiaryTranscript(transcript, {
    groupMembers,
    forceParse: true,
  });
  const parsedDraft = parsedDrafts[0];

  if (!parsedDraft || !hasDiaryDraftContent(parsedDraft)) {
    toast.error('這段語音暫時無法辨識成日誌內容，請重新錄製或手動輸入。');
    return { shouldClose: false };
  }

  if (parsedDraft.title.trim() !== '') {
    setters.setTitleValue(parsedDraft.title);
  }

  if (hasRelativeDiaryDateMention(transcript)) {
    setters.setDateValue(parsedDraft.dateValue.replaceAll('-', '/'));
  }

  if (hasDiaryTimeMention(transcript)) {
    setters.setTimeValue(parsedDraft.timeValue);
  }

  if (parsedDraft.repeatPattern !== 'none') {
    setters.setRepeatPattern(parsedDraft.repeatPattern);
  }

  if (parsedDraft.note.trim() !== '') {
    setters.setNote(parsedDraft.note);
  }

  if (parsedDraft.participantIds.length > 0) {
    setters.setParticipantIds(parsedDraft.participantIds);
  }

  setters.setIsImportant(parsedDraft.isImportant);

  return { shouldClose: true };
}

function diaryDraftToCareLogEntry(
  draft: DiaryDraft,
  groupMembers: GroupMember[],
): CareLogEntry {
  const startsAt = new Date(
    `${draft.dateValue.replace(/\//g, '-')}T${draft.timeValue}:00`,
  ).toISOString();

  const participants = draft.participantIds.map((id) => {
    const member = groupMembers.find((m) => m.userId === id);

    return {
      id,
      name: member?.username ?? '成員',
      src: member ? getAvatarSrcByKey(member.avatarKey) : '',
    };
  });

  return {
    id: draft.id,
    title: draft.title,
    description: draft.note,
    startsAt,
    repeatPattern: draft.repeatPattern,
    participants,
    status: 'pending',
    isImportant: draft.isImportant,
  };
}

export { diaryDraftToCareLogEntry, handleCareLogVoiceFinish };
export type { CareLogVoiceFieldSetters };

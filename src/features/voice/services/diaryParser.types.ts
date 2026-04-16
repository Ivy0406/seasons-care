/* eslint-disable import/prefer-default-export */

import type { DiaryDraft } from '@/pages/CareLog/types';
import type { GroupMember } from '@/types/group';

type ParseDiaryTranscriptOptions = {
  groupMembers?: GroupMember[];
  forceParse?: boolean;
};

type ParseDiaryTranscript = (
  transcript: string,
  options?: ParseDiaryTranscriptOptions,
) => Promise<DiaryDraft[]>;

export type { ParseDiaryTranscript, ParseDiaryTranscriptOptions };

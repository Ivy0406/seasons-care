/* eslint-disable import/prefer-default-export */

import type { DiaryDraft } from '@/pages/CareLog/types';

type ParseDiaryTranscript = (transcript: string) => Promise<DiaryDraft>;

export type { ParseDiaryTranscript };

import type { DiaryCardItem } from '@/components/common/DiaryCard';
import type { FormDiaryRepeatValue } from '@/components/common/FormDiaryRepeatSelector';
import type { CareLogType } from '@/types/careLog';

export type CareLogEntry = DiaryCardItem;

export type CareLogFilterValue = 'all' | 'notStarted' | 'started' | 'completed';

export type CareLogCreateInput = {
  title: string;
  content: string;
  recordDate: string;
  logType: CareLogType;
};

export type DiaryDraft = {
  id: string;
  title: string;
  dateValue: string;
  timeValue: string;
  repeatPattern: FormDiaryRepeatValue;
  note: string;
  isImportant: boolean;
  transcript: string;
  summary: string;
};

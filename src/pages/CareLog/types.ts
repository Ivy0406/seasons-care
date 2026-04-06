import type { FormDiaryRepeatValue } from '@/components/common/FormDiaryRepeatSelector';

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

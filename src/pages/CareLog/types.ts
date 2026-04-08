import type { DiaryCardItem } from '@/components/common/DiaryCard';
import type { CareLogType } from '@/types/careLog';

export type CareLogEntry = DiaryCardItem;

export type CareLogFilterValue = 'all' | 'notStarted' | 'started' | 'completed';

export type CareLogCreateInput = {
  title: string;
  content: string;
  recordDate: string;
  logType: CareLogType;
};

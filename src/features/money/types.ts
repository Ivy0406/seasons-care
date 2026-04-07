export type Recorder = {
  name: string;
  src: string;
};

export type MoneyCategoryValue =
  | 'none'
  | 'medical'
  | 'food'
  | 'traffic'
  | 'other';

export type MoneyDraft = {
  title: string;
  amount: string;
  dateValue: string;
  timeValue: string;
  category: MoneyCategoryValue;
  needsSplit: boolean;
  note: string;
  transcript: string;
  summary: string;
};

export type ExpenseItem = {
  id: string;
  name: string;
  date: string;
  time: string;
  category: string;
  amount: number;
  needSplit: boolean;
  isSplit: boolean;
  creator: Recorder;
  description?: string;
};

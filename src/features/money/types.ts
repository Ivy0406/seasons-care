export type Recorder = {
  name: string;
  src: string;
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

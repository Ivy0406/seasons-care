type Recorder = {
  name: string;
  src: string;
};

type MoneyCategoryValue = 'none' | 'medical' | 'food' | 'traffic' | 'other';

type MoneyDraft = {
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

type ExpenseItem = {
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

type ExpensesCategory = 'medical' | 'food' | 'traffic' | 'other';

type CategoryConfig = {
  category: ExpensesCategory;
  label: string;
  color: string;
};

type CategoryWithAmount = CategoryConfig & {
  amount: number;
};

type CategoryTotals = Record<ExpensesCategory, number>;

type MoneyTab = 'daily' | 'monthly';

export type {
  Recorder,
  MoneyCategoryValue,
  MoneyDraft,
  ExpenseItem,
  ExpensesCategory,
  CategoryConfig,
  CategoryWithAmount,
  CategoryTotals,
  MoneyTab,
};

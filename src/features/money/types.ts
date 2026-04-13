type SplitStatus = 'pending' | 'settled' | 'none';

type MoneyCategoryValue = 'medical' | 'food' | 'traffic' | 'other';

type MoneyDraft = {
  title: string;
  amount: string;
  dateValue: string;
  timeValue: string;
  category: MoneyCategoryValue | null;
  needsSplit: boolean;
  notes: string;
  transcript: string;
  summary: string;
};

type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  category: MoneyCategoryValue;
  notes?: string;
  expenseDate: string;
  careGroupId: string;
  createdAt: string;
  updatedAt: string;
  splitStatus: SplitStatus;
  createdBy: string;
};

type CategoryConfig = {
  category: MoneyCategoryValue;
  label: string;
  color: string;
};

type CategoryWithAmount = CategoryConfig & {
  amount: number;
};

type CategoryTotals = Record<MoneyCategoryValue, number>;

type MoneyTab = 'daily' | 'monthly';

export type {
  SplitStatus,
  MoneyCategoryValue,
  MoneyDraft,
  ExpenseItem,
  CategoryConfig,
  CategoryWithAmount,
  CategoryTotals,
  MoneyTab,
};

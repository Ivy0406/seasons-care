type SplitStatus = 'pending' | 'settled' | 'none';

type MoneyCategoryValue = 'none' | 'medical' | 'food' | 'traffic' | 'other';

type MoneyDraft = {
  title: string;
  amount: string;
  dateValue: string;
  timeValue: string;
  category: MoneyCategoryValue;
  needsSplit: boolean;
  notes: string;
  transcript: string;
  summary: string;
};

type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  category: string;
  notes?: string;
  expenseDate: string;
  careGroupId: string;
  createdAt: string;
  updatedAt: string;
  splitStatus: SplitStatus;
  createdBy: string;
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
  SplitStatus,
  MoneyCategoryValue,
  MoneyDraft,
  ExpenseItem,
  ExpensesCategory,
  CategoryConfig,
  CategoryWithAmount,
  CategoryTotals,
  MoneyTab,
};

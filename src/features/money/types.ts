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
  splitBatchId?: string | null;
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

type SplitItem = {
  id: string;
  title: string;
  amount: number;
};

type SplitPendingItem = SplitItem & {
  createdBy: string;
};

type SplitMember = {
  userId: string;
  username: string;
  avatarKey: string;
};

type MemberSplit = SplitMember & {
  status: 'receivable' | 'payable';
  amount: number;
};

export type {
  SplitStatus,
  MoneyCategoryValue,
  MoneyDraft,
  ExpenseItem,
  CategoryConfig,
  CategoryWithAmount,
  CategoryTotals,
  MoneyTab,
  SplitItem,
  SplitPendingItem,
  SplitMember,
  MemberSplit,
};

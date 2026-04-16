type SplitStatus = 'pending' | 'settled' | 'none';
type MoneyCategory = 'medical' | 'food' | 'traffic' | 'other';

type CreateMoneyItemPayLoad = {
  title: string;
  amount: number;
  category: MoneyCategory;
  notes: string;
  expenseDate: string;
  splitStatus: SplitStatus;
};

type MoneyItemData = {
  id: string;
  title: string;
  amount: number;
  expenseDate: string;
  category: MoneyCategory;
  splitStatus: SplitStatus;
  notes: string;
  careGroupId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

type MoneyItemResponse = {
  success: boolean;
  message: string;
  data: MoneyItemData;
};

type GetMoneyItemsResponse = {
  success: boolean;
  message: string;
  data: MoneyItemData[];
};

type UpdateMoneyItemPayLoad = CreateMoneyItemPayLoad & {
  updatedAt: string;
};

type GetMoneyItemsParams = {
  StartDate?: string;
  EndDate?: string;
};

type SplitMode = 'daily' | 'monthly' | 'custom';

type SplitMoneyPayload = {
  splitMode: SplitMode;
  expenseIds: string[];
  targetDate?: string;
  targetUserIds: string[];
};

type SplitResponse = {
  success: boolean;
  message: string;
  data: null;
};

type SplitPreviewItem = {
  id: string;
  title: string;
  amount: number;
};

type SplitDetail = {
  userId: string;
  name: string;
  avatarUrl: string;
  isPayer: boolean;
  receivableAmount: number;
  payableAmount: number;
};

type SplitPreviewData = {
  totalAmount: number;
  selectedExpenses: SplitPreviewItem[];
  splitDetails: SplitDetail[];
};

type SplitPreviewResponse = {
  success: boolean;
  message: string;
  data: SplitPreviewData;
};

type MemberTotalItem = {
  userId: string;
  name: string;
  avatarUrl: string | null;
  totalAmount: number;
  expenseCount: number;
};

type MemberTotalsData = {
  totalAmount: number;
  memberCount: number;
  members: MemberTotalItem[];
};

type MemberTotalsResponse = {
  success: boolean;
  message: string;
  data: MemberTotalsData;
};

type MemberTotalsParams = {
  scope?: 'daily' | 'monthly' | 'all';
  targetDate?: string;
  pendingOnly?: boolean;
};

export type {
  CreateMoneyItemPayLoad,
  GetMoneyItemsParams,
  GetMoneyItemsResponse,
  MoneyItemResponse,
  UpdateMoneyItemPayLoad,
  SplitMode,
  SplitMoneyPayload,
  SplitResponse,
  SplitPreviewItem,
  SplitDetail,
  SplitPreviewData,
  SplitPreviewResponse,
  MemberTotalItem,
  MemberTotalsData,
  MemberTotalsResponse,
  MemberTotalsParams,
};

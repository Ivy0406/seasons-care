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

export type {
  CreateMoneyItemPayLoad,
  GetMoneyItemsParams,
  GetMoneyItemsResponse,
  MoneyItemResponse,
  UpdateMoneyItemPayLoad,
};

import type {
  CreateMoneyItemPayLoad,
  GetMoneyItemsParams,
  GetMoneyItemsResponse,
  MoneyItemResponse,
  UpdateMoneyItemPayLoad,
} from '@/types/money';

import apiClient from '../client';

const buildMoneyItemsPath = (careGroupId: string) =>
  `/api/care-groups/${careGroupId}/expenses`;

const buildMoneyItemPath = (careGroupId: string, expenseId: string) =>
  `${buildMoneyItemsPath(careGroupId)}/${expenseId}`;

const createMoneyItem = (
  careGroupId: string,
  payload: CreateMoneyItemPayLoad,
) =>
  apiClient.post<MoneyItemResponse>(buildMoneyItemsPath(careGroupId), payload);

const getMoneyItems = (careGroupId: string, params?: GetMoneyItemsParams) =>
  apiClient.get<GetMoneyItemsResponse>(buildMoneyItemsPath(careGroupId), {
    params,
  });

const updateMoneyItem = (
  careGroupId: string,
  expenseId: string,
  payload: UpdateMoneyItemPayLoad,
) =>
  apiClient.put<MoneyItemResponse>(
    buildMoneyItemPath(careGroupId, expenseId),
    payload,
  );

const deleteMoneyItem = (careGroupId: string, expenseId: string) =>
  apiClient.delete(buildMoneyItemPath(careGroupId, expenseId));

export { getMoneyItems, createMoneyItem, updateMoneyItem, deleteMoneyItem };

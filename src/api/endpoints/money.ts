import type {
  CreateMoneyItemPayLoad,
  GetMoneyItemsParams,
  GetMoneyItemsResponse,
  MemberTotalsParams,
  MemberTotalsResponse,
  MoneyItemResponse,
  SplitMoneyPayload,
  SplitPreviewResponse,
  SplitResponse,
  UpdateMoneyItemPayLoad,
} from '@/types/money';

type SplitPreviewByBatchParams = {
  splitBatchId: string;
};

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

const splitPreview = (careGroupId: string, payload: SplitMoneyPayload) =>
  apiClient.post<SplitPreviewResponse>(
    `${buildMoneyItemsPath(careGroupId)}/split-preview`,
    payload,
  );

const splitMoneyItems = (careGroupId: string, payload: SplitMoneyPayload) =>
  apiClient.post<SplitResponse>(
    `${buildMoneyItemsPath(careGroupId)}/split`,
    payload,
  );

const getSplitPreviewByBatchId = (
  careGroupId: string,
  params: SplitPreviewByBatchParams,
) =>
  apiClient.get<SplitPreviewResponse>(
    `${buildMoneyItemsPath(careGroupId)}/split-preview`,
    { params },
  );

const getMemberTotals = (careGroupId: string, params?: MemberTotalsParams) =>
  apiClient.get<MemberTotalsResponse>(
    `${buildMoneyItemsPath(careGroupId)}/member-totals`,
    { params },
  );

export {
  getMoneyItems,
  createMoneyItem,
  updateMoneyItem,
  deleteMoneyItem,
  splitPreview,
  splitMoneyItems,
  getSplitPreviewByBatchId,
  getMemberTotals,
};

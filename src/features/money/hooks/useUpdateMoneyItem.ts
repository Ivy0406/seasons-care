import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format, parse } from 'date-fns';

import { updateMoneyItem } from '@/api/endpoints/money';
import { CURRENT_GROUP_ID_KEY } from '@/constants/auth';
import moneyKeys from '@/features/money/queryKeys';
import type { MoneyDraft } from '@/features/money/types';
import type { UpdateMoneyItemPayLoad } from '@/types/money';

type UpdateMoneyItemResult =
  | { success: true }
  | { success: false; message: string };

const getCurrentCareGroupId = () =>
  window.localStorage.getItem(CURRENT_GROUP_ID_KEY);

function formatForPayload(
  draft: MoneyDraft,
  currentUpdatedAt: string,
): UpdateMoneyItemPayLoad {
  const parsedDate = parse(
    `${draft.dateValue} ${draft.timeValue}`,
    'yyyy/MM/dd HH:mm',
    new Date(),
  );

  return {
    title: draft.title,
    amount: Number(draft.amount) || 0,
    category: draft.category ?? 'other',
    notes: draft.notes,
    expenseDate: format(parsedDate, "yyyy-MM-dd'T'HH:mm"),
    splitStatus: draft.needsSplit ? 'pending' : 'none',
    updatedAt: currentUpdatedAt,
  };
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }
  return '發生預期外的問題，請稍後再嘗試';
}

function useUpdateMoneyItem() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleUpdateMoneyItem = async (
    expenseId: string,
    draft: MoneyDraft,
    currentUpdatedAt: string,
  ): Promise<UpdateMoneyItemResult> => {
    const careGroupId = getCurrentCareGroupId();

    if (!careGroupId) {
      return { success: false, message: '尚未選擇照護群組' };
    }

    setIsLoading(true);

    try {
      await updateMoneyItem(
        careGroupId,
        expenseId,
        formatForPayload(draft, currentUpdatedAt),
      );
      await queryClient.invalidateQueries({
        queryKey: moneyKeys.group(careGroupId),
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleUpdateMoneyItem };
}

export default useUpdateMoneyItem;

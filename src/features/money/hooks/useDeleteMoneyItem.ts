import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { deleteMoneyItem } from '@/api/endpoints/money';
import { CURRENT_GROUP_ID_KEY } from '@/constants/auth';
import moneyKeys from '@/features/money/queryKeys';

type DeleteMoneyItemResult =
  | { success: true }
  | { success: false; message: string };

const getCurrentCareGroupId = () =>
  window.localStorage.getItem(CURRENT_GROUP_ID_KEY);

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }
  return '發生預期外的問題，請稍後再嘗試';
}

function useDeleteMoneyItem() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDeleteMoneyItem = async (
    expenseId: string,
  ): Promise<DeleteMoneyItemResult> => {
    const careGroupId = getCurrentCareGroupId();

    if (!careGroupId) {
      return { success: false, message: '尚未選擇照護群組' };
    }

    setIsLoading(true);

    try {
      await deleteMoneyItem(careGroupId, expenseId);
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

  return { isLoading, handleDeleteMoneyItem };
}

export default useDeleteMoneyItem;

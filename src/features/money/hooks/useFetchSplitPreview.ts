import { useState } from 'react';

import axios from 'axios';

import { splitPreview } from '@/api/endpoints/money';
import { CURRENT_GROUP_ID_KEY } from '@/constants/auth';
import type { MemberSplit, SplitItem } from '@/features/money/types';
import type { SplitDetail, SplitPreviewItem } from '@/types/money';

type SplitPreviewResult =
  | { success: true; selectedItems: SplitItem[]; memberSplits: MemberSplit[] }
  | { success: false; message: string };

const getCurrentCareGroupId = () =>
  window.localStorage.getItem(CURRENT_GROUP_ID_KEY);

function toSplitItem({ id, title, amount }: SplitPreviewItem): SplitItem {
  return { id, title, amount };
}

function toMemberSplit({
  userId,
  name,
  avatarUrl,
  receivableAmount,
  payableAmount,
}: SplitDetail): MemberSplit {
  return {
    userId,
    username: name,
    avatarKey: avatarUrl,
    status: receivableAmount > 0 ? 'receivable' : 'payable',
    amount: receivableAmount > 0 ? receivableAmount : payableAmount,
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

function useFetchSplitPreview() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchPreview = async (
    expenseIds: string[],
    targetUserIds: string[],
  ): Promise<SplitPreviewResult> => {
    const careGroupId = getCurrentCareGroupId();

    if (!careGroupId) {
      return { success: false, message: '尚未選擇照護群組' };
    }

    setIsLoading(true);

    try {
      const res = await splitPreview(careGroupId, {
        splitMode: 'custom',
        expenseIds,
        targetUserIds,
      });

      const { selectedExpenses, splitDetails } = res.data.data;
      return {
        success: true,
        selectedItems: selectedExpenses.map(toSplitItem),
        memberSplits: splitDetails.map(toMemberSplit),
      };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, fetchPreview };
}

export default useFetchSplitPreview;

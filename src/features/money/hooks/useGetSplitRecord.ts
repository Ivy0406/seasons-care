import { useState } from 'react';

import axios from 'axios';

import { getSplitPreviewByBatchId } from '@/api/endpoints/money';
import { CURRENT_GROUP_ID_KEY } from '@/constants/auth';
import type { MemberSplit, SplitItem } from '@/features/money/types';
import type {
  SplitDetail,
  SplitExecutedBy,
  SplitPreviewItem,
} from '@/types/money';

type SplitRecord = {
  selectedItems: SplitItem[];
  memberSplits: MemberSplit[];
  executedBy: SplitExecutedBy;
  executedAt: string;
};

type GetSplitRecordResult =
  | ({ success: true } & SplitRecord)
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

function useGetSplitRecord() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecord = async (
    splitBatchId: string,
  ): Promise<GetSplitRecordResult> => {
    const careGroupId = getCurrentCareGroupId();

    if (!careGroupId) {
      return { success: false, message: '尚未選擇照護群組' };
    }

    setIsLoading(true);

    try {
      const res = await getSplitPreviewByBatchId(careGroupId, { splitBatchId });
      const { selectedExpenses, splitDetails, executedBy, executedAt } =
        res.data.data;

      if (!executedBy || !executedAt) {
        return { success: false, message: '查無分帳紀錄' };
      }

      return {
        success: true,
        selectedItems: selectedExpenses.map(toSplitItem),
        memberSplits: splitDetails.map(toMemberSplit),
        executedBy,
        executedAt,
      };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, fetchRecord };
}

export default useGetSplitRecord;

import { useState } from 'react';

import axios from 'axios';
import { toast } from 'sonner';

import { updateCareLogEntry } from '@/api/endpoints/careLog';
import { CURRENT_GROUP_ID_KEY } from '@/constants/auth';
import type { CareLogEntry } from '@/pages/CareLog/types';
import {
  toCareLogEntry,
  toUpdateCareLogPayload,
} from '@/pages/CareLog/utils/careLogMappers';

const getCurrentCareGroupId = () =>
  window.localStorage.getItem(CURRENT_GROUP_ID_KEY);

function getErrorDetail(error: unknown) {
  if (!axios.isAxiosError(error)) return undefined;

  const detail = error.response?.data?.detail;

  return typeof detail === 'string' && detail.trim().length > 0
    ? detail
    : undefined;
}

function useUpdateCareLogEntry() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateCareLogEntry = async (entry: CareLogEntry) => {
    const careGroupId = getCurrentCareGroupId();

    if (!careGroupId) {
      toast.error('尚未選擇照護群組，無法更新任務');
      return null;
    }

    setIsLoading(true);

    try {
      const response = await updateCareLogEntry(
        careGroupId,
        entry.id,
        toUpdateCareLogPayload(entry),
      );

      return toCareLogEntry(response.data.data, entry);
    } catch (error) {
      const detail = getErrorDetail(error);

      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 400:
            toast.error(detail ?? '請確認任務資料格式是否正確');
            break;
          case 401:
            toast.error(detail ?? '請先登入後再更新任務');
            break;
          case 403:
            toast.error(detail ?? '你沒有權限更新此任務');
            break;
          case 404:
            toast.error(detail ?? '找不到要更新的任務');
            break;
          default:
            toast.error(detail ?? '更新任務失敗，請稍後再試');
            break;
        }
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleUpdateCareLogEntry,
  };
}

export default useUpdateCareLogEntry;

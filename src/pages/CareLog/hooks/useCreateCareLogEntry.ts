import { useState } from 'react';

import axios from 'axios';
import { toast } from 'sonner';

import { createCareLogEntry } from '@/api/endpoints/careLog';
import { CURRENT_GROUP_ID_KEY, CURRENT_USER_ID_KEY } from '@/constants/auth';
import type { CareLogEntry } from '@/pages/CareLog/types';
import {
  toCareLogEntry,
  toCreateCareLogPayload,
} from '@/pages/CareLog/utils/careLogMappers';

const getCurrentCareGroupId = () =>
  window.localStorage.getItem(CURRENT_GROUP_ID_KEY);

const getCurrentUserId = () => window.localStorage.getItem(CURRENT_USER_ID_KEY);

function getErrorDetail(error: unknown) {
  if (!axios.isAxiosError(error)) return undefined;

  const detail = error.response?.data?.detail;

  return typeof detail === 'string' && detail.trim().length > 0
    ? detail
    : undefined;
}

function useCreateCareLogEntry() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCareLogEntry = async (entry: CareLogEntry) => {
    const careGroupId = getCurrentCareGroupId();
    const currentUserId = getCurrentUserId();

    if (!careGroupId) {
      toast.error('尚未選擇照護群組，無法新增日誌');
      return null;
    }

    if (!currentUserId) {
      toast.error('尚未取得目前使用者資訊，無法新增日誌');
      return null;
    }

    setIsLoading(true);

    try {
      const response = await createCareLogEntry(
        careGroupId,
        toCreateCareLogPayload(entry, currentUserId),
      );

      return toCareLogEntry(response.data.data, entry);
    } catch (error) {
      const detail = getErrorDetail(error);

      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 400:
            toast.error(detail ?? '請確認日誌資料格式是否正確');
            break;
          case 401:
            toast.error(detail ?? '請先登入後再新增日誌');
            break;
          case 403:
            toast.error(detail ?? '你沒有權限在此群組新增日誌');
            break;
          case 404:
            toast.error(detail ?? '找不到目前的照護群組');
            break;
          default:
            toast.error(detail ?? '新增日誌失敗，請稍後再試');
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
    handleCreateCareLogEntry,
  };
}

export default useCreateCareLogEntry;

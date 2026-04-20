import { useState } from 'react';

import axios from 'axios';
import { toast } from 'sonner';

import { deleteCareLogEntry } from '@/api/endpoints/careLog';
import { CURRENT_GROUP_ID_KEY } from '@/constants/auth';

const getCurrentCareGroupId = () =>
  window.localStorage.getItem(CURRENT_GROUP_ID_KEY);

function getErrorDetail(error: unknown) {
  if (!axios.isAxiosError(error)) return undefined;

  const detail = error.response?.data?.detail;

  return typeof detail === 'string' && detail.trim().length > 0
    ? detail
    : undefined;
}

function useDeleteCareLogEntry() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteCareLogEntry = async (careLogId: string) => {
    const careGroupId = getCurrentCareGroupId();

    if (!careGroupId) {
      toast.error('尚未選擇照護群組，無法刪除任務');
      return false;
    }

    setIsLoading(true);

    try {
      await deleteCareLogEntry(careGroupId, careLogId);
      return true;
    } catch (error) {
      const detail = getErrorDetail(error);

      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            toast.error(detail ?? '請先登入後再刪除任務');
            break;
          case 403:
            toast.error(detail ?? '你沒有權限刪除此任務');
            break;
          case 404:
            toast.error(detail ?? '找不到要刪除的任務');
            break;
          default:
            toast.error(detail ?? '刪除任務失敗，請稍後再試');
            break;
        }
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleDeleteCareLogEntry,
  };
}

export default useDeleteCareLogEntry;

import { useState } from 'react';

import axios from 'axios';
import { toast } from 'sonner';

import { deleteEventSeries } from '@/api/endpoints/eventSeries';
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

function useDeleteEventSeries() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteEventSeries = async (eventId: string) => {
    const careGroupId = getCurrentCareGroupId();

    if (!careGroupId) {
      toast.error('尚未選擇照護群組，無法刪除重複事件');
      return false;
    }

    setIsLoading(true);

    try {
      await deleteEventSeries(careGroupId, eventId);
      return true;
    } catch (error) {
      const detail = getErrorDetail(error);

      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            toast.error(detail ?? '請先登入後再刪除重複事件');
            break;
          case 403:
            toast.error(detail ?? '你沒有權限刪除此重複事件');
            break;
          case 404:
            toast.error(detail ?? '找不到要刪除的重複事件');
            break;
          default:
            toast.error(detail ?? '刪除重複事件失敗，請稍後再試');
            break;
        }
      } else {
        toast.error('刪除重複事件失敗，請稍後再試');
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleDeleteEventSeries,
  };
}

export default useDeleteEventSeries;

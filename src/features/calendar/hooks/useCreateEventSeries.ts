import { useState } from 'react';

import axios from 'axios';
import { toast } from 'sonner';

import createEventSeries from '@/api/endpoints/eventSeries';
import { CURRENT_GROUP_ID_KEY, CURRENT_USER_KEY } from '@/constants/auth';
import toCreateEventSeriesPayload from '@/features/calendar/utils/eventSeriesMappers';
import type { CareLogEntry } from '@/pages/CareLog/types';
import type { UserInfo } from '@/types/auth';

const getCurrentCareGroupId = () =>
  window.localStorage.getItem(CURRENT_GROUP_ID_KEY);

function getCurrentUserId() {
  const rawCurrentUser = window.localStorage.getItem(CURRENT_USER_KEY);

  if (rawCurrentUser) {
    try {
      const currentUser = JSON.parse(rawCurrentUser) as Partial<UserInfo>;

      if (typeof currentUser.id === 'string' && currentUser.id.length > 0) {
        return currentUser.id;
      }
    } catch {
      window.localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  return null;
}

function getErrorDetail(error: unknown) {
  if (!axios.isAxiosError(error)) return undefined;

  const detail = error.response?.data?.detail;

  return typeof detail === 'string' && detail.trim().length > 0
    ? detail
    : undefined;
}

function useCreateEventSeries() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateEventSeries = async (entry: CareLogEntry) => {
    const careGroupId = getCurrentCareGroupId();
    const currentUserId = getCurrentUserId();

    if (!careGroupId) {
      toast.error('尚未選擇照護群組，無法新增重複事件');
      return null;
    }

    setIsLoading(true);

    try {
      const response = await createEventSeries(
        careGroupId,
        toCreateEventSeriesPayload(entry, currentUserId),
      );

      return {
        startsAt:
          response.data.data.scheduledAt ??
          response.data.data.startsAt ??
          entry.startsAt,
      };
    } catch (error) {
      const detail = getErrorDetail(error);

      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 400:
          case 422:
            toast.error(detail ?? '請確認重複事件資料格式是否正確');
            break;
          case 401:
            toast.error(detail ?? '請先登入後再新增重複事件');
            break;
          case 403:
            toast.error(detail ?? '你沒有權限在此群組新增重複事件');
            break;
          case 404:
            toast.error(detail ?? '找不到目前的照護群組');
            break;
          default:
            toast.error(detail ?? '新增重複事件失敗，請稍後再試');
            break;
        }
      } else {
        toast.error('新增重複事件失敗，請稍後再試');
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleCreateEventSeries,
  };
}

export default useCreateEventSeries;

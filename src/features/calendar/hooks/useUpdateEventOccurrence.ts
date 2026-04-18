import { useState } from 'react';

import axios from 'axios';
import { toast } from 'sonner';

import { updateEventOccurrenceStatus } from '@/api/endpoints/eventSeries';
import { CURRENT_GROUP_ID_KEY } from '@/constants/auth';
import type { CareLogEntry } from '@/pages/CareLog/types';

const getCurrentCareGroupId = () =>
  window.localStorage.getItem(CURRENT_GROUP_ID_KEY);

function getErrorDetail(error: unknown) {
  if (!axios.isAxiosError(error)) return undefined;

  const detail = error.response?.data?.detail;

  return typeof detail === 'string' && detail.trim().length > 0
    ? detail
    : undefined;
}

function useUpdateEventOccurrence() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateEventOccurrence = async (entry: CareLogEntry) => {
    const careGroupId = getCurrentCareGroupId();
    const eventId = entry.sourceId;

    if (!careGroupId) {
      toast.error('尚未選擇照護群組，無法更新單次重複事件');
      return null;
    }

    if (!eventId) {
      toast.error('缺少重複事件識別資訊，無法更新');
      return null;
    }

    setIsLoading(true);

    try {
      const response = await updateEventOccurrenceStatus(careGroupId, eventId, {
        scheduledAt: entry.startsAt,
        status: entry.status,
        description: entry.description,
        participants: entry.participants.map((participant) => participant.id),
      });

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
            toast.error(detail ?? '請確認單次重複事件資料格式是否正確');
            break;
          case 401:
            toast.error(detail ?? '請先登入後再更新單次重複事件');
            break;
          case 403:
            toast.error(detail ?? '你沒有權限更新此單次重複事件');
            break;
          case 404:
            toast.error(detail ?? '找不到要更新的單次重複事件');
            break;
          default:
            toast.error(detail ?? '更新單次重複事件失敗，請稍後再試');
            break;
        }
      } else {
        toast.error('更新單次重複事件失敗，請稍後再試');
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleUpdateEventOccurrence,
  };
}

export default useUpdateEventOccurrence;

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import apiClient from '@/api/client';
import { CURRENT_GROUP_ID_KEY } from '@/constants/auth';
import calendarKeys from '@/features/calendar/queryKeys';
import type {
  EventSeriesApiResponse,
  EventSeriesItem,
} from '@/types/eventSeries';

const getCurrentCareGroupId = () =>
  window.localStorage.getItem(CURRENT_GROUP_ID_KEY);

function useGetEventSeries() {
  const careGroupId = getCurrentCareGroupId();
  const hasCareGroupId = !!careGroupId;

  const query = useQuery({
    queryKey: careGroupId
      ? calendarKeys.eventSeries(careGroupId)
      : calendarKeys.all,
    queryFn: async () => {
      if (!careGroupId) return [];

      try {
        const response = await apiClient.get<
          EventSeriesApiResponse<EventSeriesItem[]>
        >(`/api/care-groups/${careGroupId}/event-series`, {
          headers: {
            careGroupId,
          },
        });

        return response.data.data;
      } catch {
        toast.error('載入重複事件失敗');
        return [];
      }
    },
    enabled: hasCareGroupId,
  });

  return {
    ...query,
    eventSeries: query.data ?? [],
  };
}

export default useGetEventSeries;

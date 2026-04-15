import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getTodayInsight } from '@/api/endpoints/health-dashboard';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type { TodayInsightResponse } from '@/types/health-dashboard';

import healthKeys from '../queryKeys';

import type { AxiosResponse } from 'axios';

function select(res: AxiosResponse<TodayInsightResponse>) {
  return res.data.data.summary;
}

function useGetTodayInsight() {
  const { currentGroupId } = useCurrentGroupId();

  return useQuery({
    queryKey: currentGroupId
      ? healthKeys.todayInsight(currentGroupId)
      : healthKeys.all,
    queryFn: async () => {
      try {
        return await getTodayInsight(currentGroupId ?? '');
      } catch {
        toast.error('載入今日健康摘要失敗');
        throw new Error('fetch-today-insight-failed');
      }
    },
    select,
    enabled: !!currentGroupId,
  });
}

export default useGetTodayInsight;

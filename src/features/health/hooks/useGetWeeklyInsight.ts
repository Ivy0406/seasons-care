import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getWeeklyInsight } from '@/api/endpoints/health-dashboard';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type { WeeklyInsightResponse } from '@/types/health-dashboard';

import healthKeys from '../queryKeys';

import type { AxiosResponse } from 'axios';

function select(res: AxiosResponse<WeeklyInsightResponse>) {
  const { overallSummary, keyInsight, actionSuggestion } = res.data.data;
  return { overallSummary, keyInsight, actionSuggestion };
}

function useGetWeeklyInsight() {
  const { currentGroupId } = useCurrentGroupId();

  return useQuery({
    queryKey: currentGroupId
      ? healthKeys.weeklyInsight(currentGroupId)
      : healthKeys.all,
    queryFn: async () => {
      try {
        return await getWeeklyInsight(currentGroupId ?? '');
      } catch {
        toast.error('載入健康週報失敗');
        throw new Error('fetch-weekly-insight-failed');
      }
    },
    select,
    enabled: !!currentGroupId,
  });
}

export default useGetWeeklyInsight;

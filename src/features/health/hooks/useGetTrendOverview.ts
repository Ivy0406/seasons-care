import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getTrendOverview } from '@/api/endpoints/health-dashboard';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type {
  MetricData,
  MetricTypeValue,
  TrendOverviewResponse,
} from '@/types/health-dashboard';

import healthKeys from '../queryKeys';

import type { AxiosResponse } from 'axios';

function select(
  res: AxiosResponse<TrendOverviewResponse>,
): Record<MetricTypeValue, MetricData> {
  return Object.fromEntries(
    res.data.data.metrics.map((m) => [m.metricType, m]),
  ) as Record<MetricTypeValue, MetricData>;
}

function useGetTrendOverview() {
  const { currentGroupId } = useCurrentGroupId();

  return useQuery({
    queryKey: currentGroupId
      ? healthKeys.trendOverview(currentGroupId)
      : healthKeys.all,
    queryFn: async () => {
      try {
        return await getTrendOverview(currentGroupId ?? '');
      } catch {
        toast.error('載入健康趨勢失敗');
        throw new Error('fetch-trend-overview-failed');
      }
    },
    select,
    enabled: !!currentGroupId,
  });
}

export default useGetTrendOverview;

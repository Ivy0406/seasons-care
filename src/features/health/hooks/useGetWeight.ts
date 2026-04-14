import { useQuery } from '@tanstack/react-query';
import { format, isSameDay, parseISO } from 'date-fns';

import { getWeights } from '@/api/endpoints/health';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type { GetWeightsResponse, WeightData } from '@/types/health';

import healthKeys from '../queryKeys';

import type { AxiosResponse } from 'axios';

const defaultData: WeightData = { date: '--', time: '--', value: '--' };

function transformToLatestToday(
  res: AxiosResponse<GetWeightsResponse>,
): WeightData {
  const now = new Date();
  const todayRecords = res.data.data.filter((r) =>
    isSameDay(parseISO(r.recordDate), now),
  );
  if (todayRecords.length === 0) return defaultData;

  const latest = todayRecords.sort(
    (a, b) =>
      parseISO(b.recordDate).getTime() - parseISO(a.recordDate).getTime(),
  )[0];
  const dateObj = parseISO(latest.recordDate);
  return {
    date: dateObj.toLocaleDateString('zh-TW'),
    time: format(dateObj, 'HH:mm'),
    value: latest.value,
  };
}

function useGetWeight() {
  const { currentGroupId } = useCurrentGroupId();

  return useQuery({
    queryKey: currentGroupId
      ? healthKeys.weight(currentGroupId)
      : healthKeys.all,
    queryFn: () => getWeights(currentGroupId ?? ''),
    select: transformToLatestToday,
    enabled: !!currentGroupId,
  });
}

export default useGetWeight;

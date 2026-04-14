import { useQuery } from '@tanstack/react-query';
import { isSameDay, parseISO } from 'date-fns';

import { getBloodSugars } from '@/api/endpoints/health';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type { GetBloodSugarsResponse, BloodSugarData } from '@/types/health';

import healthKeys from '../queryKeys';

import type { AxiosResponse } from 'axios';

const defaultData: BloodSugarData = { morning: '--', noon: '--', night: '--' };

function getTimeSlot(recordDate: string): 'morning' | 'noon' | 'night' {
  const hour = parseISO(recordDate).getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'noon';
  return 'night';
}

function transformToLatestToday(
  res: AxiosResponse<GetBloodSugarsResponse>,
): BloodSugarData {
  const now = new Date();
  const todayRecords = res.data.data.filter((r) =>
    isSameDay(parseISO(r.recordDate), now),
  );
  if (todayRecords.length === 0) return defaultData;

  const latestPerSlot: Record<
    string,
    { glucoseLevel: number; recordDate: string }
  > = {};
  todayRecords.forEach((r) => {
    const slot = getTimeSlot(r.recordDate);
    if (
      !latestPerSlot[slot] ||
      parseISO(r.recordDate) > parseISO(latestPerSlot[slot].recordDate)
    ) {
      latestPerSlot[slot] = {
        glucoseLevel: r.glucoseLevel,
        recordDate: r.recordDate,
      };
    }
  });

  return {
    morning: latestPerSlot.morning?.glucoseLevel ?? '--',
    noon: latestPerSlot.noon?.glucoseLevel ?? '--',
    night: latestPerSlot.night?.glucoseLevel ?? '--',
  };
}

function useGetBloodSugar() {
  const { currentGroupId } = useCurrentGroupId();

  return useQuery({
    queryKey: currentGroupId
      ? healthKeys.bloodSugar(currentGroupId)
      : healthKeys.all,
    queryFn: () => getBloodSugars(currentGroupId ?? ''),
    select: transformToLatestToday,
    enabled: !!currentGroupId,
  });
}

export default useGetBloodSugar;

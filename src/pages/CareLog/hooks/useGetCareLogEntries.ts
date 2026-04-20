import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getCareLogEntries } from '@/api/endpoints/careLog';
import { CURRENT_GROUP_ID_KEY } from '@/constants/auth';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import careLogKeys from '@/pages/CareLog/queryKeys';
import { toCareLogEntries } from '@/pages/CareLog/utils/careLogMappers';

const getCurrentCareGroupId = () =>
  window.localStorage.getItem(CURRENT_GROUP_ID_KEY);

function useGetCareLogEntries() {
  const careGroupId = getCurrentCareGroupId();
  const hasCareGroupId = !!careGroupId;
  const { data: groupMembers = [] } = useGetGroupMembers(careGroupId ?? '');

  const query = useQuery({
    queryKey: careGroupId ? careLogKeys.list(careGroupId) : careLogKeys.all,
    queryFn: async () => {
      if (!careGroupId) return [];

      try {
        const response = await getCareLogEntries(careGroupId);
        return response.data.data;
      } catch {
        toast.error('載入任務失敗');
        return [];
      }
    },
    enabled: hasCareGroupId,
  });

  const entries = useMemo(
    () => toCareLogEntries(query.data ?? [], groupMembers),
    [groupMembers, query.data],
  );

  const refetchEntries = async () => {
    const result = await query.refetch();
    return toCareLogEntries(result.data ?? [], groupMembers);
  };

  return {
    ...query,
    entries,
    careGroupId,
    refetchEntries,
  };
}

export default useGetCareLogEntries;

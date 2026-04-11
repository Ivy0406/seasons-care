import { useQuery, useQueryClient } from '@tanstack/react-query';

import { CURRENT_GROUP_ID_KEY } from '@/constants/auth';

function useCurrentGroupId() {
  const queryClient = useQueryClient();

  const { data: currentGroupId } = useQuery({
    queryKey: [CURRENT_GROUP_ID_KEY],
    queryFn: () => localStorage.getItem(CURRENT_GROUP_ID_KEY) ?? '',
    initialData: localStorage.getItem(CURRENT_GROUP_ID_KEY) ?? '',
    staleTime: Infinity,
  });

  const setCurrentGroupId = (id: string) => {
    localStorage.setItem(CURRENT_GROUP_ID_KEY, id);
    queryClient.setQueryData([CURRENT_GROUP_ID_KEY], id);
  };

  return { currentGroupId, setCurrentGroupId } as const;
}

export default useCurrentGroupId;

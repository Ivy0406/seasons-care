import { useQuery } from '@tanstack/react-query';

import { getMyGroups } from '@/api/endpoints/group';

function useGetGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await getMyGroups();
      return res.data.data;
    },
  });
}

export default useGetGroups;

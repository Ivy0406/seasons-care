import { useQuery } from '@tanstack/react-query';

import { getGroups } from '@/api/endpoints/group';

function useGetGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await getGroups();
      return res.data.data;
    },
  });
}

export default useGetGroups;

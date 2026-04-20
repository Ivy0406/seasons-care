import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getMyGroups } from '@/api/endpoints/group';

function useGetGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      try {
        const res = await getMyGroups();
        return res.data.data;
      } catch {
        toast.error('載入群組失敗');
        return [];
      }
    },
  });
}

export default useGetGroups;

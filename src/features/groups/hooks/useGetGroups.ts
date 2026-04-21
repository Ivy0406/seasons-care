import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

import { getMyGroups } from '@/api/endpoints/group';
import { TOKEN_KEY } from '@/constants/auth';

function useGetGroups() {
  return useQuery({
    queryKey: ['groups'],
    enabled: !!Cookies.get(TOKEN_KEY),
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

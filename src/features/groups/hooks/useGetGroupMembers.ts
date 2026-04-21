import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

import { getGroupDetail } from '@/api/endpoints/group';
import { TOKEN_KEY } from '@/constants/auth';
import type { GroupMember } from '@/types/group';

function useGetGroupMembers(groupId: string) {
  const hasGroupId = !!groupId;

  return useQuery<GroupMember[]>({
    queryKey: ['group', groupId, 'members'],
    queryFn: async () => {
      try {
        const res = await getGroupDetail(groupId);
        return res.data.data.members;
      } catch {
        toast.error('載入群組成員失敗');
        return [];
      }
    },
    enabled: hasGroupId && !!Cookies.get(TOKEN_KEY),
  });
}

export default useGetGroupMembers;

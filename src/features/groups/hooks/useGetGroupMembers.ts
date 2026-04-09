import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getGroupDetail } from '@/api/endpoints/group';
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
    enabled: hasGroupId,
  });
}

export default useGetGroupMembers;

import { useQuery } from '@tanstack/react-query';

import { getGroupDetail } from '@/api/endpoints/group';
import type { GroupMember } from '@/types/group';

function useGetGroupMembers(groupId: string) {
  const hasGroupId = !!groupId;

  return useQuery<GroupMember[]>({
    queryKey: ['group', groupId, 'members'],
    queryFn: async () => {
      const res = await getGroupDetail(groupId);
      return res.data.data.members;
    },
    enabled: hasGroupId,
  });
}

export default useGetGroupMembers;

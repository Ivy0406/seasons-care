import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import { joinGroup } from '@/api/endpoints/group';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type { CareGroupInfo, JoinGroupPayload } from '@/types/group';

const useJoinGroup = () => {
  const queryClient = useQueryClient();
  const { setCurrentGroupId } = useCurrentGroupId();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinGroup = async (payload: JoinGroupPayload) => {
    setIsLoading(true);

    try {
      const previousGroups =
        queryClient.getQueryData<CareGroupInfo[]>(['groups']) ?? [];
      const previousGroupIds = new Set(previousGroups.map((group) => group.id));

      const res = await joinGroup(payload);

      await queryClient.invalidateQueries({ queryKey: ['groups'] });
      await queryClient.refetchQueries({ queryKey: ['groups'] });

      const updatedGroups =
        queryClient.getQueryData<CareGroupInfo[]>(['groups']) ?? [];
      const joinedGroup =
        updatedGroups.find((group) => !previousGroupIds.has(group.id)) ??
        updatedGroups.find((group) => group.id === res.data.data) ??
        null;

      if (joinedGroup) {
        setCurrentGroupId(joinedGroup.id);
      }

      toast.success(res.data.message);
      return joinedGroup;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 400:
            toast.error('請確認邀請碼格式是否正確');
            break;
          case 401:
            toast.error('請先登入後再加入群組');
            break;
          case 409:
            toast.error('你已經在這個群組中了');
            break;
          default:
            toast.error('加入群組失敗，請稍後再試');
            break;
        }
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleJoinGroup };
};

export default useJoinGroup;

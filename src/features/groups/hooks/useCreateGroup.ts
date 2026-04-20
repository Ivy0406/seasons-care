import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import { createGroup } from '@/api/endpoints/group';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type { CreateGroupPayload } from '@/types/group';

const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const { setCurrentGroupId } = useCurrentGroupId();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGroup = async (payload: CreateGroupPayload) => {
    setIsLoading(true);
    try {
      const res = await createGroup(payload);
      setCurrentGroupId(res.data.data.id);
      await queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success(res.data.message);
      return res.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 400:
            toast.error('請確認群組資料格式是否正確');
            break;
          case 401:
            toast.error('請先登入後再建立群組');
            break;
          default:
            toast.error('建立群組失敗，請稍後再試');
            break;
        }
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreateGroup };
};

export default useCreateGroup;

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import { updateGroup } from '@/api/endpoints/group';
import type { UpdateGroupPayload } from '@/types/group';

const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateGroup = async (
    groupId: string,
    payload: UpdateGroupPayload,
  ) => {
    setIsLoading(true);

    try {
      const res = await updateGroup(groupId, payload);
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
            toast.error('請先登入後再編輯群組');
            break;
          case 404:
            toast.error('找不到要編輯的群組');
            break;
          default:
            toast.error('編輯群組失敗，請稍後再試');
            break;
        }
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleUpdateGroup };
};

export default useUpdateGroup;

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import { deleteGroupMember } from '@/api/endpoints/group';

function useDeleteGroupMember() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      groupId,
      userId,
    }: {
      groupId: string;
      userId: string;
    }) => {
      const res = await deleteGroupMember(groupId, userId);
      return res.data;
    },
  });

  const handleDeleteGroupMember = async (groupId: string, userId: string) => {
    try {
      const response = await mutation.mutateAsync({ groupId, userId });
      await queryClient.invalidateQueries({ queryKey: ['groups'] });
      await queryClient.invalidateQueries({
        queryKey: ['group', groupId, 'members'],
      });
      toast.success(response.message);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            toast.error('請先登入後再移除成員');
            break;
          case 403:
            toast.error('你沒有權限移除這位成員');
            break;
          case 404:
            toast.error('找不到要移除的成員');
            break;
          default:
            toast.error('移除成員失敗，請稍後再試');
            break;
        }
      }

      return false;
    }
  };

  return {
    isLoading: mutation.isPending,
    handleDeleteGroupMember,
  };
}

export default useDeleteGroupMember;

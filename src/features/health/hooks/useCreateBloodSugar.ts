import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBloodSugar } from '@/api/endpoints/health';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type { BloodSugarPayload } from '@/types/health';

import healthKeys from '../queryKeys';

function useCreateBloodSugar() {
  const queryClient = useQueryClient();
  const { currentGroupId } = useCurrentGroupId();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: BloodSugarPayload) => createBloodSugar(payload),
    onSuccess: () => {
      if (currentGroupId) {
        queryClient.invalidateQueries({
          queryKey: healthKeys.bloodSugar(currentGroupId),
        });
      }
    },
  });

  return { submit: mutateAsync, isLoading: isPending };
}

export default useCreateBloodSugar;

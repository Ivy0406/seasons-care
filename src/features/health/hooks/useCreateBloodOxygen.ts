import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBloodOxygen } from '@/api/endpoints/health';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type { BloodOxygensPayload } from '@/types/health';

import healthKeys from '../queryKeys';

function useCreateBloodOxygen() {
  const queryClient = useQueryClient();
  const { currentGroupId } = useCurrentGroupId();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: BloodOxygensPayload) => createBloodOxygen(payload),
    onSuccess: () => {
      if (currentGroupId) {
        queryClient.invalidateQueries({
          queryKey: healthKeys.bloodOxygen(currentGroupId),
        });
      }
    },
  });

  return { submit: mutateAsync, isLoading: isPending };
}

export default useCreateBloodOxygen;

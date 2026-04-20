import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createWeight } from '@/api/endpoints/health';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type { WeightPayload } from '@/types/health';

import healthKeys from '../queryKeys';

function useCreateWeight() {
  const queryClient = useQueryClient();
  const { currentGroupId } = useCurrentGroupId();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: WeightPayload) => createWeight(payload),
    onSuccess: () => {
      if (currentGroupId) {
        queryClient.invalidateQueries({
          queryKey: healthKeys.weight(currentGroupId),
        });
      }
    },
  });

  return { submit: mutateAsync, isLoading: isPending };
}

export default useCreateWeight;

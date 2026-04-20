import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTemperature } from '@/api/endpoints/health';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type { temperturesPayload } from '@/types/health';

import healthKeys from '../queryKeys';

function useCreateTemperature() {
  const queryClient = useQueryClient();
  const { currentGroupId } = useCurrentGroupId();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: temperturesPayload) => createTemperature(payload),
    onSuccess: () => {
      if (currentGroupId) {
        queryClient.invalidateQueries({
          queryKey: healthKeys.temperature(currentGroupId),
        });
      }
    },
  });

  return { submit: mutateAsync, isLoading: isPending };
}

export default useCreateTemperature;

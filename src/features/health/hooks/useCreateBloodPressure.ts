import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBloodPressure } from '@/api/endpoints/health';
import useCurrentGroupId from '@/hooks/useCurrentGroupId';
import type { BloodPressuresPayload } from '@/types/health';

import healthKeys from '../queryKeys';

function useCreateBloodPressure() {
  const queryClient = useQueryClient();
  const { currentGroupId } = useCurrentGroupId();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: BloodPressuresPayload) => createBloodPressure(payload),
    onSuccess: () => {
      if (currentGroupId) {
        queryClient.invalidateQueries({
          queryKey: healthKeys.bloodPressure(currentGroupId),
        });
      }
    },
  });

  return { submit: mutateAsync, isLoading: isPending };
}

export default useCreateBloodPressure;

import { useState } from 'react';

import { createWeight } from '@/api/endpoints/health';
import type { WeightPayload } from '@/types/health';

function useCreateWeight() {
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (payload: WeightPayload) => {
    setIsLoading(true);
    try {
      await createWeight(payload);
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading };
}

export default useCreateWeight;

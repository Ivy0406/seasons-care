import { useState } from 'react';

import { createBloodOxygen } from '@/api/endpoints/health';
import type { BloodOxygensPayload } from '@/types/health';

function useCreateBloodOxygen() {
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (payload: BloodOxygensPayload) => {
    setIsLoading(true);
    try {
      await createBloodOxygen(payload);
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading };
}

export default useCreateBloodOxygen;

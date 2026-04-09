import { useState } from 'react';

import { createBloodSugar } from '@/api/endpoints/health';
import type { BloodSugarPayload } from '@/types/health';

function useCreateBloodSugar() {
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (payload: BloodSugarPayload) => {
    setIsLoading(true);
    try {
      await createBloodSugar(payload);
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading };
}

export default useCreateBloodSugar;

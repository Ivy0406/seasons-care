import { useState } from 'react';

import { createBloodPressure } from '@/api/endpoints/health';
import type { BloodPressuresPayload } from '@/types/health';

function useCreateBloodPressure() {
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (payload: BloodPressuresPayload) => {
    setIsLoading(true);
    try {
      await createBloodPressure(payload);
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading };
}

export default useCreateBloodPressure;

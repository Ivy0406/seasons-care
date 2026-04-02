import { useState } from 'react';

import { createTemperature } from '@/api/endpoints/health';
import type { temperturesPayload } from '@/types/health';

function useCreateTemperature() {
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (payload: temperturesPayload) => {
    setIsLoading(true);
    try {
      await createTemperature(payload);
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading };
}

export default useCreateTemperature;

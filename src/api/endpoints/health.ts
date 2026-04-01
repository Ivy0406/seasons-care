import type { BloodOxygensPayload, BloodOxygensResponse } from '@/types/health';

import apiClient from '../client';

const careGroupId = localStorage.getItem('currentGroupId');

const createBloodOxygen = (payload: BloodOxygensPayload) => {
  return apiClient.post<BloodOxygensResponse>(
    `/api/care-groups/${careGroupId}/health-records/blood-oxygens`,
    payload,
  );
};

const getBloodOxygens = () => {
  return apiClient.get(
    `/api/care-groups/${careGroupId}/health-records/blood-oxygens`,
  );
};

export { createBloodOxygen, getBloodOxygens };

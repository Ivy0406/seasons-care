import type {
  BloodOxygensPayload,
  BloodOxygensResponse,
  GetBloodOxygensResponse,
  BloodPressuresPayload,
  BloodPressuresResponse,
  GetBloodPressuresResponse,
  GetBloodSugarsResponse,
  BloodSugarPayload,
  BloodSugarResponse,
  temperturesPayload,
  temperturesResponse,
  GetTemperaturesResponse,
  GetWeightsResponse,
  WeightPayload,
  WeightResponse,
} from '@/types/health';

import apiClient from '../client';

const createBloodOxygen = (payload: BloodOxygensPayload) => {
  const careGroupId = localStorage.getItem('currentGroupId');
  return apiClient.post<BloodOxygensResponse>(
    `/api/care-groups/${careGroupId}/health-records/blood-oxygens`,
    payload,
  );
};

const getBloodOxygens = (careGroupId: string) => {
  return apiClient.get<GetBloodOxygensResponse>(
    `/api/care-groups/${careGroupId}/health-records/blood-oxygens`,
  );
};

const createBloodPressure = (payload: BloodPressuresPayload) => {
  const careGroupId = localStorage.getItem('currentGroupId');
  return apiClient.post<BloodPressuresResponse>(
    `/api/care-groups/${careGroupId}/health-records/blood-pressures`,
    payload,
  );
};

const getBloodPressures = (careGroupId: string) => {
  return apiClient.get<GetBloodPressuresResponse>(
    `/api/care-groups/${careGroupId}/health-records/blood-pressures`,
  );
};

const createBloodSugar = (payload: BloodSugarPayload) => {
  const careGroupId = localStorage.getItem('currentGroupId');
  return apiClient.post<BloodSugarResponse>(
    `/api/care-groups/${careGroupId}/health-records/blood-sugars`,
    payload,
  );
};

const getBloodSugars = (careGroupId: string) => {
  return apiClient.get<GetBloodSugarsResponse>(
    `/api/care-groups/${careGroupId}/health-records/blood-sugars`,
  );
};

const createWeight = (payload: WeightPayload) => {
  const careGroupId = localStorage.getItem('currentGroupId');
  return apiClient.post<WeightResponse>(
    `/api/care-groups/${careGroupId}/health-records/weights`,
    payload,
  );
};

const getWeights = (careGroupId: string) => {
  return apiClient.get<GetWeightsResponse>(
    `/api/care-groups/${careGroupId}/health-records/weights`,
  );
};

const createTemperature = (payload: temperturesPayload) => {
  const careGroupId = localStorage.getItem('currentGroupId');
  return apiClient.post<temperturesResponse>(
    `/api/care-groups/${careGroupId}/health-records/temperatures`,
    payload,
  );
};

const getTemperatures = (careGroupId: string) => {
  return apiClient.get<GetTemperaturesResponse>(
    `/api/care-groups/${careGroupId}/health-records/temperatures`,
  );
};

export {
  createBloodOxygen,
  getBloodOxygens,
  createBloodPressure,
  getBloodPressures,
  createBloodSugar,
  getBloodSugars,
  createWeight,
  getWeights,
  createTemperature,
  getTemperatures,
};

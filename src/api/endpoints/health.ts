import type {
  BloodOxygensPayload,
  BloodOxygensResponse,
  BloodPressuresPayload,
  BloodPressuresResponse,
  GetBloodPressuresResponse,
  BloodSugarPayload,
  BloodSugarResponse,
  temperturesPayload,
  temperturesResponse,
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

const getBloodOxygens = () => {
  const careGroupId = localStorage.getItem('currentGroupId');
  return apiClient.get(
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

const getBloodPressures = () => {
  const careGroupId = localStorage.getItem('currentGroupId');
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

const getBloodSugars = () => {
  const careGroupId = localStorage.getItem('currentGroupId');
  return apiClient.get(
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

const getWeights = () => {
  const careGroupId = localStorage.getItem('currentGroupId');
  return apiClient.get(
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

const getTemperatures = () => {
  const careGroupId = localStorage.getItem('currentGroupId');
  return apiClient.get(
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

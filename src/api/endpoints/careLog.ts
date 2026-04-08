import apiClient from '@/api/client';
import type {
  CreateCareLogPayload,
  CreateCareLogResponse,
  GetCareLogEntriesParams,
  GetCareLogEntriesResponse,
} from '@/types/careLog';

const buildCareLogEntriesPath = (careGroupId: string) =>
  `/api/care-groups/${careGroupId}/care-logs`;

const createCareLogEntry = (
  careGroupId: string,
  payload: CreateCareLogPayload,
) =>
  apiClient.post<CreateCareLogResponse>(
    buildCareLogEntriesPath(careGroupId),
    payload,
  );

const getCareLogEntries = (
  careGroupId: string,
  params?: GetCareLogEntriesParams,
) =>
  apiClient.get<GetCareLogEntriesResponse>(buildCareLogEntriesPath(careGroupId), {
    params: {
      Page: params?.page,
      PageSize: params?.pageSize,
      Sort: params?.sort,
    },
  });

export { createCareLogEntry, getCareLogEntries };

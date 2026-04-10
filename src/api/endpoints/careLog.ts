import apiClient from '@/api/client';
import type {
  CreateCareLogPayload,
  CreateCareLogResponse,
  DeleteCareLogResponse,
  GetCareLogEntriesParams,
  GetCareLogEntriesResponse,
  UpdateCareLogPayload,
  UpdateCareLogResponse,
} from '@/types/careLog';

const buildCareLogEntriesPath = (careGroupId: string) =>
  `/api/care-groups/${careGroupId}/care-logs`;

const buildCareLogEntryPath = (careGroupId: string, careLogId: string) =>
  `${buildCareLogEntriesPath(careGroupId)}/${careLogId}`;

const createCareLogEntry = (
  careGroupId: string,
  payload: CreateCareLogPayload,
) =>
  apiClient.post<CreateCareLogResponse>(
    buildCareLogEntriesPath(careGroupId),
    payload,
  );

const updateCareLogEntry = (
  careGroupId: string,
  careLogId: string,
  payload: UpdateCareLogPayload,
) =>
  apiClient.put<UpdateCareLogResponse>(
    buildCareLogEntryPath(careGroupId, careLogId),
    payload,
  );

const deleteCareLogEntry = (careGroupId: string, careLogId: string) =>
  apiClient.delete<DeleteCareLogResponse>(
    buildCareLogEntryPath(careGroupId, careLogId),
  );

const getCareLogEntries = (
  careGroupId: string,
  params?: GetCareLogEntriesParams,
) =>
  apiClient.get<GetCareLogEntriesResponse>(
    buildCareLogEntriesPath(careGroupId),
    {
      params: {
        Page: params?.page,
        PageSize: params?.pageSize,
        Sort: params?.sort,
      },
    },
  );

export {
  createCareLogEntry,
  updateCareLogEntry,
  deleteCareLogEntry,
  getCareLogEntries,
};

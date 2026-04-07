import apiClient from '@/api/client';
import type {
  CreateGroupPayload,
  CreateGroupResponse,
  GetGroupsResponse,
} from '@/types/group';

const createGroup = (payload: CreateGroupPayload) =>
  apiClient.post<CreateGroupResponse>('/api/care-groups', payload);

const getGroups = () => apiClient.get<GetGroupsResponse>('/api/care-groups');

export { createGroup, getGroups };

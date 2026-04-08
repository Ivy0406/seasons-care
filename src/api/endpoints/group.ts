import apiClient from '@/api/client';
import type {
  CreateGroupPayload,
  CreateGroupResponse,
  GetGroupDetailResponse,
  GetMyGroupsResponse,
} from '@/types/group';

const createGroup = (payload: CreateGroupPayload) =>
  apiClient.post<CreateGroupResponse>('/api/care-groups', payload);

const getMyGroups = () =>
  apiClient.get<GetMyGroupsResponse>('/api/care-groups');

const getGroupDetail = (id: string) =>
  apiClient.get<GetGroupDetailResponse>(`/api/care-groups/${id}`);

export { createGroup, getMyGroups, getGroupDetail };

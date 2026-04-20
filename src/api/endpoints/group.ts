import apiClient from '@/api/client';
import type {
  CreateGroupPayload,
  CreateGroupResponse,
  DeleteGroupMemberResponse,
  GetGroupDetailResponse,
  GetMyGroupsResponse,
  JoinGroupPayload,
  JoinGroupResponse,
  UpdateGroupPayload,
  UpdateGroupResponse,
} from '@/types/group';

const createGroup = (payload: CreateGroupPayload) =>
  apiClient.post<CreateGroupResponse>('/api/care-groups', payload);

const updateGroup = (id: string, payload: UpdateGroupPayload) =>
  apiClient.put<UpdateGroupResponse>(`/api/care-groups/${id}`, payload);

const deleteGroupMember = (groupId: string, userId: string) =>
  apiClient.delete<DeleteGroupMemberResponse>(
    `/api/care-groups/${groupId}/members/${userId}`,
  );

const joinGroup = (payload: JoinGroupPayload) =>
  apiClient.post<JoinGroupResponse>('/api/care-groups/join', payload);

const getMyGroups = () =>
  apiClient.get<GetMyGroupsResponse>('/api/care-groups');

const getGroupDetail = (id: string) =>
  apiClient.get<GetGroupDetailResponse>(`/api/care-groups/${id}`);

export {
  createGroup,
  updateGroup,
  deleteGroupMember,
  joinGroup,
  getMyGroups,
  getGroupDetail,
};

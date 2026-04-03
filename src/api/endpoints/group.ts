import apiClient from '@/api/client';
import type { CreateGroupPayload, CreateGroupResponse } from '@/types/group';

const createGroup = (payload: CreateGroupPayload) =>
  apiClient.post<CreateGroupResponse>('/api/care-groups', payload);

export default createGroup;

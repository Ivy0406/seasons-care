import apiClient from '@/api/client';
import type { SetupProfilePayload } from '@/types/auth';

const setupProfile = (payload: SetupProfilePayload) =>
  apiClient.patch('/api/users/me', payload);

export default setupProfile;

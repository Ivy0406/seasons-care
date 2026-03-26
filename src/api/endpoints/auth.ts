import apiClient from '@/api/client';

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  avatar: string;
};

const register = (payload: RegisterPayload) =>
  apiClient.post('/api/auth/register', payload);

export { register, type RegisterPayload };

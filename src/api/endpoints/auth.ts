import apiClient from '@/api/client';

type RegisterPayload = {
  userName: string;
  email: string;
  password: string;
};

const register = (payload: RegisterPayload) =>
  apiClient.post('/auth/register', payload);

export { register, type RegisterPayload };

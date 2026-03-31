import apiClient from '@/api/client';
import type {
  RegisterPayload,
  LoginPayload,
  LoginResponse,
} from '@/types/auth';

const register = (payload: RegisterPayload) =>
  apiClient.post('/api/auth/register', payload);

const login = (payload: LoginPayload) =>
  apiClient.post<LoginResponse>('/api/auth/login', payload);

export { register, login };

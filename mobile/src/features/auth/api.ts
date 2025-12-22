import { http } from '../../shared/lib/http';
import type { AuthResponse, LoginInput, RegisterInput } from './types';

export const authApi = {
  login: async (input: LoginInput) => {
    const { data } = await http.post<AuthResponse>('/auth/login', input);
    return data;
  },
  register: async (input: RegisterInput) => {
    const { data } = await http.post<AuthResponse>('/auth/register', input);
    return data;
  },
};
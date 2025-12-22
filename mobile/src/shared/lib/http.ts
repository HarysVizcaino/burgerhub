import axios from 'axios';
import { API_BASE_URL } from '../config/env';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token: string | null) {
  if (!token) {
    delete http.defaults.headers.common.Authorization;
    return;
  }
  http.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function getErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    const msg =
      (err.response?.data as any)?.message ??
      (err.response?.data as any)?.error ??
      err.message;
    return typeof msg === 'string' ? msg : JSON.stringify(msg);
  }
  return err instanceof Error ? err.message : 'Unknown error';
}
import { useEffect } from 'react';
import { setAuthToken } from '../lib/http';
import { useAuth } from '../providers/AuthProvider';

export function useSyncAuthToken() {
  const { token } = useAuth();

  useEffect(() => {
    setAuthToken(token);
  }, [token]);
}
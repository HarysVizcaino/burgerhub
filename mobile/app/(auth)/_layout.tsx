import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/shared/providers/AuthProvider';

export default function AuthLayout() {
  const { isAuthed, loading } = useAuth();

  if (loading) return null;

  if (isAuthed) {
    return <Redirect href="/(app)/burgers" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
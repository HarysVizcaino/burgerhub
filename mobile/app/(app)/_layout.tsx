import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/shared/providers/AuthProvider';

export default function AppLayout() {
  const { isAuthed, loading } = useAuth();

  if (loading) return null;

  if (!isAuthed) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
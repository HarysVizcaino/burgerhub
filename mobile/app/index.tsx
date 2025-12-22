import { Redirect } from 'expo-router';
import { useAuth } from '../src/shared/providers/AuthProvider';

export default function Index() {
  const { isAuthed, loading } = useAuth();
  if (loading) return null;

  return <Redirect href={isAuthed ? '/(app)/burgers' : '/(auth)/login'} />;
}
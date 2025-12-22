import { Stack } from 'expo-router';
import { AuthProvider } from '../src/shared/providers/AuthProvider';
import { useSyncAuthToken } from '../src/shared/hooks/useSyncAuthToken';

function RootNavigator() {
  useSyncAuthToken();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
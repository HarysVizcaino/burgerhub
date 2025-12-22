import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { authApi } from '../../src/features/auth/api';
import { useAuth } from '../../src/shared/providers/AuthProvider';
import { getErrorMessage } from '../../src/shared/lib/http';



export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await authApi.login({ email, password });
      await signIn(res.accessToken);
      router.replace('/(app)/burgers');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>BurgerHub</Text>
      <Text style={{ fontSize: 16 }}>Sign in</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
      />

      {error ? <Text style={{ marginTop: 4 }}>Error: {error}</Text> : null}

      <Pressable
        onPress={onSubmit}
        disabled={submitting}
        style={{ padding: 12, borderWidth: 1, borderRadius: 10, alignItems: 'center' }}
      >
        {submitting ? <ActivityIndicator /> : <Text>Login</Text>}
      </Pressable>
    </View>
  );
}
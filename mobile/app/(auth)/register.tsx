import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { authApi } from '../../src/features/auth/api';
import { getErrorMessage } from '../../src/shared/lib/http';
import { useAuth } from '../../src/shared/providers/AuthProvider';
import { Input, Button } from '../../src/shared/ui';

export default function RegisterScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await authApi.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

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
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Register</Text>

      <Input
        placeholder="Name"
        value={name}
        onChangeText={setName}
        editable={!submitting}
      />

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        editable={!submitting}
      />

      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!submitting}
      />

      {error ? <Text style={{ color: '#ef4444' }}>Error: {error}</Text> : null}

      <Button title="Create account" onPress={submit} loading={submitting} />

      <Button
        title="Already have an account? Login"
        variant="link"
        onPress={() => router.replace('/(auth)/login')}
      />
    </View>
  );
}

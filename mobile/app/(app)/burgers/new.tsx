import React, { useState } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { burgersApi } from '../../../src/features/burgers/api';
import { getErrorMessage } from '../../../src/shared/lib/http';
import { Input, Button } from '../../../src/shared/ui';

export default function NewBurgerScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const n = name.trim();
    const ing = ingredients
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!n || ing.length === 0) {
      setError('Name and at least 1 ingredient are required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await burgersApi.create({
        name: n,
        ingredients: ing,
      });

      router.push(`/(app)/burgers/${created.id}`);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Button
        title="← Back"
        variant="link"
        onPress={() => router.back()}
        style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
      />

      <Text style={{ fontSize: 22, fontWeight: '700' }}>Create Burger</Text>

      <Input
        placeholder="Name"
        value={name}
        onChangeText={setName}
        editable={!submitting}
      />

      <Input
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChangeText={setIngredients}
        editable={!submitting}
      />

      <Input
        placeholder="Image URL (optional)"
        value={image}
        onChangeText={setImage}
        editable={!submitting}
        autoCapitalize="none"
      />

      {error ? <Text style={{ color: '#ef4444' }}>Error: {error}</Text> : null}

      <Button title="Create" onPress={submit} loading={submitting} />
    </SafeAreaView>
  );
}

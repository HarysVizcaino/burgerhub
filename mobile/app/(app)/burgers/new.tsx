import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { burgersApi } from '../../../src/features/burgers/api';
import { getErrorMessage } from '../../../src/shared/lib/http';

export default function NewBurgerScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState(''); // comma-separated
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
      console.log('creating burger', n, ing);
      const created = await burgersApi.create({
        name: n,
        ingredients: ing,
      });

      console.log('created burger', created);
      router.push(`/(app)/burgers/${created.id}`);
    } catch (e) {
      console.error('error creating burger', e);
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Create Burger</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        editable={!submitting}
        style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
      />

      <TextInput
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChangeText={setIngredients}
        editable={!submitting}
        style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
      />

      <TextInput
        placeholder="Image URL (optional)"
        value={image}
        onChangeText={setImage}
        editable={!submitting}
        autoCapitalize="none"
        style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
      />

      {error ? <Text>Error: {error}</Text> : null}

      <Pressable
        onPress={submit}
        disabled={submitting}
        style={{ padding: 12, borderWidth: 1, borderRadius: 10, alignItems: 'center' }}
      >
        {submitting ? <ActivityIndicator /> : <Text>Create</Text>}
      </Pressable>

      <Pressable onPress={() => router.back()} style={{ padding: 12, alignItems: 'center' }}>
        <Text>Cancel</Text>
      </Pressable>
    </View>
  );
}
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { burgersApi } from '../../../src/features/burgers/api';
import type { BurgerDetail } from '../../../src/features/burgers/types';
import { getErrorMessage } from '../../../src/shared/lib/http';

export default function BurgerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [burger, setBurger] = useState<BurgerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setError(null);
    setLoading(true);
    try {
      const data = await burgersApi.getById(String(id));
      setBurger(data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const BackButton = () => (
    <Pressable
      onPress={() => router.replace('/(app)/burgers')}
      style={{ paddingVertical: 8, paddingLeft: 16 }}
    >
      <Text>← Back</Text>
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <BackButton />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <BackButton />
        <View style={{ flex: 1, justifyContent: 'center', gap: 12 }}>
          <Text style={{ fontSize: 16 }}>Error: {error}</Text>
          <Pressable
            onPress={load}
            style={{ padding: 12, borderWidth: 1, borderRadius: 10, alignItems: 'center' }}
          >
            <Text>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!burger) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <BackButton />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <BackButton />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>{burger.name}</Text>

        {!!burger.image && (
          <Image
            source={{ uri: burger.image }}
            style={{ width: '100%', height: 180, borderRadius: 12 }}
            resizeMode="cover"
          />
        )}

        <Text style={{ fontSize: 14 }}>
          Ingredients: {burger.ingredients.join(', ')}
        </Text>

        <Text style={{ fontSize: 13 }}>
          Comments: {burger.commentsCount} • Collaborators: {burger.collaboratorsCount}
        </Text>

        <Text style={{ fontSize: 13 }}>
          Creator: {burger.creator.name} ({burger.creator.email})
        </Text>

        <View style={{ marginTop: 12, gap: 10 }}>
          <Pressable
            onPress={() => router.push(`/(app)/burgers/${burger.id}/comments`)}
            style={{ padding: 12, borderWidth: 1, borderRadius: 10, alignItems: 'center' }}
          >
            <Text>View comments</Text>
          </Pressable>

          <Pressable
            onPress={load}
            style={{ padding: 12, borderWidth: 1, borderRadius: 10, alignItems: 'center' }}
          >
            <Text>Refresh</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

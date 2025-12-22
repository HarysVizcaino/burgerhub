import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { burgersApi } from '../../src/features/burgers/api';
import type { BurgerListItem } from '../../src/features/burgers/types';
import { getErrorMessage } from '../../src/shared/lib/http';
import { useAuth } from '../../src/shared/providers/AuthProvider';
import { BurgerCard } from '../../src/features/burgers/components/BurgerCard';
import { router } from 'expo-router';

export default function BurgersScreen() {
  const { signOut } = useAuth();

  const [items, setItems] = useState<BurgerListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (nextPage = 1) => {
    try {
      setError(null);
      const res = await burgersApi.list(nextPage, 10);
      setTotal(res.total);
      setPage(res.page);

      setItems((prev) => (nextPage === 1 ? res.data : [...prev, ...res.data]));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const canLoadMore = items.length < total;

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>Burgers</Text>
        <Pressable onPress={() => router.push('/burgers/new')} style={{ padding: 8, borderWidth: 1, borderRadius: 10 }}>
          <Text>New burger</Text>
        </Pressable>
        <Pressable onPress={signOut} style={{ padding: 8, borderWidth: 1, borderRadius: 10 }}>
          <Text>Logout</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator />}
      {error && <Text>Error: {error}</Text>}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BurgerCard burger={item} onPress={() => router.push(`/burgers/${item.id}`)} />
        )}
        contentContainerStyle={{ paddingBottom: 12 }}
        ListFooterComponent={
          canLoadMore ? (
            <Pressable
              onPress={() => {
                setLoadingMore(true);
                load(page + 1);
              }}
              disabled={loadingMore}
              style={{ padding: 12, borderWidth: 1, borderRadius: 10, alignItems: 'center', marginTop: 12 }}
            >
              {loadingMore ? <ActivityIndicator /> : <Text>Load more</Text>}
            </Pressable>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

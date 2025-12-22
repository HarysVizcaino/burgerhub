import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { commentsApi } from '../../../../src/features/comments/api';
import type { CommentDto } from '../../../../src/features/comments/types';
import { getErrorMessage } from '../../../../src/shared/lib/http';
import { Input, Button } from '../../../../src/shared/ui';

export default function BurgerCommentsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const burgerId = String(id);

  const [items, setItems] = useState<CommentDto[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (nextPage = 1) => {
    try {
      setError(null);
      const res = await commentsApi.listByBurger(burgerId, nextPage, 10);

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

  const submit = async () => {
    const value = text.trim();
    if (!value) return;

    setSubmitting(true);
    try {
      await commentsApi.create(burgerId, { text: value });
      setText('');
      setLoading(true);
      await load(1);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    load(1);
  }, [burgerId]);

  const canLoadMore = items.length < total;

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Button
          title="← Back"
          variant="link"
          onPress={() => router.back()}
          style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
        />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Button
        title="← Back"
        variant="link"
        onPress={() => router.back()}
        style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
      />
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Comments</Text>

      {error ? (
        <View style={{ gap: 10, marginBottom: 12 }}>
          <Text style={{ color: '#ef4444' }}>Error: {error}</Text>
          <Button
            title="Retry"
            variant="secondary"
            onPress={() => {
              setLoading(true);
              load(1);
            }}
          />
        </View>
      ) : null}

      <View style={{ gap: 8, marginBottom: 12 }}>
        <Input
          value={text}
          onChangeText={setText}
          placeholder="Write a comment..."
          editable={!submitting}
        />

        <Button
          title="Post comment"
          onPress={submit}
          loading={submitting}
          disabled={!text.trim()}
        />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
            <Text style={{ fontSize: 15 }}>{item.text}</Text>

            <Text style={{ fontSize: 12, marginTop: 6, color: '#6b7280' }}>
              {item.author?.name ? `By ${item.author.name} • ` : ''}
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#6b7280' }}>No comments yet.</Text>}
        ListFooterComponent={
          canLoadMore ? (
            <Button
              title="Load more"
              variant="secondary"
              loading={loadingMore}
              onPress={() => {
                setLoadingMore(true);
                load(page + 1);
              }}
              style={{ marginTop: 12 }}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

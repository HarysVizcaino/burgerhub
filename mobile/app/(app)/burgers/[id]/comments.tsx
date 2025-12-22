import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { commentsApi } from '../../../../src/features/comments/api';
import type { CommentDto } from '../../../../src/features/comments/types';
import { getErrorMessage } from '../../../../src/shared/lib/http';

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

  const BackButton = () => (
    <Pressable
      onPress={() => router.back()}
      style={{ paddingVertical: 8, paddingRight: 16 }}
    >
      <Text style={{ fontSize: 16, color: '#007AFF' }}>← Back</Text>
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

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <BackButton />
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Comments</Text>

      {error ? (
        <View style={{ gap: 10, marginBottom: 12 }}>
          <Text>Error: {error}</Text>
          <Pressable
            onPress={() => {
              setLoading(true);
              load(1);
            }}
            style={{ padding: 12, borderWidth: 1, borderRadius: 10, alignItems: 'center' }}
          >
            <Text>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={{ gap: 8, marginBottom: 12 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Write a comment..."
          editable={!submitting}
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <Pressable
          onPress={submit}
          disabled={submitting || !text.trim()}
          style={{
            padding: 12,
            borderWidth: 1,
            borderRadius: 10,
            alignItems: 'center',
            opacity: submitting || !text.trim() ? 0.5 : 1,
          }}
        >
          {submitting ? <ActivityIndicator /> : <Text>Post comment</Text>}
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 15 }}>{item.text}</Text>

            <Text style={{ fontSize: 12, marginTop: 6 }}>
              {item.author?.name ? `By ${item.author.name} • ` : ''}
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No comments yet.</Text>}
        ListFooterComponent={
          canLoadMore ? (
            <Pressable
              onPress={() => {
                setLoadingMore(true);
                load(page + 1);
              }}
              disabled={loadingMore}
              style={{
                padding: 12,
                borderWidth: 1,
                borderRadius: 10,
                alignItems: 'center',
                marginTop: 12,
              }}
            >
              {loadingMore ? <ActivityIndicator /> : <Text>Load more</Text>}
            </Pressable>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

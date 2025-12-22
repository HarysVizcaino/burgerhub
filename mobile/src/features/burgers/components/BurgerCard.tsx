import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { BurgerListItem } from '../types';

type Props = {
  burger: BurgerListItem;
  onPress: () => void;
};

export function BurgerCard({ burger, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Text style={styles.title}>{burger.name}</Text>

      {!!burger.ingredients?.length && (
        <Text style={styles.ingredients}>
          Ingredients: {burger.ingredients.join(', ')}
        </Text>
      )}

      <Text style={styles.meta}>
        Comments: {burger.commentsCount} • Collaborators: {burger.collaboratorsCount}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pressed: {
    opacity: 0.85,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  ingredients: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  meta: {
    fontSize: 13,
    color: '#6b7280',
  },
});
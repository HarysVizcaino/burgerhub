import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

type InputProps = TextInputProps & {
  error?: boolean;
};

export function Input({ style, error, ...props }: InputProps) {
  return (
    <TextInput
      placeholderTextColor="#9ca3af"
      style={[styles.input, error && styles.error, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    borderColor: '#ef4444',
  },
});


import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, PressableProps, ViewStyle, TextStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'link';

type ButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: ButtonVariant;
  textStyle?: TextStyle;
};

export function Button({
  title,
  loading = false,
  disabled,
  variant = 'primary',
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyles: ViewStyle[] = [styles.base];
  const textStyles: TextStyle[] = [styles.text];

  if (variant === 'primary') {
    buttonStyles.push(styles.primary);
    textStyles.push(styles.primaryText);
  } else if (variant === 'secondary') {
    buttonStyles.push(styles.secondary);
    textStyles.push(styles.secondaryText);
  } else if (variant === 'link') {
    buttonStyles.push(styles.link);
    textStyles.push(styles.linkText);
  }

  if (isDisabled) {
    buttonStyles.push(styles.disabled);
  }

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        ...buttonStyles,
        pressed && styles.pressed,
        style as ViewStyle,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#007AFF'} />
      ) : (
        <Text style={[...textStyles, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
    borderWidth: 0,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryText: {
    color: '#374151',
  },
  link: {
    backgroundColor: 'transparent',
    padding: 8,
  },
  linkText: {
    color: '#007AFF',
  },
  text: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});


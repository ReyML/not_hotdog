import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/theme/colors';

type Variant = 'primary' | 'secondary' | 'danger';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  variant?: Variant;
  disabled?: boolean;
};

export function AppButton({ label, onPress, icon, variant = 'primary', disabled = false }: AppButtonProps) {
  const content = (
    <View style={styles.content}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.label, variant === 'secondary' && styles.labelSecondary]}>{label}</Text>
    </View>
  );

  if (variant === 'secondary') {
    return (
      <Pressable
        style={({ pressed }) => [styles.secondary, pressed && styles.pressed, disabled && styles.disabled]}
        onPress={onPress}
        disabled={disabled}
      >
        {content}
      </Pressable>
    );
  }

  const gradientColors = variant === 'danger' ? dangerGradient : primaryGradient;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.container, pressed && styles.pressed, disabled && styles.disabled]}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        {content}
      </LinearGradient>
    </Pressable>
  );
}

const primaryGradient = ['#38BDF8', '#2563EB'] as const;
const dangerGradient = ['#F97316', '#EF4444'] as const;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: 0.3,
  },
  labelSecondary: {
    color: '#E0F2FE',
  },
  secondary: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(14, 116, 212, 0.45)',
    backgroundColor: 'rgba(8, 47, 73, 0.45)',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

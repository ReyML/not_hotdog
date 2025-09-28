import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/theme/colors';

type ResultBannerProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  variant: 'success' | 'danger';
  emoji: string;
}>;

export function ResultBanner({ title, subtitle, emoji, variant, children }: ResultBannerProps) {
  const gradientColors = variant === 'success' ? successGradient : dangerGradient;

  return (
    <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {children}
    </LinearGradient>
  );
}

const successGradient = ['rgba(34,197,94,0.95)', 'rgba(16,185,129,0.95)'] as const;
const dangerGradient = ['rgba(239,68,68,0.95)', 'rgba(248,113,113,0.95)'] as const;

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  emoji: {
    fontSize: 48,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: 4,
    opacity: 0.9,
  },
});

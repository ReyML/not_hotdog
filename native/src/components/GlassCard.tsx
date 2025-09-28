import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';

import { colors } from '@/theme/colors';

type GlassCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  isInteractive?: boolean;
}>;

export function GlassCard({ children, style, isInteractive = false }: GlassCardProps) {
  return (
    <GlassView
      style={[styles.container, style]}
      isInteractive={isInteractive}
      glassEffectStyle="regular"
    >
      <BlurView tint="light" intensity={45} style={StyleSheet.absoluteFill} pointerEvents="none" />
      <View style={styles.inner}>{children}</View>
    </GlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    backgroundColor: colors.backgroundSurface,
  },
  inner: {
    padding: 20,
    gap: 16,
  },
});

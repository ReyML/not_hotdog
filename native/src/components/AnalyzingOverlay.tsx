import { useMemo } from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/theme/colors';

interface AnalyzingOverlayProps {
  visible: boolean;
  imageUri?: string;
  statusMessage?: string;
}

export function AnalyzingOverlay({ visible, imageUri, statusMessage }: AnalyzingOverlayProps) {
  const backgroundSource = useMemo(() => (imageUri ? { uri: imageUri } : undefined), [imageUri]);

  if (!visible) {
    return null;
  }

  const content = (
    <LinearGradient colors={['rgba(15,23,42,0.6)', 'rgba(15,23,42,0.85)']} style={styles.gradient}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={colors.textPrimary} />
        <Text style={styles.title}>Analyzing image…</Text>
        <Text style={styles.subtitle}>{statusMessage ?? 'Waiting for AI response…'}</Text>
      </View>
    </LinearGradient>
  );

  if (backgroundSource) {
    return (
      <ImageBackground source={backgroundSource} resizeMode="cover" style={styles.overlay}>
        {content}
      </ImageBackground>
    );
  }

  return <View style={[styles.overlay, styles.fallbackBackground]}>{content}</View>;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackBackground: {
    backgroundColor: 'rgba(15,23,42,0.85)',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(15,23,42,0.45)',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});

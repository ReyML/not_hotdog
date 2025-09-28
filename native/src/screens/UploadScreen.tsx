import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

interface UploadScreenProps {
  onPickImage: () => void;
  statusMessage?: string | null;
}

export function UploadScreen({ onPickImage, statusMessage }: UploadScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Not Hamburger</Text>
          <Text style={styles.appSubtitle}>Let the AI decide if it&apos;s hamburger or not</Text>
        </View>

        <Pressable style={({ pressed }) => [styles.uploadCard, pressed && styles.cardPressed]} onPress={onPickImage}>
          <Text style={styles.emoji}>🍔</Text>
          <Text style={styles.cardTitle}>Select Image</Text>
          <Text style={styles.cardSubtitle}>Tap to choose photo</Text>
        </Pressable>

        {statusMessage ? (
          <View style={styles.statusCard}>
            <Text style={styles.statusText}>{statusMessage}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.footer}>
        “you&apos;re fat and a poor”
        {'\n'}
        <Text style={styles.footerLink} onPress={() => Linking.openURL('https://reyml.com')}>reyml.com</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 48,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.textPrimary,
    textShadowColor: 'rgba(15, 23, 42, 0.35)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  appSubtitle: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  uploadCard: {
    width: '100%',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(148, 163, 184, 0.8)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 48,
    alignItems: 'center',
    shadowColor: 'rgba(15, 23, 42, 0.25)',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  cardPressed: {
    opacity: 0.85,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#64748B',
  },
  statusCard: {
    width: '100%',
    backgroundColor: 'rgba(248, 113, 113, 0.92)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  statusText: {
    color: '#FFF1F2',
    fontSize: 15,
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.75)',
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 18,
  },
  footerLink: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});

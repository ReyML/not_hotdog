import { StyleSheet, Text, View } from 'react-native';

import { BottomActions } from '@/components/BottomActions';
import { GlassCard } from '@/components/GlassCard';
import { ImagePreview } from '@/components/ImagePreview';
import { ResultBanner } from '@/components/ResultBanner';
import { AnalysisResult } from '@/types';
import { colors } from '@/theme/colors';

interface ResultScreenProps {
  result: AnalysisResult;
  imageUri: string;
  onShare: () => void;
  onRestart: () => void;
}

export function ResultScreen({ result, imageUri, onShare, onRestart }: ResultScreenProps) {
  const variant = result.isHamburger ? 'success' : 'danger';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ResultBanner
          title={result.isHamburger ? 'It\'s a hamburger!' : 'Not a hamburger'}
          subtitle={result.isHamburger ? 'Certified burger goodness ✅' : 'No burger detected. Maybe next time.'}
          variant={variant}
          emoji={result.isHamburger ? '🍔' : '🚫'}
        >
          <Text style={styles.description}>{result.description}</Text>
        </ResultBanner>

        <ImagePreview source={{ uri: imageUri }} />

        <GlassCard>
          <Text style={styles.tipTitle}>Tip</Text>
          <Text style={styles.tipText}>
            Tap share to brag (or confess) with your friends. You can always try another photo to double check.
          </Text>
        </GlassCard>
      </View>

      <BottomActions
        actions={[
          { label: 'Share result', onPress: onShare },
          { label: 'Try another photo', onPress: onRestart, variant: 'secondary' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
    gap: 24,
  },
  content: {
    flex: 1,
    gap: 24,
  },
  description: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tipText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});

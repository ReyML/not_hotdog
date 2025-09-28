import { StyleSheet, Text, View } from 'react-native';

import { BottomActions } from '@/components/BottomActions';
import { GlassCard } from '@/components/GlassCard';
import { ImagePreview } from '@/components/ImagePreview';
import { colors } from '@/theme/colors';

interface PreviewScreenProps {
  imageUri: string;
  fileName: string;
  onRetake: () => void;
  onAnalyze: () => void;
  analyzing?: boolean;
}

export function PreviewScreen({ imageUri, fileName, onRetake, onAnalyze, analyzing = false }: PreviewScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <ImagePreview source={{ uri: imageUri }} />
        <GlassCard>
          <Text style={styles.title}>Ready to analyze?</Text>
          <Text style={styles.subtitle}>
            We&apos;ll run {fileName || 'your photo'} through the Not Hamburger detector to see if it&apos;s burgerlicious.
          </Text>
        </GlassCard>
      </View>

      <BottomActions
        actions={[
          { label: 'Pick another', onPress: onRetake, variant: 'secondary', disabled: analyzing },
          { label: analyzing ? 'Analyzing…' : 'Analyze image', onPress: onAnalyze, disabled: analyzing },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
    gap: 24,
  },
  centerContent: {
    flex: 1,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

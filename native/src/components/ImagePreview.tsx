import { memo } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { GlassCard } from '@/components/GlassCard';

interface ImagePreviewProps {
  source: ImageSourcePropType;
}

function ImagePreviewComponent({ source }: ImagePreviewProps) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={source} style={styles.image} resizeMode="cover" />
      </View>
    </GlassCard>
  );
}

export const ImagePreview = memo(ImagePreviewComponent);

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

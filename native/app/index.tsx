import { useCallback, useMemo, useState } from 'react';
import { Alert, Share, StyleSheet, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnalyzingOverlay } from '@/components/AnalyzingOverlay';
import { PreviewScreen } from '@/screens/PreviewScreen';
import { ResultScreen } from '@/screens/ResultScreen';
import { UploadScreen } from '@/screens/UploadScreen';
import { analyzeImage } from '@/services/api';
import { colors } from '@/theme/colors';
import { AnalysisResult, SelectedImage } from '@/types';
import { detectHamburger } from '@/utils/detectHamburger';
import { APP_NAME, SHARE_URL } from '@/config/env';

const DOCUMENT_TYPES = ['image/*'];
const JPEG_MIME = 'image/jpeg';
const MAX_UPLOAD_BYTES = 6_500_000;

const bytesFromBase64 = (base64: string) => {
  const cleaned = base64.replace(/\s+/g, '');
  const padding = cleaned.endsWith('==') ? 2 : cleaned.endsWith('=') ? 1 : 0;
  return Math.floor((cleaned.length * 3) / 4) - padding;
};

const ensureJpegName = (input?: string | null) => {
  if (!input) {
    return 'photo.jpg';
  }

  const base = input.replace(/\.[^/.]+$/, '');
  return `${base || 'photo'}.jpg`;
};

type FlowState = 'idle' | 'preview' | 'result';

type PreparedImage = {
  dataUri: string;
  mimeType: string;
  approxBytes: number;
  uri: string;
};

async function prepareImageForUpload(uri: string): Promise<PreparedImage> {
  const qualitySteps = [0.72, 0.6, 0.48, 0.38, 0.3, 0.24, 0.2, 0.18];
  const widthSteps = [1400, 1200, 1080, 960, 820, 720, 640, 560, 480, 400, 360];

  let workingUri = uri;

  for (const width of widthSteps) {
    for (const quality of qualitySteps) {
      const actions = [{ resize: { width } }];

      const result = await ImageManipulator.manipulateAsync(workingUri, actions, {
        compress: quality,
        base64: true,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      if (!result.base64) {
        continue;
      }

      const approxBytes = bytesFromBase64(result.base64);

      if (approxBytes <= MAX_UPLOAD_BYTES) {
        return {
          dataUri: `data:${JPEG_MIME};base64,${result.base64}`,
          mimeType: JPEG_MIME,
          approxBytes,
          uri: result.uri ?? workingUri,
        };
      }

      workingUri = result.uri ?? workingUri;
    }
  }

  throw new Error('Image is too large even after compression. Please choose a smaller photo.');
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const reset = useCallback(() => {
    setSelectedImage(null);
    setResult(null);
    setFlowState('idle');
    setStatusMessage(null);
    setIsAnalyzing(false);
  }, []);

  const setImageSelection = useCallback((image: SelectedImage) => {
    setSelectedImage(image);
    setResult(null);
    setFlowState('preview');
  }, []);

  const handleSourceSelection = useCallback(
    async (source: 'camera' | 'library' | 'files') => {
      try {
        setStatusMessage(null);
        setIsAnalyzing(false);

        if (source === 'files') {
          const response = await DocumentPicker.getDocumentAsync({
            type: DOCUMENT_TYPES,
            multiple: false,
            copyToCacheDirectory: true,
          });

          if (response.canceled || !response.assets?.length) {
            return;
          }

          const asset = response.assets[0];
          const prepared = await prepareImageForUpload(asset.uri);

          setImageSelection({
            uri: prepared.uri,
            dataUri: prepared.dataUri,
            mimeType: prepared.mimeType,
            name: ensureJpegName(asset.name ?? asset.uri),
            size: prepared.approxBytes,
          });

          return;
        }

        if (source === 'camera') {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            setStatusMessage('Camera access is required to take a photo.');
            return;
          }

          const capture = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images',
            quality: 1,
          });

          if (capture.canceled || !capture.assets?.length) {
            return;
          }

          const asset = capture.assets[0];
          const prepared = await prepareImageForUpload(asset.uri);

          setImageSelection({
            uri: prepared.uri,
            dataUri: prepared.dataUri,
            mimeType: prepared.mimeType,
            name: ensureJpegName(asset.fileName ?? 'camera'),
            size: prepared.approxBytes,
          });

          return;
        }

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          setStatusMessage('Photo library access is required to choose an image.');
          return;
        }

        const picker = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'images',
          quality: 1,
        });

        if (picker.canceled || !picker.assets?.length) {
          return;
        }

        const asset = picker.assets[0];
        const prepared = await prepareImageForUpload(asset.uri);

        setImageSelection({
          uri: prepared.uri,
          dataUri: prepared.dataUri,
          mimeType: prepared.mimeType,
          name: ensureJpegName(asset.fileName ?? 'photo'),
          size: prepared.approxBytes,
        });
      } catch (error) {
        console.error('Failed to process selected image', error);
        setSelectedImage(null);
        setResult(null);
        setFlowState('idle');
        setIsAnalyzing(false);
        setStatusMessage(
          error instanceof Error
            ? error.message
            : 'We could not process that image. Please try another photo.'
        );
      }
    },
    [setImageSelection]
  );

  const handlePickImage = useCallback(() => {
    Alert.alert('Select image', 'Choose a source for your photo', [
      { text: 'Camera', onPress: () => void handleSourceSelection('camera') },
      { text: 'Photo library', onPress: () => void handleSourceSelection('library') },
      { text: 'Files', onPress: () => void handleSourceSelection('files') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [handleSourceSelection]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedImage) {
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await analyzeImage(selectedImage.dataUri);
      const description = response.choices?.[0]?.message?.content ?? 'NO_RESPONSE';
      const isHamburger = detectHamburger(description);
      setResult({ description, isHamburger });
      setFlowState('result');
    } catch (error) {
      console.error('Image analysis failed', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong while analyzing. Please try again in a moment.';
      setStatusMessage(message);
      setFlowState('idle');
      setSelectedImage(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedImage]);

  const handleShare = useCallback(async () => {
    if (!result) {
      return;
    }

    const headline = result.isHamburger ? 'I ate a hamburger! ✅' : 'This is not a hamburger. ❌';
    const message = `${headline}\n\nTry ${APP_NAME}: ${SHARE_URL}`;

    try {
      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Share failed', error);
    }
  }, [result]);

  const gradientColors = useMemo(
    () => [colors.backgroundPrimary, colors.backgroundSecondary] as const,
    []
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {flowState === 'idle' && <UploadScreen onPickImage={handlePickImage} statusMessage={statusMessage} />}

            {flowState === 'preview' && selectedImage ? (
              <PreviewScreen
                imageUri={selectedImage.uri}
                fileName={selectedImage.name}
                onRetake={reset}
                onAnalyze={handleAnalyze}
                analyzing={isAnalyzing}
              />
            ) : null}

            {flowState === 'result' && selectedImage && result ? (
              <ResultScreen result={result} imageUri={selectedImage.uri} onRestart={reset} onShare={handleShare} />
            ) : null}

            <AnalyzingOverlay visible={isAnalyzing} imageUri={selectedImage?.dataUri} />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { GlassCard } from '@/components/GlassCard';

export type BottomAction = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
};

type BottomActionsProps = {
  actions: BottomAction[];
  style?: StyleProp<ViewStyle>;
};

export function BottomActions({ actions, style }: BottomActionsProps) {
  return (
    <GlassCard style={[styles.container, style]}>
      {actions.map((action) => (
        <AppButton key={action.label} label={action.label} onPress={action.onPress} variant={action.variant} disabled={action.disabled} />
      ))}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

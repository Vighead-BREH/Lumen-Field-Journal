import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, radius, space, type } from '../theme/tokens';

export default function Button({
  label,
  icon,
  onPress,
  variant = 'secondary',
  disabled = false,
  busy = false,
  full = false,
  style,
}) {
  const tone = TONES[variant] ?? TONES.secondary;
  const inactive = disabled || busy;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy }}
      style={({ pressed }) => [
        styles.root,
        { backgroundColor: tone.background, borderColor: tone.border },
        full && styles.full,
        pressed && !inactive && styles.pressed,
        inactive && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {busy ? (
          <ActivityIndicator size="small" color={tone.foreground} />
        ) : icon ? (
          <Feather name={icon} size={16} color={tone.foreground} />
        ) : null}
        <Text style={[styles.label, { color: tone.foreground }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const TONES = {
  primary: {
    background: colors.ember,
    border: colors.ember,
    foreground: colors.onEmber,
  },
  secondary: {
    background: colors.surface,
    border: colors.lineStrong,
    foreground: colors.ink,
  },
  quiet: {
    background: 'transparent',
    border: 'transparent',
    foreground: colors.ember,
  },
};

const styles = StyleSheet.create({
  root: {
    minHeight: 50,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  label: {
    ...type.label,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.45,
  },
});

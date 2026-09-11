import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '../theme/tokens';

export default function Chip({ label, tone = 'neutral', style }) {
  const palette = TONES[tone] ?? TONES.neutral;
  return (
    <View style={[styles.root, { backgroundColor: palette.background }, style]}>
      <Text style={[styles.label, { color: palette.foreground }]}>{label}</Text>
    </View>
  );
}

const TONES = {
  neutral: { background: colors.paperDeep, foreground: colors.inkSoft },
  ember: { background: colors.emberSoft, foreground: colors.emberDeep },
  sage: { background: colors.sageSoft, foreground: colors.sage },
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  label: {
    ...type.caption,
    fontSize: 12,
    lineHeight: 16,
  },
});

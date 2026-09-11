import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, radius, space, type } from '../theme/tokens';

export default function ActionRow({
  icon,
  label,
  hint,
  control,
  onPress,
  last = false,
  style,
}) {
  const interactive = typeof onPress === 'function';

  return (
    <Pressable
      onPress={onPress}
      disabled={!interactive}
      accessibilityRole={interactive ? 'button' : undefined}
      accessibilityLabel={label}
      accessibilityHint={hint}
      style={({ pressed }) => [
        styles.root,
        last && styles.last,
        pressed && interactive && styles.pressed,
        style,
      ]}
    >
      {icon ? (
        <View style={styles.badge}>
          <Feather name={icon} size={15} color={colors.ember} />
        </View>
      ) : null}

      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>

      {control ?? (interactive ? <Feather name="chevron-right" size={18} color={colors.inkFaint} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: space.lg,
  },
  last: {
    borderBottomWidth: 0,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.emberSoft,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...type.label,
  },
  hint: {
    ...type.caption,
  },
  pressed: {
    opacity: 0.6,
  },
});

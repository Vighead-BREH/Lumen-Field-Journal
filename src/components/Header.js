import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, GUTTER, space, type } from '../theme/tokens';

export default function Header({ eyebrow, title, trailing, onBack, style }) {
  return (
    <View style={[styles.root, style]}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Feather name="arrow-left" size={18} color={colors.ink} />
        </Pressable>
      ) : null}

      <View style={styles.text}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>

      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: GUTTER,
    paddingTop: space.lg,
    paddingBottom: space.lg,
    gap: space.md,
  },
  text: {
    flex: 1,
  },
  eyebrow: {
    ...type.micro,
    marginBottom: space.sm,
  },
  title: {
    ...type.display,
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: space.xs,
  },
  trailing: {
    marginBottom: space.xs,
  },
  pressed: {
    opacity: 0.6,
  },
});

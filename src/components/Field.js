import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, space, type } from '../theme/tokens';

export default function Field({ label, error, style, ...input }) {
  return (
    <View style={[styles.root, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.inkFaint}
        selectionColor={colors.ember}
        style={[styles.input, error && styles.inputError]}
        {...input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: space.sm,
  },
  label: {
    ...type.micro,
  },
  input: {
    ...type.body,
    color: colors.ink,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.ember,
  },
  error: {
    ...type.caption,
    color: colors.emberDeep,
  },
});

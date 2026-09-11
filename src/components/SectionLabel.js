import { StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '../theme/tokens';

export default function SectionLabel({ children, trailing, style }) {
  return (
    <View style={[styles.root, style]}>
      <Text style={styles.label}>{children}</Text>
      <View style={styles.rule} />
      {trailing ? <Text style={styles.trailing}>{trailing}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  label: {
    ...type.micro,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  trailing: {
    ...type.micro,
    color: colors.inkFaint,
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, space, type } from '../theme/tokens';

export default function InfoRow({ label, value, icon, last = false, style }) {
  return (
    <View style={[styles.root, last && styles.last, style]}>
      <View style={styles.labelGroup}>
        {icon ? <Feather name={icon} size={13} color={colors.inkFaint} /> : null}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: space.lg,
  },
  last: {
    borderBottomWidth: 0,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  label: {
    ...type.bodyTight,
    color: colors.inkFaint,
  },
  value: {
    ...type.label,
    flexShrink: 1,
    textAlign: 'right',
  },
});

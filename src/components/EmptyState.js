import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, radius, space, type } from '../theme/tokens';

export default function EmptyState({ icon = 'image', title, body, action, style }) {
  return (
    <View style={[styles.root, style]}>
      <View style={styles.badge}>
        <Feather name={icon} size={22} color={colors.ember} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingVertical: space.xxxl,
    paddingHorizontal: space.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.emberSoft,
    marginBottom: space.lg,
  },
  title: {
    ...type.headline,
    textAlign: 'center',
  },
  body: {
    ...type.bodyTight,
    textAlign: 'center',
    marginTop: space.sm,
    maxWidth: 280,
  },
  action: {
    marginTop: space.xl,
  },
});

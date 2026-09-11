import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, space, type } from '../theme/tokens';

export default function ProfileCard({ name, handle, avatar, stats = [] }) {
  return (
    <View style={styles.card}>
      <View style={styles.identity}>
        <Avatar source={avatar} size={76} />
        <View style={styles.names}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.handle}>{handle}</Text>
        </View>
      </View>

      {stats.length > 0 ? (
        <View style={styles.stats}>
          {stats.map((stat) => (
            <StatBlock key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

// Ring and image are sized explicitly rather than with flex: inside a row the
// ring would otherwise stretch to fill the space next to the name instead of
// staying square.
export function Avatar({ source, size = 48 }) {
  const inner = size - (size > 60 ? 8 : 6);
  return (
    <View style={[styles.avatarRing, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={source}
        style={{ width: inner, height: inner, borderRadius: inner / 2 }}
        resizeMode="cover"
      />
    </View>
  );
}

export function StatBlock({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.xl,
    ...shadows.card,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
  },
  names: {
    flex: 1,
    minWidth: 0,
    gap: space.xs,
  },
  name: {
    ...type.title,
  },
  handle: {
    ...type.caption,
  },
  avatarRing: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.ember,
    backgroundColor: colors.paperDeep,
  },
  stats: {
    flexDirection: 'row',
    marginTop: space.xl,
    paddingTop: space.lg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  stat: {
    flex: 1,
    gap: space.xs,
  },
  statValue: {
    ...type.title,
    fontSize: 24,
    lineHeight: 28,
    color: colors.ember,
  },
  statLabel: {
    ...type.micro,
  },
});

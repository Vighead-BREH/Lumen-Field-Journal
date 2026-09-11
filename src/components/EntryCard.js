import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, radius, shadows, space, type } from '../theme/tokens';

export default function EntryCard({ entry, variant = 'compact', onPress }) {
  const featured = variant === 'featured';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${entry.title}, ${entry.place}, ${entry.date}`}
      style={({ pressed }) => [
        featured ? styles.featured : styles.compact,
        pressed && styles.pressed,
      ]}
    >
      {featured ? (
        <>
          <Image source={entry.plate} style={styles.featuredImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(12,9,7,0)', 'rgba(12,9,7,0.35)', 'rgba(12,9,7,0.88)']}
            locations={[0.35, 0.62, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.featuredBody}>
            <Text style={styles.featuredMeta}>
              {entry.place} &middot; {entry.date}
            </Text>
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {entry.title}
            </Text>
            <Text style={styles.featuredSummary} numberOfLines={2}>
              {entry.summary}
            </Text>
          </View>
        </>
      ) : (
        <>
          <Image source={entry.plate} style={styles.thumb} resizeMode="cover" />
          <View style={styles.compactBody}>
            <Text style={styles.compactMeta}>
              {entry.place} &middot; {entry.date}
            </Text>
            <Text style={styles.compactTitle} numberOfLines={2}>
              {entry.title}
            </Text>
            <Text style={styles.compactSummary} numberOfLines={2}>
              {entry.summary}
            </Text>
          </View>
          <Feather name="arrow-up-right" size={16} color={colors.inkFaint} style={styles.chevron} />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /* Featured */
  featured: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.paperDeep,
    aspectRatio: 0.82,
    justifyContent: 'flex-end',
    ...shadows.lift,
  },
  featuredImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  featuredBody: {
    padding: space.xl,
    gap: space.xs,
  },
  featuredMeta: {
    ...type.micro,
    color: 'rgba(255, 245, 235, 0.72)',
  },
  featuredTitle: {
    ...type.title,
    fontSize: 30,
    lineHeight: 35,
    color: colors.onEmber,
    marginTop: space.xs,
  },
  featuredSummary: {
    ...type.bodyTight,
    color: 'rgba(255, 245, 235, 0.78)',
    marginTop: space.xs,
  },

  /* Compact */
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.md,
  },
  thumb: {
    width: 74,
    height: 92,
    borderRadius: radius.md,
    backgroundColor: colors.paperDeep,
  },
  compactBody: {
    flex: 1,
    gap: 3,
  },
  compactMeta: {
    ...type.micro,
    fontSize: 9,
  },
  compactTitle: {
    ...type.headline,
    fontSize: 19,
    lineHeight: 23,
  },
  compactSummary: {
    ...type.caption,
  },
  chevron: {
    alignSelf: 'flex-start',
    marginTop: space.xs,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
});

import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, space, type } from '../theme/tokens';

export default function PhotoPreview({ uri, caption, meta, source = 'Camera', style }) {
  return (
    <View style={[styles.mount, style]}>
      <View style={styles.well}>
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.caption}>
        <View style={styles.captionText}>
          <Text style={styles.title} numberOfLines={1}>
            {caption}
          </Text>
          {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        </View>
        <Text style={styles.source}>{source}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mount: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadows.card,
  },
  well: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.paperDeep,
  },
  image: {
    width: '100%',
    aspectRatio: 0.86,
  },
  caption: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space.md,
    paddingTop: space.md,
    paddingHorizontal: space.xs,
    paddingBottom: space.xs,
  },
  captionText: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...type.headline,
    fontSize: 18,
    lineHeight: 22,
  },
  meta: {
    ...type.caption,
  },
  source: {
    ...type.micro,
    color: colors.ember,
  },
});

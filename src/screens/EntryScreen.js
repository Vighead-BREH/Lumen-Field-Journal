import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Chip, InfoRow, SectionLabel } from '../components';
import { entryById, nextEntry } from '../data/journal';
import { colors, GUTTER, radius, space, type } from '../theme/tokens';

export default function EntryScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const entry = entryById(route.params?.id);

  // Defensive: a bad id should not blank the screen.
  if (!entry) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top + space.xxxl }]}>
        <Text style={type.headline}>That study is not in the collection.</Text>
        <Button label="Back to journal" icon="arrow-left" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const following = nextEntry(entry.id);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        bounces={false}
      >
        <View style={styles.plate}>
          <Image source={entry.plate} style={styles.plateImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(12,9,7,0.45)', 'rgba(12,9,7,0)']}
            locations={[0, 0.45]}
            style={styles.plateScrim}
            pointerEvents="none"
          />
        </View>

        <View style={styles.sheet}>
          <Text style={styles.eyebrow}>
            {entry.place} &middot; {entry.city} &middot; {entry.date}
          </Text>
          <Text style={styles.title}>{entry.title}</Text>

          <View style={styles.tags}>
            {entry.tags.map((tag, index) => (
              <Chip key={tag} label={tag} tone={index === 0 ? 'ember' : 'sage'} />
            ))}
          </View>

          {entry.body.map((paragraph, index) => (
            <Text key={index} style={[styles.paragraph, index === 0 && styles.lead]}>
              {paragraph}
            </Text>
          ))}

          <SectionLabel style={styles.section}>On site</SectionLabel>
          <View style={styles.table}>
            {entry.readings.map((reading, index) => (
              <InfoRow
                key={reading.label}
                label={reading.label}
                value={reading.value}
                last={index === entry.readings.length - 1}
              />
            ))}
          </View>

          <SectionLabel style={styles.section}>Next in the collection</SectionLabel>
          <Pressable
            onPress={() => navigation.push('Entry', { id: following.id })}
            accessibilityRole="button"
            accessibilityLabel={`Next study: ${following.title}`}
            style={({ pressed }) => [styles.next, pressed && styles.pressed]}
          >
            <Image source={following.plate} style={styles.nextThumb} resizeMode="cover" />
            <View style={styles.nextBody}>
              <Text style={styles.nextMeta}>
                {following.place} &middot; {following.date}
              </Text>
              <Text style={styles.nextTitle} numberOfLines={2}>
                {following.title}
              </Text>
            </View>
            <Feather name="arrow-right" size={18} color={colors.ember} />
          </Pressable>
        </View>
      </ScrollView>

      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Back to the journal"
        style={({ pressed }) => [
          styles.back,
          { top: insets.top + space.sm },
          pressed && styles.pressed,
        ]}
      >
        <Feather name="arrow-left" size={19} color={colors.onEmber} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    paddingBottom: space.xxxl,
  },
  plate: {
    width: '100%',
    aspectRatio: 0.86,
    backgroundColor: colors.paperDeep,
  },
  plateImage: {
    width: '100%',
    height: '100%',
  },
  plateScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 160,
  },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -radius.xl,
    paddingHorizontal: GUTTER,
    paddingTop: space.xl,
  },
  eyebrow: {
    ...type.micro,
  },
  title: {
    ...type.display,
    fontSize: 34,
    lineHeight: 38,
    marginTop: space.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginTop: space.lg,
    marginBottom: space.xl,
  },
  paragraph: {
    ...type.body,
    marginBottom: space.lg,
  },
  lead: {
    fontSize: 17,
    lineHeight: 27,
    color: colors.ink,
  },
  section: {
    marginTop: space.md,
    marginBottom: space.xs,
  },
  table: {
    marginBottom: space.xl,
  },
  next: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.md,
    marginTop: space.lg,
  },
  nextThumb: {
    width: 56,
    height: 68,
    borderRadius: radius.sm,
    backgroundColor: colors.paperDeep,
  },
  nextBody: {
    flex: 1,
    gap: space.xs,
  },
  nextMeta: {
    ...type.micro,
    fontSize: 9,
  },
  nextTitle: {
    ...type.headline,
    fontSize: 18,
    lineHeight: 22,
  },
  back: {
    position: 'absolute',
    left: GUTTER,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27, 26, 23, 0.5)',
  },
  pressed: {
    opacity: 0.8,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    gap: space.xl,
    padding: GUTTER,
    backgroundColor: colors.paper,
  },
});

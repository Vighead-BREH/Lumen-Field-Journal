import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryCard, Header, SectionLabel } from '../components';
import { entries } from '../data/journal';
import { colors, GUTTER, space, type } from '../theme/tokens';

export default function JournalScreen({ navigation }) {
  const [featured, ...rest] = entries;

  const open = (entry) => navigation.navigate('Entry', { id: entry.id });

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FlatList
        data={rest}
        keyExtractor={(entry) => entry.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        ListHeaderComponent={
          <View>
            <Header eyebrow="Field journal &middot; Manila" title="Lumen" style={styles.header} />

            <Text style={styles.intro}>
              Six studies of how light behaves when it meets a building. Tap one to read the
              notes taken on site.
            </Text>

            <EntryCard entry={featured} variant="featured" onPress={() => open(featured)} />

            <SectionLabel trailing={`${rest.length} more`} style={styles.section}>
              The collection
            </SectionLabel>
          </View>
        }
        renderItem={({ item }) => <EntryCard entry={item} onPress={() => open(item)} />}
        ListFooterComponent={
          <Text style={styles.footer}>
            Plates are generated offline, not photographed. Nothing in this app touches the
            network.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    paddingHorizontal: GUTTER,
    paddingBottom: space.xxxl,
  },
  header: {
    paddingHorizontal: 0,
    paddingTop: space.sm,
  },
  intro: {
    ...type.body,
    marginBottom: space.xl,
  },
  section: {
    marginTop: space.xxl,
    marginBottom: space.lg,
  },
  gap: {
    height: space.md,
  },
  footer: {
    ...type.caption,
    marginTop: space.xxl,
    textAlign: 'center',
    paddingHorizontal: space.xl,
  },
});

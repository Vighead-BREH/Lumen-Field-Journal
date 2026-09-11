import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme/tokens';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    DMSerifDisplay_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Hold on a paper-coloured field until the fonts resolve, so the UI never
  // flashes in a fallback face. A load failure still renders, degraded to
  // system fonts.
  if (!fontsLoaded && !fontError) {
    return <View style={styles.holding} />;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {/* No background colour: Android runs edge-to-edge and ignores it. */}
        <StatusBar style="dark" />
        <RootNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  holding: {
    flex: 1,
    backgroundColor: colors.paper,
  },
});

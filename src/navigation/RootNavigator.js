import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CaptureScreen from '../screens/CaptureScreen';
import EntryScreen from '../screens/EntryScreen';
import JournalScreen from '../screens/JournalScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TabBar from './TabBar';
import { colors } from '../theme/tokens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * Navigation shape:
 *
 *   Bottom tabs
 *    |- Journal (native stack)
 *    |    |- Journal   the feed
 *    |    +- Entry     pushed detail, can push itself for the next study
 *    |- Capture
 *    +- Profile
 */

function JournalStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.paper },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Journal" component={JournalScreen} />
      <Stack.Screen name="Entry" component={EntryScreen} />
    </Stack.Navigator>
  );
}

/** Paper background baked into the navigator so pushes never flash white. */
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.paper,
    card: colors.paper,
    text: colors.ink,
    primary: colors.ember,
    border: colors.line,
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.paper },
        }}
      >
        <Tab.Screen name="JournalTab" component={JournalStack} options={{ title: 'Journal' }} />
        <Tab.Screen name="Capture" component={CaptureScreen} options={{ title: 'Capture' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

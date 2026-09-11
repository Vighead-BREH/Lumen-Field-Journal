import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ActionRow,
  Button,
  Field,
  Header,
  InfoRow,
  ProfileCard,
  SectionLabel,
  Sheet,
} from '../components';
import { profile } from '../data/journal';
import { colors, GUTTER, space } from '../theme/tokens';

const SETTINGS = [
  { key: 'reminders', icon: 'bell', label: 'Capture reminders', hint: 'A nudge an hour before golden hour.' },
  { key: 'library', icon: 'download', label: 'Save frames to library', hint: 'Keep a copy outside the roll.' },
  { key: 'motion', icon: 'wind', label: 'Reduce motion', hint: 'Fade between screens instead of sliding.' },
];

const EMPTY_PASSWORD = { current: '', next: '', confirm: '' };

export default function ProfileScreen() {
  const [account, setAccount] = useState({
    name: profile.name,
    handle: profile.handle,
    email: profile.email,
  });
  const [settings, setSettings] = useState({ reminders: true, library: false, motion: false });

  const [sheet, setSheet] = useState(null);
  const [draft, setDraft] = useState(account);
  const [password, setPassword] = useState(EMPTY_PASSWORD);
  const [errors, setErrors] = useState({});

  const closeSheet = () => {
    setSheet(null);
    setErrors({});
  };

  const openDetails = () => {
    setDraft(account);
    setErrors({});
    setSheet('details');
  };

  const openPassword = () => {
    setPassword(EMPTY_PASSWORD);
    setErrors({});
    setSheet('password');
  };

  const saveDetails = () => {
    const found = {};
    if (!draft.name.trim()) found.name = 'A name is needed.';
    if (!draft.email.trim()) found.email = 'An email is needed.';
    else if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) found.email = 'That does not look like an email.';

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setAccount({
      name: draft.name.trim(),
      handle: draft.handle.trim(),
      email: draft.email.trim(),
    });
    closeSheet();
  };

  const savePassword = () => {
    const found = {};
    if (!password.current) found.current = 'Enter the current password.';
    if (password.next.length < 8) found.next = 'Use at least 8 characters.';
    if (password.confirm !== password.next) found.confirm = 'The two do not match.';

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    closeSheet();
    Alert.alert(
      'Password changed',
      'On this device only - Lumen is a static build with no account server behind it.'
    );
  };

  const toggle = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }));

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header eyebrow="Who kept this journal" title="Profile" style={styles.header} />

        <ProfileCard
          name={account.name}
          handle={account.handle}
          avatar={profile.avatar}
          stats={profile.stats}
        />

        <SectionLabel style={styles.section}>Submission</SectionLabel>
        <View style={styles.table}>
          {profile.details.map((detail, index) => (
            <InfoRow
              key={detail.label}
              label={detail.label}
              value={detail.value}
              last={index === profile.details.length - 1}
            />
          ))}
        </View>

        <SectionLabel style={styles.section}>Edit account</SectionLabel>
        <View style={styles.table}>
          <ActionRow
            icon="user"
            label="Edit account details"
            hint={account.email}
            onPress={openDetails}
          />
          <ActionRow
            icon="lock"
            label="Change password"
            hint="Set a new password for this account."
            onPress={openPassword}
            last
          />
        </View>

        <SectionLabel style={styles.section}>Settings</SectionLabel>
        <View style={styles.table}>
          {SETTINGS.map((setting, index) => (
            <ActionRow
              key={setting.key}
              icon={setting.icon}
              label={setting.label}
              hint={setting.hint}
              onPress={() => toggle(setting.key)}
              last={index === SETTINGS.length - 1}
              control={
                <Switch
                  value={settings[setting.key]}
                  onValueChange={() => toggle(setting.key)}
                  trackColor={{ false: colors.lineStrong, true: colors.ember }}
                  thumbColor={colors.surface}
                  ios_backgroundColor={colors.lineStrong}
                />
              }
            />
          ))}
        </View>
      </ScrollView>

      <Sheet
        visible={sheet === 'details'}
        title="Account details"
        subtitle="Shown on this profile. Nothing leaves the device."
        onClose={closeSheet}
        footer={
          <>
            <Button label="Cancel" variant="quiet" onPress={closeSheet} />
            <Button label="Save" icon="check" variant="primary" onPress={saveDetails} />
          </>
        }
      >
        <Field
          label="Name"
          value={draft.name}
          onChangeText={(name) => setDraft((current) => ({ ...current, name }))}
          placeholder="Your name"
          autoCapitalize="words"
          error={errors.name}
        />
        <Field
          label="Handle"
          value={draft.handle}
          onChangeText={(handle) => setDraft((current) => ({ ...current, handle }))}
          placeholder="A line under your name"
          error={errors.handle}
        />
        <Field
          label="Email"
          value={draft.email}
          onChangeText={(email) => setDraft((current) => ({ ...current, email }))}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.email}
        />
      </Sheet>

      <Sheet
        visible={sheet === 'password'}
        title="Change password"
        subtitle="Eight characters or more."
        onClose={closeSheet}
        footer={
          <>
            <Button label="Cancel" variant="quiet" onPress={closeSheet} />
            <Button label="Update" icon="check" variant="primary" onPress={savePassword} />
          </>
        }
      >
        <Field
          label="Current password"
          value={password.current}
          onChangeText={(current) => setPassword((state) => ({ ...state, current }))}
          placeholder="Current password"
          secureTextEntry
          autoCapitalize="none"
          error={errors.current}
        />
        <Field
          label="New password"
          value={password.next}
          onChangeText={(next) => setPassword((state) => ({ ...state, next }))}
          placeholder="New password"
          secureTextEntry
          autoCapitalize="none"
          error={errors.next}
        />
        <Field
          label="Confirm new password"
          value={password.confirm}
          onChangeText={(confirm) => setPassword((state) => ({ ...state, confirm }))}
          placeholder="Repeat the new password"
          secureTextEntry
          autoCapitalize="none"
          error={errors.confirm}
        />
      </Sheet>
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
  section: {
    marginTop: space.xxl,
    marginBottom: space.xs,
  },
  table: {
    marginTop: space.xs,
  },
});

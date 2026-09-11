import { useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, EmptyState, Header, InfoRow, PhotoPreview, SectionLabel } from '../components';
import { colors, GUTTER, radius, space, type } from '../theme/tokens';

export default function CaptureScreen() {
  const [frames, setFrames] = useState([]);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(null);

  const current = frames[selected];

  /**
   * Camera permission is requested explicitly so the denial path is ours to
   * handle: the OS only prompts once, and after that the user has to be sent
   * to Settings or the button silently does nothing.
   */
  const ensureCamera = async () => {
    const { granted, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
    if (granted) return true;

    Alert.alert(
      'Camera access needed',
      canAskAgain
        ? 'Lumen needs the camera to record a new frame.'
        : 'Camera access is turned off for Lumen. Enable it in Settings to record a frame.',
      canAskAgain
        ? [{ text: 'OK' }]
        : [{ text: 'Not now', style: 'cancel' }, { text: 'Open Settings', onPress: () => Linking.openSettings() }]
    );
    return false;
  };

  const addFrame = (asset, source) => {
    setFrames((existing) => [{ ...asset, source, at: stamp() }, ...existing]);
    setSelected(0);
  };

  const takePhoto = async () => {
    if (!(await ensureCamera())) return;
    setBusy('camera');
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });
      if (!result.canceled) addFrame(result.assets[0], 'Camera');
    } catch (error) {
      Alert.alert('Could not open the camera', String(error?.message ?? error));
    } finally {
      setBusy(null);
    }
  };

  const pickPhoto = async () => {
    setBusy('library');
    try {
      // The library picker does not need an explicit permission request on
      // current Expo SDKs - the system picker handles its own access.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });
      if (!result.canceled) addFrame(result.assets[0], 'Library');
    } catch (error) {
      Alert.alert('Could not open the library', String(error?.message ?? error));
    } finally {
      setBusy(null);
    }
  };

  const clear = () =>
    Alert.alert('Clear this roll?', 'The frames are only held in memory, so this cannot be undone.', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setFrames([]);
          setSelected(0);
        },
      },
    ]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header
          eyebrow={`Roll · ${frames.length} frame${frames.length === 1 ? '' : 's'}`}
          title="Capture"
          style={styles.header}
        />

        <Text style={styles.intro}>
          Record a frame with the camera or bring one in from your library. Frames stay on the
          device and live only for this session.
        </Text>

        {current ? (
          <PhotoPreview
            uri={current.uri}
            caption={`Frame ${frames.length - selected}`}
            meta={`${current.width ?? '?'} × ${current.height ?? '?'} · ${current.at}`}
            source={current.source}
          />
        ) : (
          <EmptyState
            icon="camera"
            title="No frames yet"
            body="Nothing has been recorded on this roll. Start with the camera, or pull one in from your library."
          />
        )}

        <View style={styles.actions}>
          <Button
            label="Take a photo"
            icon="camera"
            variant="primary"
            onPress={takePhoto}
            busy={busy === 'camera'}
            disabled={busy !== null}
            style={styles.action}
          />
          <Button
            label="From library"
            icon="image"
            onPress={pickPhoto}
            busy={busy === 'library'}
            disabled={busy !== null}
            style={styles.action}
          />
        </View>

        {frames.length > 0 ? (
          <>
            <SectionLabel style={styles.section} trailing={frames.length > 1 ? 'Tap to view' : undefined}>
              This roll
            </SectionLabel>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.strip}
            >
              {frames.map((frame, index) => (
                <Pressable
                  key={`${frame.uri}-${index}`}
                  onPress={() => setSelected(index)}
                  accessibilityRole="button"
                  accessibilityLabel={`Frame ${frames.length - index}`}
                  accessibilityState={{ selected: index === selected }}
                  style={[styles.stripItem, index === selected && styles.stripItemActive]}
                >
                  <Image source={{ uri: frame.uri }} style={styles.stripImage} resizeMode="cover" />
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.table}>
              <InfoRow label="Source" value={current.source} icon="aperture" />
              <InfoRow label="Recorded" value={current.at} icon="clock" />
              <InfoRow
                label="Dimensions"
                value={current.width ? `${current.width} × ${current.height}` : 'Unknown'}
                icon="maximize"
                last
              />
            </View>

            <Button label="Clear the roll" icon="trash-2" variant="quiet" onPress={clear} />
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function stamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
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
  actions: {
    flexDirection: 'row',
    gap: space.md,
    marginTop: space.xl,
  },
  action: {
    flex: 1,
    paddingHorizontal: space.md,
  },
  section: {
    marginTop: space.xxl,
    marginBottom: space.lg,
  },
  strip: {
    gap: space.md,
    paddingBottom: space.xs,
  },
  stripItem: {
    width: 64,
    height: 78,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.paperDeep,
  },
  stripItemActive: {
    borderColor: colors.ember,
  },
  stripImage: {
    width: '100%',
    height: '100%',
  },
  table: {
    marginTop: space.xl,
    marginBottom: space.sm,
  },
  note: {
    marginTop: space.xxl,
    padding: space.lg,
    borderRadius: radius.md,
    backgroundColor: colors.sageSoft,
    gap: space.xs,
  },
  noteLabel: {
    ...type.micro,
    color: colors.sage,
  },
  noteBody: {
    ...type.caption,
    color: colors.sage,
  },
});

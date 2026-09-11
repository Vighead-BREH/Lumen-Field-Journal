# Lumen

**A static multi-screen Expo app — field notes on light and architecture.**

Course: **CS41A7 — CS Major Elective 3**
Project: Preliminary Examination — *Static Multi-Screen Expo App with Navigation & a Third-Party Package*

Student: **Marc Ejay Cortes**
Section: **CS41A**

---

## What it is

Lumen is a small field journal about how daylight behaves when it hits a
building. Six studies, each with its own plate and on-site notes, plus a
Capture screen that records new frames with the device camera.

It is deliberately **static**: no backend, no database, no network requests.
All content is hardcoded in `src/data/journal.js`, and every image in the app
is generated offline and bundled, so it looks identical in airplane mode.

---

## How to run

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
cd lumen
npm install
npm start
```

Then either:

- **Expo Go** — scan the QR code with the Expo Go app (phone and computer must
  be on the same Wi-Fi network), or
- **Emulator / simulator** — press `a` for Android or `i` for iOS in the
  terminal, or
- **Browser** — press `w`. This is a fallback for demoing without a device;
  the camera button will not do anything useful in a browser.

The camera only works on a real device — emulators have no camera. Use
**From library** on a simulator.

---

## Screens

| # | Screen | Role |
|---|--------|------|
| 1 | **Journal** (`src/screens/JournalScreen.js`) | Home. The feed: one featured plate, then the rest of the collection. |
| 2 | **Capture** (`src/screens/CaptureScreen.js`) | Camera / media. Records frames with `expo-image-picker`. |
| 3 | **Profile** (`src/screens/ProfileScreen.js`) | Identity, submission details, account editing and settings. |
| – | **Entry** (`src/screens/EntryScreen.js`) | Nested detail screen, pushed from Journal. |

---

## Navigation

Both navigation styles are used together:

```
Bottom tabs  (@react-navigation/bottom-tabs)
 ├─ Journal  (native stack — @react-navigation/native-stack)
 │    ├─ Journal    the feed
 │    └─ Entry      pushed detail; pushes itself for "next study"
 ├─ Capture
 └─ Profile
```

Wired up in `src/navigation/RootNavigator.js`.

- **Tabs** switch between the three primary screens. The bar is a custom
  component (`src/navigation/TabBar.js`) rather than the stock one, and still
  emits `tabPress`, so tapping the active tab pops its stack to top.
- **Stack** pushes the Entry screen over the feed. Entry can push *another*
  Entry via **Next in the collection**, so you can build a real back stack and
  pop back through it — useful to show during the demo.

---

## Custom components

All in `src/components/`, most of them reused across more than one screen.

| Component | Used by |
|-----------|---------|
| `Header` | Journal, Capture, Profile |
| `Button` | Capture, Entry, Profile |
| `InfoRow` | Entry, Capture, Profile |
| `SectionLabel` | Journal, Entry, Capture, Profile |
| `Chip` | Entry |
| `EntryCard` | Journal (two variants: `featured` and `compact`) |
| `PhotoPreview` | Capture |
| `EmptyState` | Capture |
| `ProfileCard` (+ `Avatar`, `StatBlock`) | Profile |
| `ActionRow` | Profile (account rows and settings toggles) |
| `Sheet` | Profile (both edit sheets) |
| `Field` | Profile (both edit sheets) |

No screen hardcodes a colour or a spacing value — everything comes from
`src/theme/tokens.js`, so the whole look can be retuned from one file.

---

## Third-party packages

| Package | What it does here |
|---------|-------------------|
| **`expo-image-picker`** | The Capture screen. `launchCameraAsync` records a new frame, `launchImageLibraryAsync` brings in an existing one, and camera permission is requested explicitly so the denied case is handled instead of silently failing. |
| **`@expo/vector-icons`** | Feather glyphs throughout — tab bar, buttons, info rows, back control. |
| **`@react-navigation/*`** | Bottom tabs + native stack (see above). |
| **`expo-linear-gradient`** | Scrims over the plates, so white type stays legible on top of an image. |
| **`expo-font`** + **`@expo-google-fonts/*`** | DM Serif Display and Inter, loaded in `App.js`. |

---

## The artwork

There is no stock photography in this project. Every plate, the avatar, the app
icon, the Android adaptive icons and the favicon are **generated procedurally**
by `tools/generate-art.js` — a small renderer plus a dependency-free PNG
encoder (CRC32, per-scanline filtering, `zlib` deflate) written from scratch.

Each plate is a stack of light operations — a warped base gradient, occluding
tonal bands, angled light shafts, radial bloom, vignette and film grain —
sampled 2× for antialiasing and tuned to the same palette the UI uses.

Regenerate them any time with:

```bash
npm run art
```

---

## Project layout

```
lumen/
├── App.js                      font loading, safe area, hands off to navigation
├── app.json                    Expo config, icons, permission strings
├── assets/
│   ├── art/                    generated plates + avatar
│   └── *.png                   generated app icon set
├── src/
│   ├── components/             the reusable UI kit
│   ├── data/journal.js         all content — hardcoded, no backend
│   ├── navigation/             tabs + stack, custom tab bar
│   ├── screens/                the four screens
│   └── theme/tokens.js         colours, spacing, type scale, shadows
└── tools/generate-art.js       the artwork pipeline
```

---

## Notes for the demo

1. Open on **Journal**, tap the featured plate → the stack pushes **Entry**.
2. On Entry, tap **Next in the collection** → pushes again. Back out twice to
   show the stack popping.
3. Tab to **Capture**, take a photo, show it landing in the preview and in the
   roll strip below.
4. Tab to **Profile** — built almost entirely from the custom components
   (`ProfileCard`, `SectionLabel`, `InfoRow`, `Chip`).

/**
 * Design tokens.
 *
 * Every colour, space, radius and text style in the app comes from here.
 * Screens and components never hardcode a hex value or a magic number, so the
 * whole look can be retuned from this one file.
 *
 * The palette is a warm paper-and-ink editorial scheme: bone-white grounds,
 * near-black ink for type, and a single terracotta "ember" accent reserved for
 * things you can act on. Sage is a quiet second accent for metadata only.
 */

export const colors = {
  // Grounds
  paper: '#FBF7F0', // app background - warm off-white, never pure #FFF
  paperDeep: '#F2EBDD', // recessed areas, image placeholders
  surface: '#FFFFFF', // cards lifted off the paper

  // Ink
  ink: '#1B1A17', // headings and primary text
  inkSoft: '#6E6558', // body copy, secondary text
  inkFaint: '#A0968A', // labels, captions, disabled

  // Structure
  line: '#E7DED0', // hairlines and borders
  lineStrong: '#D6C9B4',

  // Accents
  ember: '#C2562F', // the one action colour
  emberDeep: '#9C3F1D',
  emberSoft: '#F7E7DC', // ember on a tint
  sage: '#4A6151', // metadata accent
  sageSoft: '#E6EBE3',

  // Utility
  shadow: '#2A1B14',
  onEmber: '#FFF8F2',
  scrim: 'rgba(12, 9, 7, 0.55)',
};

/** 4pt spacing scale. */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 26,
  pill: 999,
};

/** Font family names, as registered by expo-font in App.js. */
export const fonts = {
  display: 'DMSerifDisplay_400Regular',
  displayItalic: 'DMSerifDisplay_400Regular_Italic',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
};

/**
 * Type scale. Serif for anything that names something, sans for everything
 * that explains it - which is what gives the app its editorial feel.
 */
export const type = {
  display: {
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 42,
    color: colors.ink,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 27,
    lineHeight: 32,
    color: colors.ink,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 25,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.inkSoft,
  },
  bodyTight: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.ink,
  },
  /** Tracked small caps - section labels, eyebrows, tab titles. */
  micro: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.inkFaint,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.inkFaint,
  },
};

/** Soft, low-contrast elevation. Includes `elevation` so Android matches. */
export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  lift: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
};

/** Horizontal page gutter, shared by every screen so edges line up. */
export const GUTTER = space.xl;

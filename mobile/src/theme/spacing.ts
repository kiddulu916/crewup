/**
 * Spacing and Layout System for CrewUp App
 * Consistent spacing based on 8px grid system
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const IconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
} as const;

export const Layout = {
  // Screen padding
  screenPadding: Spacing.md,
  screenPaddingLarge: Spacing.lg,

  // Card spacing
  cardPadding: Spacing.md,
  cardMargin: Spacing.md,

  // Button dimensions
  buttonHeight: 48,
  buttonHeightSmall: 36,
  buttonHeightLarge: 56,

  // Input dimensions
  inputHeight: 48,
  inputHeightSmall: 36,
  inputHeightLarge: 56,

  // Bottom tab bar
  tabBarHeight: 60,

  // Header
  headerHeight: 56,

  // FAB (Floating Action Button)
  fabSize: 56,
  fabMargin: Spacing.md,
} as const;

export const Shadow = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 2.5,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.23,
    shadowRadius: 4.0,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.27,
    shadowRadius: 6.0,
    elevation: 8,
  },
} as const;

/**
 * Color Palette for CrewUp App
 * Construction-themed colors for a professional, accessible look
 */

export const Colors = {
  // Primary Colors
  primary: '#FF6B35', // Safety Orange - Action buttons, CTAs
  primaryDark: '#E85A28',
  primaryLight: '#FF8557',

  // Secondary Colors
  secondary: '#2C3E50', // Steel Blue - Headers, navigation
  secondaryDark: '#1A252F',
  secondaryLight: '#34495E',

  // Accent Colors
  accent: '#FFC107', // Construction Yellow - Highlights, warnings
  accentDark: '#FFA000',
  accentLight: '#FFD54F',

  // Status Colors
  success: '#27AE60', // Safety Green
  successLight: '#2ECC71',
  error: '#E74C3C',
  errorLight: '#EC7063',
  warning: '#F39C12',
  warningLight: '#F8C471',
  info: '#3498DB',
  infoLight: '#5DADE2',

  // Neutral Colors
  background: '#F5F5F5', // Light Gray
  backgroundDark: '#EEEEEE',
  surface: '#FFFFFF',

  // Text Colors
  text: '#2C3E50', // Dark Charcoal
  textSecondary: '#7F8C8D',
  textLight: '#95A5A6',
  textInverse: '#FFFFFF',

  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#BDBDBD',

  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',

  // Premium Badge Colors
  premium: '#FFD700', // Gold
  premiumDark: '#FFC107',

  // Day Labor Specific
  urgent: '#E74C3C', // Red for urgent jobs

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;

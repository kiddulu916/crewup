/**
 * Color Palette for CrewUp Web App
 * Construction-themed colors for a professional, accessible look
 * These colors are also configured in tailwind.config.ts
 */

export const colors = {
  // Primary Colors
  primary: {
    DEFAULT: '#FF6B35', // Safety Orange
    dark: '#E85A28',
    light: '#FF8557',
  },

  // Secondary Colors
  secondary: {
    DEFAULT: '#2C3E50', // Steel Blue
    dark: '#1A252F',
    light: '#34495E',
  },

  // Accent Colors
  accent: {
    DEFAULT: '#FFC107', // Construction Yellow
    dark: '#FFA000',
    light: '#FFD54F',
  },

  // Status Colors
  success: {
    DEFAULT: '#27AE60', // Safety Green
    light: '#2ECC71',
  },
  error: {
    DEFAULT: '#E74C3C',
    light: '#EC7063',
  },
  warning: {
    DEFAULT: '#F39C12',
    light: '#F8C471',
  },
  info: {
    DEFAULT: '#3498DB',
    light: '#5DADE2',
  },

  // Neutral Colors
  background: {
    DEFAULT: '#F5F5F5',
    dark: '#EEEEEE',
  },
  surface: '#FFFFFF',

  // Text Colors
  text: {
    DEFAULT: '#2C3E50', // Dark Charcoal
    secondary: '#7F8C8D',
    light: '#95A5A6',
    inverse: '#FFFFFF',
  },

  // Border Colors
  border: {
    DEFAULT: '#E0E0E0',
    light: '#F0F0F0',
    dark: '#BDBDBD',
  },

  // Premium Badge Colors
  premium: {
    DEFAULT: '#FFD700', // Gold
    dark: '#FFC107',
  },

  // Day Labor Specific
  urgent: '#E74C3C', // Red for urgent jobs
} as const;

export default colors;

/**
 * CrewUp Theme System
 * Central export for all theme constants
 */

export * from './colors';
export * from './typography';
export * from './spacing';

import { Colors } from './colors';
import { Typography, FontFamily, FontSize } from './typography';
import { Spacing, BorderRadius, Layout, Shadow, IconSize } from './spacing';

/**
 * Complete theme object
 */
export const Theme = {
  colors: Colors,
  typography: Typography,
  fontFamily: FontFamily,
  fontSize: FontSize,
  spacing: Spacing,
  borderRadius: BorderRadius,
  layout: Layout,
  shadow: Shadow,
  iconSize: IconSize,
} as const;

export default Theme;

/**
 * Typography System for CrewUp App
 * Using Roboto and Open Sans fonts for high readability
 */

export const FontFamily = {
  // Headers - Roboto Bold
  heading: 'Roboto_700Bold',
  headingMedium: 'Roboto_500Medium',
  headingRegular: 'Roboto_400Regular',

  // Body - Open Sans
  body: 'OpenSans_400Regular',
  bodyBold: 'OpenSans_700Bold',
  bodySemiBold: 'OpenSans_600SemiBold',
} as const;

export const FontSize = {
  // Headings
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,

  // Body text (minimum 16px for accessibility)
  body: 16,
  bodyLarge: 18,
  bodySmall: 14,

  // Utility
  caption: 12,
  button: 16,
  input: 16,
  label: 14,
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
} as const;

export const Typography = {
  h1: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h1,
    lineHeight: FontSize.h1 * LineHeight.tight,
    fontWeight: FontWeight.bold,
  },
  h2: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    lineHeight: FontSize.h2 * LineHeight.tight,
    fontWeight: FontWeight.bold,
  },
  h3: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h3,
    lineHeight: FontSize.h3 * LineHeight.tight,
    fontWeight: FontWeight.bold,
  },
  h4: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.h4,
    lineHeight: FontSize.h4 * LineHeight.normal,
    fontWeight: FontWeight.semiBold,
  },
  h5: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.h5,
    lineHeight: FontSize.h5 * LineHeight.normal,
    fontWeight: FontWeight.semiBold,
  },
  h6: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.h6,
    lineHeight: FontSize.h6 * LineHeight.normal,
    fontWeight: FontWeight.medium,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    lineHeight: FontSize.body * LineHeight.normal,
    fontWeight: FontWeight.regular,
  },
  bodyLarge: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLarge,
    lineHeight: FontSize.bodyLarge * LineHeight.normal,
    fontWeight: FontWeight.regular,
  },
  bodySmall: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySmall,
    lineHeight: FontSize.bodySmall * LineHeight.normal,
    fontWeight: FontWeight.regular,
  },
  bodyBold: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    lineHeight: FontSize.body * LineHeight.normal,
    fontWeight: FontWeight.bold,
  },
  caption: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    lineHeight: FontSize.caption * LineHeight.normal,
    fontWeight: FontWeight.regular,
  },
  button: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.button,
    lineHeight: FontSize.button * LineHeight.normal,
    fontWeight: FontWeight.bold,
  },
} as const;

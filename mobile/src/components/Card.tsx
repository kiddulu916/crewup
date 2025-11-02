import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'flat' | 'elevated';
  padding?: keyof typeof Spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'md',
  style,
  ...props
}) => {
  return (
    <View
      {...props}
      style={[
        styles.card,
        variant === 'elevated' ? Shadow.md : Shadow.none,
        {
          padding: Spacing[padding],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
});

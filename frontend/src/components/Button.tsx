import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      ...styles.base,
      ...getSizeStyle(),
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: disabled ? '#9CA3AF' : COLORS.primary,
          ...SHADOWS.medium,
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: disabled ? '#9CA3AF' : COLORS.secondary,
          ...SHADOWS.medium,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled ? '#9CA3AF' : COLORS.primary,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
        };
      default:
        return base;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md };
      case 'large':
        return { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl };
      default:
        return { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg };
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontSize: size === 'small' ? FONTS.sizes.sm : size === 'large' ? FONTS.sizes.lg : FONTS.sizes.md,
      fontWeight: '600',
    };

    switch (variant) {
      case 'outline':
      case 'ghost':
        return { ...base, color: disabled ? '#9CA3AF' : COLORS.primary };
      default:
        return { ...base, color: COLORS.textWhite };
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.textWhite} />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    gap: SPACING.sm,
  },
});

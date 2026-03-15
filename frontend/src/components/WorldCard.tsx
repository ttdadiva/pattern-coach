import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, SHADOWS } from '../theme';

interface WorldCardProps {
  world: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    unlocked: boolean;
    unlock_requirement?: number;
  };
  userStars?: number;
  onPress: () => void;
}

export const WorldCard: React.FC<WorldCardProps> = ({ world, userStars = 0, onPress }) => {
  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    switch (world.icon) {
      case 'compass': return 'compass-outline';
      case 'leaf': return 'leaf-outline';
      case 'water': return 'water-outline';
      case 'music': return 'musical-notes-outline';
      case 'buildings': return 'business-outline';
      default: return 'star-outline';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: world.color },
        !world.unlocked && styles.locked
      ]}
      onPress={onPress}
      disabled={!world.unlocked}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: world.color }]}>
        <Ionicons name={getIconName()} size={32} color={COLORS.textWhite} />
        {!world.unlocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={20} color={COLORS.textWhite} />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, !world.unlocked && styles.lockedText]}>
          {world.name}
        </Text>
        <Text style={[styles.description, !world.unlocked && styles.lockedText]}>
          {world.description}
        </Text>
        {!world.unlocked && world.unlock_requirement && (
          <View style={styles.requirementContainer}>
            <Ionicons name="star" size={14} color={COLORS.accent} />
            <Text style={styles.requirementText}>
              {world.unlock_requirement - userStars} more stars to unlock
            </Text>
          </View>
        )}
      </View>
      
      <Ionicons 
        name={world.unlocked ? "chevron-forward" : "lock-closed"}
        size={24} 
        color={world.unlocked ? world.color : '#9CA3AF'} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: SPACING.md,
    borderWidth: 2,
    ...SHADOWS.medium,
  },
  locked: {
    opacity: 0.6,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  lockedText: {
    color: '#9CA3AF',
  },
  requirementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: 4,
  },
  requirementText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.accent,
    fontWeight: '500',
  },
});

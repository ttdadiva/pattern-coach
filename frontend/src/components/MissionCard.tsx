import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, SHADOWS } from '../theme';

interface MissionCardProps {
  mission: {
    id: string;
    name: string;
    description: string;
    pattern_type: string;
    stars_reward: number;
    completed?: boolean;
  };
  worldColor: string;
  onPress: () => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, worldColor, onPress }) => {
  const getPatternIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (mission.pattern_type) {
      case 'stripes': return 'reorder-four-outline';
      case 'dots': return 'ellipse-outline';
      case 'shapes': return 'shapes-outline';
      case 'leaves': return 'leaf-outline';
      case 'flowers': return 'flower-outline';
      case 'animal': return 'paw-outline';
      case 'waves': return 'water-outline';
      case 'spirals': return 'sync-outline';
      case 'scales': return 'fish-outline';
      case 'rhythm': return 'musical-notes-outline';
      case 'soundwaves': return 'pulse-outline';
      case 'buildings': return 'business-outline';
      case 'signs': return 'alert-circle-outline';
      case 'tiles': return 'grid-outline';
      default: return 'search-outline';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        mission.completed && styles.completed
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: worldColor }]}>
        <Ionicons name={getPatternIcon()} size={28} color={COLORS.textWhite} />
        {mission.completed && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{mission.name}</Text>
        <Text style={styles.description}>{mission.description}</Text>
        <View style={styles.rewardContainer}>
          <Ionicons name="star" size={16} color={COLORS.accent} />
          <Text style={styles.rewardText}>+{mission.stars_reward} stars</Text>
        </View>
      </View>
      
      <View style={styles.playButton}>
        <Ionicons 
          name={mission.completed ? "checkmark" : "play"}
          size={20} 
          color={COLORS.textWhite}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  completed: {
    backgroundColor: '#F0FDF4',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  checkmark: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: 4,
  },
  rewardText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.accent,
    fontWeight: '600',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

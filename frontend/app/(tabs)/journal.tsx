import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useGameStore } from '../../src/store/gameStore';
import { Honeybee } from '../../src/components';
import { COLORS, SPACING, FONTS, SHADOWS } from '../../src/theme';

export default function Journal() {
  const { user, token, refreshUser } = useAuth();
  const { badges, fetchBadges } = useGameStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (token) {
      fetchBadges(token);
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    if (token) {
      await fetchBadges(token);
    }
    setRefreshing(false);
  };

  const getBadgeIcon = (icon: string): keyof typeof Ionicons.glyphMap => {
    switch (icon) {
      case 'star': return 'star';
      case 'stripes': return 'reorder-four';
      case 'dots': return 'ellipse';
      case 'leaf': return 'leaf';
      case 'compass': return 'compass';
      case 'trophy': return 'trophy';
      default: return 'ribbon';
    }
  };

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Journal</Text>
            <Text style={styles.subtitle}>Your pattern discoveries!</Text>
          </View>
          <Honeybee size={60} expression="happy" />
        </View>

        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="search" size={28} color={COLORS.primary} />
            <Text style={styles.statValue}>{user?.discovered_patterns?.length || 0}</Text>
            <Text style={styles.statLabel}>Patterns Found</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done" size={28} color={COLORS.success} />
            <Text style={styles.statValue}>{user?.completed_missions?.length || 0}</Text>
            <Text style={styles.statLabel}>Missions Done</Text>
          </View>
        </View>

        {/* Badges Section */}
        <Text style={styles.sectionTitle}>My Badges</Text>
        
        {unlockedBadges.length > 0 ? (
          <View style={styles.badgesGrid}>
            {unlockedBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <View style={[styles.badgeIcon, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name={getBadgeIcon(badge.icon)} size={28} color={COLORS.textWhite} />
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDesc}>{badge.description}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="ribbon-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No badges yet!</Text>
            <Text style={styles.emptySubtext}>Complete missions to earn badges</Text>
          </View>
        )}

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Badges to Earn</Text>
            <View style={styles.badgesGrid}>
              {lockedBadges.map((badge) => (
                <View key={badge.id} style={[styles.badgeCard, styles.lockedBadge]}>
                  <View style={[styles.badgeIcon, { backgroundColor: COLORS.textLight }]}>
                    <Ionicons name="lock-closed" size={24} color={COLORS.textWhite} />
                  </View>
                  <Text style={[styles.badgeName, styles.lockedText]}>{badge.name}</Text>
                  <Text style={[styles.badgeDesc, styles.lockedText]}>{badge.description}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Discovered Patterns */}
        <Text style={styles.sectionTitle}>Pattern Collection</Text>
        {user?.discovered_patterns && user.discovered_patterns.length > 0 ? (
          <View style={styles.patternsContainer}>
            {user.discovered_patterns.map((pattern, index) => (
              <View key={index} style={styles.patternItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                <Text style={styles.patternText}>{pattern}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No patterns collected!</Text>
            <Text style={styles.emptySubtext}>Use the camera to find patterns</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  lockedBadge: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  badgeName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 2,
  },
  lockedText: {
    color: COLORS.textLight,
  },
  patternsContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  patternText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    ...SHADOWS.small,
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});

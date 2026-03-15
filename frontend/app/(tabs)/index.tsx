import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useGameStore } from '../../src/store/gameStore';
import { Avatar, Honeybee } from '../../src/components';
import { COLORS, SPACING, FONTS, SHADOWS } from '../../src/theme';

export default function Home() {
  const router = useRouter();
  const { user, token, refreshUser } = useAuth();
  const { fetchWorlds, fetchBadges, worlds } = useGameStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (token) {
      fetchWorlds(token);
      fetchBadges(token);
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    if (token) {
      await fetchWorlds(token);
      await fetchBadges(token);
    }
    setRefreshing(false);
  };

  const completedMissions = user?.completed_missions?.length || 0;
  const totalMissions = worlds.reduce((acc, w) => acc + (w.missions?.length || 0), 0);

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
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Hello,</Text>
            <Text style={styles.nameText}>{user?.child_name || 'Explorer'}!</Text>
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => router.push('/avatar')}
          >
            <Avatar size={50} avatar={user?.avatar} />
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.mascotWrap}>
            <Honeybee size={80} expression="excited" />
          </View>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={24} color={COLORS.accent} />
              <Text style={styles.statValue}>{user?.stars || 0}</Text>
              <Text style={styles.statLabel}>Stars</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={24} color={COLORS.secondary} />
              <Text style={styles.statValue}>{user?.level || 1}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="ribbon" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>{user?.badges?.length || 0}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#312E81' }]}
            onPress={() => router.push('/gameboard')}
          >
            <Ionicons name="game-controller" size={32} color={COLORS.textWhite} />
            <Text style={styles.actionText}>Game Board</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#B45309' }]}
            onPress={() => router.push('/rootdetective')}
          >
            <Ionicons name="search" size={32} color={COLORS.textWhite} />
            <Text style={styles.actionText}>Root Detective</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: COLORS.primary }]}
            onPress={() => router.push('/(tabs)/camera')}
          >
            <Ionicons name="camera" size={32} color={COLORS.textWhite} />
            <Text style={styles.actionText}>Find Patterns</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: COLORS.secondary }]}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Ionicons name="compass" size={32} color={COLORS.textWhite} />
            <Text style={styles.actionText}>Explore Worlds</Text>
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Missions Completed</Text>
            <Text style={styles.progressValue}>
              {completedMissions}/{totalMissions}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressSubtext}>
            {totalMissions - completedMissions} missions left to explore!
          </Text>
        </View>

        {/* Patterns Discovered */}
        <Text style={styles.sectionTitle}>Patterns Discovered</Text>
        <View style={styles.patternsCard}>
          {user?.discovered_patterns && user.discovered_patterns.length > 0 ? (
            <View style={styles.patternTags}>
              {user.discovered_patterns.slice(0, 6).map((pattern, index) => (
                <View key={index} style={styles.patternTag}>
                  <Text style={styles.patternTagText}>{pattern}</Text>
                </View>
              ))}
              {user.discovered_patterns.length > 6 && (
                <View style={[styles.patternTag, { backgroundColor: COLORS.textLight }]}>
                  <Text style={styles.patternTagText}>+{user.discovered_patterns.length - 6}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.emptyPatterns}>
              <Ionicons name="search" size={40} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No patterns discovered yet!</Text>
              <Text style={styles.emptySubtext}>Use the camera to find your first pattern</Text>
            </View>
          )}
        </View>
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
  greeting: {},
  greetingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
  },
  nameText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  avatarContainer: {
    borderRadius: 25,
    borderWidth: 3,
    borderColor: COLORS.primary,
    padding: 2,
  },
  statsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  mascotWrap: {
    position: 'absolute',
    top: -40,
    right: 20,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOWS.medium,
  },
  actionText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  progressCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  progressSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  patternsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  patternTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  patternTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  patternTagText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textWhite,
    fontWeight: '500',
  },
  emptyPatterns: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
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

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { Avatar, Honeybee, Button } from '../../src/components';
import { COLORS, SPACING, FONTS, SHADOWS } from '../../src/theme';

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        },
      ]
    );
  };

  const getSubscriptionStatus = () => {
    switch (user?.subscription_status) {
      case 'trial':
        return { text: 'Free Trial', color: COLORS.info, icon: 'time-outline' as const };
      case 'active':
        return { text: 'Premium', color: COLORS.success, icon: 'star' as const };
      case 'expired':
        return { text: 'Expired', color: COLORS.error, icon: 'alert-circle-outline' as const };
      default:
        return { text: 'Free', color: COLORS.textLight, icon: 'gift-outline' as const };
    }
  };

  const status = getSubscriptionStatus();

  const getTrialDaysLeft = () => {
    if (user?.trial_end_date && user.subscription_status === 'trial') {
      const endDate = new Date(user.trial_end_date);
      const now = new Date();
      const diff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(0, diff);
    }
    return 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Honeybee size={50} expression="happy" />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity 
            style={styles.avatarWrapper}
            onPress={() => router.push('/avatar')}
          >
            <Avatar size={100} avatar={user?.avatar} />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color={COLORS.textWhite} />
            </View>
          </TouchableOpacity>
          <Text style={styles.childName}>{user?.child_name || 'Explorer'}</Text>
          <Text style={styles.childAge}>Age {user?.child_age || '?'}</Text>
          <View style={styles.levelBadge}>
            <Ionicons name="trophy" size={16} color={COLORS.accent} />
            <Text style={styles.levelText}>Level {user?.level || 1}</Text>
          </View>
        </View>

        {/* Subscription Status */}
        <View style={[styles.subscriptionCard, { borderColor: status.color }]}>
          <View style={styles.subscriptionHeader}>
            <Ionicons name={status.icon} size={24} color={status.color} />
            <Text style={[styles.subscriptionStatus, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
          {user?.subscription_status === 'trial' && (
            <Text style={styles.trialText}>
              {getTrialDaysLeft()} days left in your free trial
            </Text>
          )}
          {user?.subscription_status !== 'active' && (
            <Button
              title="Upgrade to Premium"
              onPress={() => router.push('/subscription')}
              variant="secondary"
              size="small"
              style={styles.upgradeButton}
            />
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={28} color={COLORS.accent} />
            <Text style={styles.statValue}>{user?.stars || 0}</Text>
            <Text style={styles.statLabel}>Stars</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="ribbon" size={28} color={COLORS.primary} />
            <Text style={styles.statValue}>{user?.badges?.length || 0}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-done" size={28} color={COLORS.success} />
            <Text style={styles.statValue}>{user?.completed_missions?.length || 0}</Text>
            <Text style={styles.statLabel}>Missions</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/avatar')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={22} color={COLORS.primary} />
              <Text style={styles.menuItemText}>Edit Avatar</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/subscription')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="card-outline" size={22} color={COLORS.secondary} />
              <Text style={styles.menuItemText}>Subscription</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
              <Text style={[styles.menuItemText, { color: COLORS.error }]}>Sign Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        {/* Account Info */}
        <View style={styles.accountInfo}>
          <Text style={styles.accountLabel}>Parent Email</Text>
          <Text style={styles.accountValue}>{user?.email || '-'}</Text>
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
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  profileCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.cardBg,
  },
  childName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  childAge: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  levelText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.accent,
  },
  subscriptionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    ...SHADOWS.small,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  subscriptionStatus: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  trialText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  upgradeButton: {
    marginTop: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuItemText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  accountInfo: {
    alignItems: 'center',
  },
  accountLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
  },
  accountValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
});

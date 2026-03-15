import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useGameStore } from '../../src/store/gameStore';
import { WorldCard, Honeybee } from '../../src/components';
import { COLORS, SPACING, FONTS } from '../../src/theme';

export default function Explore() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { worlds, fetchWorlds, loading } = useGameStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (token) {
      fetchWorlds(token);
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (token) {
      await fetchWorlds(token);
    }
    setRefreshing(false);
  };

  const handleWorldPress = (worldId: string) => {
    router.push(`/world/${worldId}`);
  };

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
            <Text style={styles.title}>Explore Worlds</Text>
            <Text style={styles.subtitle}>Choose a world to discover patterns!</Text>
          </View>
          <Honeybee size={60} expression="happy" />
        </View>

        {/* Stars Banner */}
        <View style={styles.starsBanner}>
          <Ionicons name="star" size={24} color={COLORS.accent} />
          <Text style={styles.starsText}>
            You have <Text style={styles.starsValue}>{user?.stars || 0}</Text> stars!
          </Text>
        </View>

        {/* Worlds List */}
        <View style={styles.worldsList}>
          {worlds.map((world) => (
            <WorldCard
              key={world.id}
              world={world}
              userStars={user?.stars || 0}
              onPress={() => handleWorldPress(world.id)}
            />
          ))}
        </View>

        {worlds.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="planet-outline" size={60} color={COLORS.textLight} />
            <Text style={styles.emptyText}>Loading worlds...</Text>
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
  starsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    padding: SPACING.md,
    borderRadius: 16,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  starsText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  starsValue: {
    fontWeight: '700',
    color: COLORS.accent,
  },
  worldsList: {
    gap: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },
});

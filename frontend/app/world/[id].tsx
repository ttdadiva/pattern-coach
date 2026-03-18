import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../../src/context/AuthContext';
import { useGameStore } from '../../src/store/gameStore';
import { MissionCard, Honeybee, Button } from '../../src/components';
import { COLORS, SPACING, FONTS, SHADOWS } from '../../src/theme';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://pattern-coach.onrender.com';

export default function WorldDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token, refreshUser } = useAuth();
  const { completeMission } = useGameStore();
  
  const [world, setWorld] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    fetchWorldData();
  }, [id, token]);

  const fetchWorldData = async () => {
    if (!token || !id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/adventure/missions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorld(response.data.world);
      setMissions(response.data.missions);
    } catch (error) {
      console.error('Error fetching world:', error);
      Alert.alert('Error', 'Could not load world data');
    } finally {
      setLoading(false);
    }
  };

  const handleMissionPress = async (mission: any) => {
    if (mission.completed) {
      Alert.alert(
        'Mission Completed!',
        'You already completed this mission. Great job!',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      mission.name,
      `${mission.description}\n\nReward: ${mission.stars_reward} stars\n\nWould you like to start this mission?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Mission', 
          onPress: () => startMission(mission)
        },
      ]
    );
  };

  const startMission = (mission: any) => {
    // Navigate to camera to find patterns for this mission
    router.push({
      pathname: '/(tabs)/camera',
      params: {
        missionId: mission.id,
        worldId: id,
        patternType: mission.pattern_type,
      }
    });
  };

  const handleCompleteMission = async (missionId: string) => {
    if (!token || !id) return;
    
    setCompleting(missionId);
    try {
      const result = await completeMission(token, missionId, id, 5, ['pattern']);
      await refreshUser();
      await fetchWorldData();
      
      Alert.alert(
        'Mission Complete!',
        `You earned ${result.stars_earned} stars! Total: ${result.total_stars} stars`,
        [{ text: 'Awesome!' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Could not complete mission');
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading world...</Text>
      </View>
    );
  }

  const completedCount = missions.filter(m => m.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: world?.color || COLORS.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textWhite} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Honeybee size={70} expression="excited" />
          <Text style={styles.worldTitle}>{world?.name}</Text>
          <Text style={styles.worldDesc}>{world?.description}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>Progress</Text>
          <Text style={styles.progressValue}>{completedCount}/{missions.length} missions</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${missions.length > 0 ? (completedCount / missions.length) * 100 : 0}%`,
                backgroundColor: world?.color || COLORS.primary
              }
            ]} 
          />
        </View>
      </View>

      {/* Missions */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Missions</Text>
        <View style={styles.missionsList}>
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              worldColor={world?.color || COLORS.primary}
              onPress={() => handleMissionPress(mission)}
            />
          ))}
        </View>

        {missions.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="rocket-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No missions available</Text>
          </View>
        )}

        {/* Quick Complete for Demo */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Quick Actions</Text>
          <Text style={styles.demoText}>
            Tap a mission to go to the camera and find patterns, or use quick complete below:
          </Text>
          <View style={styles.demoButtons}>
            {missions.filter(m => !m.completed).slice(0, 2).map((mission) => (
              <Button
                key={mission.id}
                title={`Complete: ${mission.name}`}
                onPress={() => handleCompleteMission(mission.id)}
                variant="outline"
                size="small"
                loading={completing === mission.id}
                style={styles.demoButton}
              />
            ))}
          </View>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
  },
  header: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  worldTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginTop: SPACING.sm,
  },
  worldDesc: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.xs,
  },
  progressSection: {
    backgroundColor: COLORS.cardBg,
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.lg,
    borderRadius: 16,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressText: {
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
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  missionsList: {
    gap: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  demoSection: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  demoTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  demoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  demoButtons: {
    gap: SPACING.sm,
  },
  demoButton: {
    borderColor: COLORS.primary,
  },
});

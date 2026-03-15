import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components';
import { COLORS, SPACING, FONTS } from '../../src/theme';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://code-coach-ai.preview.emergentagent.com';

interface WordPart {
  text: string;
  type: 'root' | 'prefix' | 'suffix';
}

interface Word {
  word: string;
  parts: WordPart[];
  part_of_speech: string;
  definition: string;
  emoji: string;
  sentence: string;
}

interface Root {
  id: string;
  root: string;
  meaning: string;
  age_group: string;
  color: string;
  words: Word[];
  completed_words?: string[];
  mastered?: boolean;
}

export default function RootDetective() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [roots, setRoots] = useState<Root[]>([]);
  const [partColors, setPartColors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [totalWords, setTotalWords] = useState(0);
  const [completedWords, setCompletedWords] = useState(0);

  useEffect(() => {
    fetchRoots();
  }, [token]);

  const fetchRoots = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/roots`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoots(response.data.roots);
      setPartColors(response.data.part_colors);
      setTotalWords(response.data.total_words);
      setCompletedWords(response.data.completed_words);
    } catch (error) {
      console.error('Error fetching roots:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWordParts = (parts: WordPart[]) => {
    return (
      <View style={styles.wordParts}>
        {parts.map((part, index) => (
          <View
            key={index}
            style={[
              styles.wordPart,
              { backgroundColor: partColors[part.type] || COLORS.primary }
            ]}
          >
            <Text style={styles.wordPartText}>{part.text}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading Root Detective...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{completedWords}/{totalWords} words</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🔍</Text>
          <Text style={styles.title}>Root Detective</Text>
          <Text style={styles.subtitle}>Discover how words are built!</Text>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Word Parts:</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: partColors.prefix }]} />
              <Text style={styles.legendText}>Prefix (before)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: partColors.root }]} />
              <Text style={styles.legendText}>Root (main)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: partColors.suffix }]} />
              <Text style={styles.legendText}>Suffix (after)</Text>
            </View>
          </View>
        </View>

        {/* Game Modes */}
        <Text style={styles.sectionTitle}>Game Modes</Text>
        <View style={styles.gameModes}>
          <TouchableOpacity 
            style={[styles.gameMode, { backgroundColor: '#10B981' }]}
            onPress={() => router.push('/rootdetective/explorer')}
          >
            <Ionicons name="search" size={32} color="white" />
            <Text style={styles.gameModeTitle}>Word Explorer</Text>
            <Text style={styles.gameModeDesc}>Learn word parts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.gameMode, { backgroundColor: '#3B82F6' }]}
            onPress={() => router.push('/rootdetective/match')}
          >
            <Ionicons name="git-compare" size={32} color="white" />
            <Text style={styles.gameModeTitle}>Match Game</Text>
            <Text style={styles.gameModeDesc}>Match words to roots</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.gameMode, { backgroundColor: '#F59E0B' }]}
            onPress={() => router.push('/rootdetective/sort')}
          >
            <Ionicons name="funnel" size={32} color="white" />
            <Text style={styles.gameModeTitle}>Sort Game</Text>
            <Text style={styles.gameModeDesc}>Noun, Verb, Adjective</Text>
          </TouchableOpacity>
        </View>

        {/* Root Families */}
        <Text style={styles.sectionTitle}>Root Families</Text>
        <View style={styles.rootList}>
          {roots.map((root) => (
            <TouchableOpacity
              key={root.id}
              style={[styles.rootCard, { borderLeftColor: root.color }]}
              onPress={() => router.push(`/rootdetective/explorer?root=${root.id}`)}
            >
              <View style={styles.rootHeader}>
                <View style={[styles.rootBadge, { backgroundColor: root.color }]}>
                  <Text style={styles.rootText}>{root.root}</Text>
                </View>
                {root.mastered && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                )}
              </View>
              <Text style={styles.rootMeaning}>means "{root.meaning}"</Text>
              <View style={styles.rootWords}>
                {root.words.slice(0, 3).map((word, index) => (
                  <View key={index} style={styles.miniWord}>
                    {renderWordParts(word.parts)}
                  </View>
                ))}
              </View>
              <View style={styles.rootProgress}>
                <Text style={styles.rootProgressText}>
                  {root.completed_words?.length || 0}/{root.words.length} learned
                </Text>
                <Text style={styles.ageTag}>{root.age_group}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF3C7', // Warm yellow background
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBadge: {
    backgroundColor: 'white',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  heroEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
  },
  legend: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  legendTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  gameModes: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  gameMode: {
    flex: 1,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
  },
  gameModeTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: 'white',
    marginTop: SPACING.xs,
  },
  gameModeDesc: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  rootList: {
    gap: SPACING.md,
  },
  rootCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: SPACING.md,
    borderLeftWidth: 4,
  },
  rootHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  rootBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  rootText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: 'white',
  },
  rootMeaning: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  rootWords: {
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  miniWord: {
    flexDirection: 'row',
  },
  wordParts: {
    flexDirection: 'row',
    gap: 2,
  },
  wordPart: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  wordPartText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: 'white',
  },
  rootProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rootProgressText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
  },
  ageTag: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
});

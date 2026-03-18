import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components';
import { COLORS, SPACING, FONTS } from '../../src/theme';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://pattern-coach.onrender.com';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Word {
  word: string;
  rootId: string;
  rootName: string;
  color: string;
}

export default function MatchGame() {
  const router = useRouter();
  const { token, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState<Word[]>([]);
  const [roots, setRoots] = useState<{ id: string; name: string; color: string }[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedRoot, setSelectedRoot] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    fetchAndSetupGame();
  }, [token]);

  const fetchAndSetupGame = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/roots`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Extract words and roots for matching
      const allWords: Word[] = [];
      const allRoots: { id: string; name: string; color: string }[] = [];
      
      response.data.roots.forEach((root: any) => {
        allRoots.push({ id: root.id, name: root.root, color: root.color });
        root.words.forEach((w: any) => {
          allWords.push({
            word: w.word,
            rootId: root.id,
            rootName: root.root,
            color: root.color,
          });
        });
      });
      
      // Shuffle words
      const shuffledWords = allWords.sort(() => Math.random() - 0.5).slice(0, 6);
      setWords(shuffledWords);
      setRoots(allRoots);
    } catch (error) {
      console.error('Error fetching game data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWordPress = (word: string) => {
    if (matches[word]) return; // Already matched
    setSelectedWord(word);
    checkMatch(word, selectedRoot);
  };

  const handleRootPress = (rootId: string) => {
    setSelectedRoot(rootId);
    checkMatch(selectedWord, rootId);
  };

  const checkMatch = (word: string | null, rootId: string | null) => {
    if (!word || !rootId) return;
    
    const wordData = words.find(w => w.word === word);
    if (!wordData) return;
    
    setAttempts(attempts + 1);
    
    if (wordData.rootId === rootId) {
      // Correct match!
      setMatches({ ...matches, [word]: rootId });
      setScore(score + 10);
      setSelectedWord(null);
      setSelectedRoot(null);
      
      // Check if game complete
      const newMatchCount = Object.keys(matches).length + 1;
      if (newMatchCount === words.length) {
        setGameComplete(true);
      }
    } else {
      // Wrong match - shake and reset
      setTimeout(() => {
        setSelectedWord(null);
        setSelectedRoot(null);
      }, 500);
    }
  };

  const saveProgress = async () => {
    if (!token) return;
    
    try {
      for (const word of Object.keys(matches)) {
        const wordData = words.find(w => w.word === word);
        if (wordData) {
          await axios.post(
            `${API_URL}/api/roots/progress`,
            {
              root_id: wordData.rootId,
              word: word,
              game_type: 'match',
              score: 10
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
      await refreshUser();
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleGameComplete = async () => {
    await saveProgress();
    Alert.alert(
      '🎉 Great Matching!',
      `You scored ${score} points with ${((Object.keys(matches).length / attempts) * 100).toFixed(0)}% accuracy!`,
      [
        { text: 'Play Again', onPress: () => {
          setMatches({});
          setScore(0);
          setAttempts(0);
          setGameComplete(false);
          fetchAndSetupGame();
        }},
        { text: 'Back', onPress: () => router.back() }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Setting up game...</Text>
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
        <Text style={styles.headerTitle}>Match Game</Text>
        <View style={styles.scoreBox}>
          <Ionicons name="star" size={16} color={COLORS.accent} />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Ionicons name="information-circle" size={20} color={COLORS.info} />
        <Text style={styles.instructionText}>Match each word to its root family!</Text>
      </View>

      {/* Words */}
      <Text style={styles.sectionTitle}>Words</Text>
      <View style={styles.wordsContainer}>
        {words.map((w) => (
          <TouchableOpacity
            key={w.word}
            style={[
              styles.wordChip,
              selectedWord === w.word && styles.selectedChip,
              matches[w.word] && { backgroundColor: w.color, opacity: 0.6 },
            ]}
            onPress={() => handleWordPress(w.word)}
            disabled={!!matches[w.word]}
          >
            <Text style={[
              styles.wordChipText,
              (selectedWord === w.word || matches[w.word]) && { color: 'white' }
            ]}>
              {w.word}
            </Text>
            {matches[w.word] && (
              <Ionicons name="checkmark-circle" size={16} color="white" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Roots */}
      <Text style={styles.sectionTitle}>Root Families</Text>
      <View style={styles.rootsContainer}>
        {roots.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[
              styles.rootChip,
              { borderColor: r.color },
              selectedRoot === r.id && { backgroundColor: r.color },
            ]}
            onPress={() => handleRootPress(r.id)}
          >
            <Text style={[
              styles.rootChipText,
              { color: selectedRoot === r.id ? 'white' : r.color }
            ]}>
              {r.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>
          Matched: {Object.keys(matches).length}/{words.length}
        </Text>
        {attempts > 0 && (
          <Text style={styles.accuracyText}>
            Accuracy: {((Object.keys(matches).length / attempts) * 100).toFixed(0)}%
          </Text>
        )}
      </View>

      {/* Complete Button */}
      {gameComplete && (
        <Button
          title="See Results! 🎉"
          onPress={handleGameComplete}
          size="large"
          style={styles.completeButton}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF5FF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF5FF',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'white',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'white',
    marginHorizontal: SPACING.md,
    padding: SPACING.sm,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  instructionText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'white',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  wordChipText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  rootsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  rootChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 16,
    borderWidth: 3,
    backgroundColor: 'white',
  },
  rootChipText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  progressText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  accuracyText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: 4,
  },
  completeButton: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
});

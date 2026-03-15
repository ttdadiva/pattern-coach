import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components';
import { COLORS, SPACING, FONTS } from '../../src/theme';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://code-coach-ai.preview.emergentagent.com';

interface Word {
  word: string;
  part_of_speech: string;
  emoji: string;
  rootId: string;
}

const POS_COLORS = {
  noun: '#EC4899',
  verb: '#8B5CF6',
  adjective: '#F59E0B',
};

const POS_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  noun: 'cube',
  verb: 'flash',
  adjective: 'color-palette',
};

export default function SortGame() {
  const router = useRouter();
  const { token, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [sorted, setSorted] = useState<Record<string, string[]>>({
    noun: [],
    verb: [],
    adjective: [],
  });
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
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
      
      const allWords: Word[] = [];
      response.data.roots.forEach((root: any) => {
        root.words.forEach((w: any) => {
          allWords.push({
            word: w.word,
            part_of_speech: w.part_of_speech,
            emoji: w.emoji,
            rootId: root.id,
          });
        });
      });
      
      // Shuffle and take 9 words (3 of each type if possible)
      const shuffled = allWords.sort(() => Math.random() - 0.5);
      setWords(shuffled.slice(0, 9));
    } catch (error) {
      console.error('Error fetching game data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentWord = words[currentWordIndex];

  const handleSort = async (pos: string) => {
    if (!currentWord || showFeedback) return;
    
    const isCorrect = currentWord.part_of_speech === pos;
    
    setShowFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setScore(score + 10 + streak * 2);
      setStreak(streak + 1);
      setSorted({
        ...sorted,
        [pos]: [...sorted[pos], currentWord.word]
      });
    } else {
      setStreak(0);
    }
    
    setTimeout(() => {
      setShowFeedback(null);
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        setGameComplete(true);
      }
    }, 800);
  };

  const saveProgress = async () => {
    if (!token) return;
    
    try {
      // Save progress for correctly sorted words
      for (const pos of Object.keys(sorted)) {
        for (const word of sorted[pos]) {
          const wordData = words.find(w => w.word === word);
          if (wordData) {
            await axios.post(
              `${API_URL}/api/roots/progress`,
              {
                root_id: wordData.rootId,
                word: word,
                game_type: 'sort',
                score: 10
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        }
      }
      await refreshUser();
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleGameComplete = async () => {
    await saveProgress();
    const totalSorted = Object.values(sorted).flat().length;
    const accuracy = Math.round((totalSorted / words.length) * 100);
    
    Alert.alert(
      '🎉 Great Sorting!',
      `Score: ${score} points\nAccuracy: ${accuracy}%\nBest streak: ${streak}`,
      [
        { text: 'Play Again', onPress: () => {
          setSorted({ noun: [], verb: [], adjective: [] });
          setScore(0);
          setStreak(0);
          setCurrentWordIndex(0);
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
        <Text style={styles.headerTitle}>Sort Game</Text>
        <View style={styles.scoreBox}>
          <Ionicons name="star" size={16} color={COLORS.accent} />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentWordIndex) / words.length) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>{currentWordIndex + 1}/{words.length}</Text>

      {/* Streak */}
      {streak > 1 && (
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={16} color="#F59E0B" />
          <Text style={styles.streakText}>{streak} streak! +{streak * 2} bonus</Text>
        </View>
      )}

      {/* Current Word */}
      {!gameComplete && currentWord && (
        <View style={[
          styles.wordCard,
          showFeedback === 'correct' && styles.wordCardCorrect,
          showFeedback === 'wrong' && styles.wordCardWrong,
        ]}>
          <Text style={styles.wordEmoji}>{currentWord.emoji}</Text>
          <Text style={styles.wordText}>{currentWord.word}</Text>
          <Text style={styles.wordHint}>What type of word is this?</Text>
          
          {showFeedback && (
            <View style={styles.feedback}>
              <Ionicons 
                name={showFeedback === 'correct' ? 'checkmark-circle' : 'close-circle'} 
                size={40} 
                color={showFeedback === 'correct' ? COLORS.success : COLORS.error} 
              />
              <Text style={[
                styles.feedbackText,
                { color: showFeedback === 'correct' ? COLORS.success : COLORS.error }
              ]}>
                {showFeedback === 'correct' ? 'Correct!' : `It's a ${currentWord.part_of_speech}`}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Sort Buckets */}
      <View style={styles.bucketsContainer}>
        {(['noun', 'verb', 'adjective'] as const).map((pos) => (
          <TouchableOpacity
            key={pos}
            style={[
              styles.bucket,
              { borderColor: POS_COLORS[pos] },
              showFeedback && currentWord?.part_of_speech === pos && styles.bucketHighlight,
            ]}
            onPress={() => handleSort(pos)}
            disabled={!!showFeedback || gameComplete}
          >
            <Ionicons name={POS_ICONS[pos]} size={28} color={POS_COLORS[pos]} />
            <Text style={[styles.bucketLabel, { color: POS_COLORS[pos] }]}>{pos}</Text>
            <Text style={styles.bucketCount}>{sorted[pos].length}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sorted Words Preview */}
      <View style={styles.sortedPreview}>
        {(['noun', 'verb', 'adjective'] as const).map((pos) => (
          <View key={pos} style={styles.sortedColumn}>
            <View style={[styles.sortedHeader, { backgroundColor: POS_COLORS[pos] }]}>
              <Text style={styles.sortedHeaderText}>{pos}s</Text>
            </View>
            <View style={styles.sortedWords}>
              {sorted[pos].map((word, index) => (
                <Text key={index} style={styles.sortedWord}>{word}</Text>
              ))}
            </View>
          </View>
        ))}
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
    backgroundColor: '#FDF4FF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF4FF',
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
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    marginHorizontal: SPACING.md,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: SPACING.sm,
  },
  streakText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: '#F59E0B',
  },
  wordCard: {
    backgroundColor: 'white',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  wordCardCorrect: {
    borderColor: COLORS.success,
    backgroundColor: '#F0FDF4',
  },
  wordCardWrong: {
    borderColor: COLORS.error,
    backgroundColor: '#FEF2F2',
  },
  wordEmoji: {
    fontSize: 50,
  },
  wordText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  wordHint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  feedback: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginTop: 4,
  },
  bucketsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  bucket: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 16,
    borderWidth: 3,
    minWidth: 90,
  },
  bucketHighlight: {
    transform: [{ scale: 1.05 }],
  },
  bucketLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  bucketCount: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  sortedPreview: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  sortedColumn: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sortedHeader: {
    paddingVertical: SPACING.xs,
    alignItems: 'center',
  },
  sortedHeaderText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  sortedWords: {
    padding: SPACING.xs,
    minHeight: 40,
  },
  sortedWord: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text,
    textAlign: 'center',
  },
  completeButton: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
});

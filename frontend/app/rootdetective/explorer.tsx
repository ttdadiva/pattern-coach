import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import axios from 'axios';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components';
import { COLORS, SPACING, FONTS } from '../../src/theme';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

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
  color: string;
  words: Word[];
}

const PART_COLORS = {
  root: '#10B981',
  prefix: '#3B82F6',
  suffix: '#F59E0B',
};

export default function WordExplorer() {
  const router = useRouter();
  const { root: rootParam } = useLocalSearchParams<{ root?: string }>();
  const { token, refreshUser } = useAuth();
  const [roots, setRoots] = useState<Root[]>([]);
  const [currentRootIndex, setCurrentRootIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    fetchRoots();
  }, [token]);

  useEffect(() => {
    if (rootParam && roots.length > 0) {
      const index = roots.findIndex(r => r.id === rootParam);
      if (index >= 0) setCurrentRootIndex(index);
    }
  }, [rootParam, roots]);

  const fetchRoots = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/roots`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoots(response.data.roots);
    } catch (error) {
      console.error('Error fetching roots:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentRoot = roots[currentRootIndex];
  const currentWord = currentRoot?.words[currentWordIndex];

  const speakWord = async () => {
    if (!currentWord || speaking) return;
    
    setSpeaking(true);
    try {
      await Speech.speak(currentWord.word, {
        language: 'en-US',
        rate: 0.8,
        pitch: 1.1,
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    } catch (error) {
      setSpeaking(false);
    }
  };

  const speakSentence = async () => {
    if (!currentWord || speaking) return;
    
    setSpeaking(true);
    try {
      await Speech.speak(currentWord.sentence, {
        language: 'en-US',
        rate: 0.75,
        pitch: 1.0,
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    } catch (error) {
      setSpeaking(false);
    }
  };

  const nextWord = () => {
    if (currentWordIndex < currentRoot.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else if (currentRootIndex < roots.length - 1) {
      setCurrentRootIndex(currentRootIndex + 1);
      setCurrentWordIndex(0);
    }
  };

  const prevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    } else if (currentRootIndex > 0) {
      setCurrentRootIndex(currentRootIndex - 1);
      setCurrentWordIndex(roots[currentRootIndex - 1].words.length - 1);
    }
  };

  const markLearned = async () => {
    if (!token || !currentWord || !currentRoot) return;
    
    try {
      await axios.post(
        `${API_URL}/api/roots/progress`,
        {
          root_id: currentRoot.id,
          word: currentWord.word,
          game_type: 'explorer',
          score: 10
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshUser();
      Alert.alert('🎉 Great Job!', `You learned "${currentWord.word}"! +5 stars`, [
        { text: 'Next Word', onPress: nextWord }
      ]);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const getPartOfSpeechColor = (pos: string) => {
    switch (pos) {
      case 'noun': return '#EC4899';
      case 'verb': return '#8B5CF6';
      case 'adjective': return '#F59E0B';
      default: return COLORS.textLight;
    }
  };

  const getPartOfSpeechIcon = (pos: string): keyof typeof Ionicons.glyphMap => {
    switch (pos) {
      case 'noun': return 'cube';
      case 'verb': return 'flash';
      case 'adjective': return 'color-palette';
      default: return 'help-circle';
    }
  };

  if (loading || !currentRoot || !currentWord) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading words...</Text>
      </View>
    );
  }

  const totalWords = roots.reduce((acc, r) => acc + r.words.length, 0);
  const currentPosition = roots.slice(0, currentRootIndex).reduce((acc, r) => acc + r.words.length, 0) + currentWordIndex + 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Word Explorer</Text>
        <Text style={styles.progress}>{currentPosition}/{totalWords}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Root Badge */}
        <View style={styles.rootSection}>
          <Text style={styles.rootLabel}>Root Family:</Text>
          <View style={[styles.rootBadge, { backgroundColor: currentRoot.color }]}>
            <Text style={styles.rootText}>{currentRoot.root}</Text>
          </View>
          <Text style={styles.rootMeaning}>= "{currentRoot.meaning}"</Text>
        </View>

        {/* Word Card */}
        <View style={styles.wordCard}>
          {/* Emoji */}
          <Text style={styles.wordEmoji}>{currentWord.emoji}</Text>

          {/* Word Parts (Puzzle Pieces) */}
          <View style={styles.puzzleContainer}>
            {currentWord.parts.map((part, index) => (
              <View
                key={index}
                style={[
                  styles.puzzlePiece,
                  { backgroundColor: PART_COLORS[part.type] },
                  index > 0 && styles.puzzlePieceConnected,
                ]}
              >
                <Text style={styles.puzzleText}>{part.text}</Text>
                <Text style={styles.puzzleType}>{part.type}</Text>
              </View>
            ))}
          </View>

          {/* Tap to hear */}
          <TouchableOpacity 
            style={styles.speakButton}
            onPress={speakWord}
            disabled={speaking}
          >
            <Ionicons 
              name={speaking ? "volume-high" : "volume-medium"} 
              size={28} 
              color={COLORS.primary} 
            />
            <Text style={styles.speakText}>Tap to hear</Text>
          </TouchableOpacity>

          {/* Part of Speech */}
          <View style={[styles.posTag, { backgroundColor: getPartOfSpeechColor(currentWord.part_of_speech) }]}>
            <Ionicons name={getPartOfSpeechIcon(currentWord.part_of_speech)} size={16} color="white" />
            <Text style={styles.posText}>{currentWord.part_of_speech}</Text>
          </View>

          {/* Definition */}
          <View style={styles.definitionBox}>
            <Text style={styles.definitionLabel}>What it means:</Text>
            <Text style={styles.definitionText}>{currentWord.definition}</Text>
          </View>

          {/* Sentence */}
          <TouchableOpacity style={styles.sentenceBox} onPress={speakSentence}>
            <View style={styles.sentenceHeader}>
              <Text style={styles.sentenceLabel}>In a sentence:</Text>
              <Ionicons name="volume-medium" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.sentenceText}>"{currentWord.sentence}"</Text>
          </TouchableOpacity>
        </View>

        {/* I Learned It Button */}
        <Button
          title="I Learned It! ⭐"
          onPress={markLearned}
          size="large"
          style={styles.learnedButton}
        />

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity 
            style={[styles.navButton, currentPosition === 1 && styles.navButtonDisabled]}
            onPress={prevWord}
            disabled={currentPosition === 1}
          >
            <Ionicons name="chevron-back" size={24} color={currentPosition === 1 ? COLORS.textLight : COLORS.primary} />
            <Text style={[styles.navText, currentPosition === 1 && styles.navTextDisabled]}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, currentPosition === totalWords && styles.navButtonDisabled]}
            onPress={nextWord}
            disabled={currentPosition === totalWords}
          >
            <Text style={[styles.navText, currentPosition === totalWords && styles.navTextDisabled]}>Next</Text>
            <Ionicons name="chevron-forward" size={24} color={currentPosition === totalWords ? COLORS.textLight : COLORS.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF3C7',
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
  progress: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    backgroundColor: 'white',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  rootSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  rootLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
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
  },
  wordCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  wordEmoji: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  puzzleContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  puzzlePiece: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  puzzlePieceConnected: {
    marginLeft: -8,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  puzzleText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: 'white',
  },
  puzzleType: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginBottom: SPACING.md,
  },
  speakText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '500',
  },
  posTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    marginBottom: SPACING.md,
  },
  posText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: 'white',
  },
  definitionBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: SPACING.md,
    width: '100%',
    marginBottom: SPACING.md,
  },
  definitionLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  definitionText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  sentenceBox: {
    backgroundColor: '#EBF5FF',
    borderRadius: 12,
    padding: SPACING.md,
    width: '100%',
  },
  sentenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sentenceLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
  },
  sentenceText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  learnedButton: {
    marginBottom: SPACING.md,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: SPACING.sm,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '500',
  },
  navTextDisabled: {
    color: COLORS.textLight,
  },
});

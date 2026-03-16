import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../src/context/AuthContext';
import { Button } from '../src/components';
import { COLORS, SPACING, FONTS } from '../src/theme';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://root-detective.preview.emergentagent.com';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOARD_PADDING = 8;
const TILE_GAP = 3;
const TILES_PER_ROW = 4;
// Make tiles smaller to fit all 4 in a row
const AVAILABLE_WIDTH = Math.min(SCREEN_WIDTH, 400) - (BOARD_PADDING * 2);
const TILE_SIZE = (AVAILABLE_WIDTH - (TILE_GAP * (TILES_PER_ROW + 1))) / TILES_PER_ROW;

interface BoardTile {
  id: string;
  type: 'corner' | 'mission';
  position: number;
  name: string;
  emoji: string;
  color: string;
  world?: string;
  difficulty?: string;
  stars_reward?: number;
  completed?: boolean;
  stars_earned?: number;
  unlocked?: boolean;
  lock_reason?: string;
}

export default function GameBoard() {
  const router = useRouter();
  const { token, refreshUser } = useAuth();
  const [tiles, setTiles] = useState<BoardTile[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 12 });
  const [isPremium, setIsPremium] = useState(false);
  const [childName, setChildName] = useState('Explorer');
  const [loading, setLoading] = useState(true);
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchBoardData();
  }, [token]);

  const fetchBoardData = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/adventure/board`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTiles(response.data.tiles);
      setProgress(response.data.progress);
      setIsPremium(response.data.is_premium);
      setChildName(response.data.child_name);
    } catch (error) {
      console.error('Error fetching board:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTilePress = (tile: BoardTile) => {
    if (tile.type === 'corner') {
      switch (tile.id) {
        case 'camera':
          router.push('/(tabs)/camera');
          break;
        case 'journal':
          router.push('/(tabs)/journal');
          break;
        case 'avatar':
          router.push('/avatar');
          break;
        case 'start':
          Alert.alert('🚀 Welcome!', 'This is where your pattern adventure begins! Tap on missions to play.');
          break;
        case 'challenge':
          Alert.alert('⭐ Daily Challenge!', 'Coming soon! Complete daily challenges for bonus stars.');
          break;
      }
    } else {
      if (!tile.unlocked) {
        if (tile.lock_reason === 'premium') {
          Alert.alert(
            '👑 Premium Required',
            'Upgrade to Premium to unlock all worlds and missions!',
            [
              { text: 'Maybe Later', style: 'cancel' },
              { text: 'Upgrade', onPress: () => router.push('/subscription') }
            ]
          );
        } else {
          Alert.alert(
            '🔒 Locked',
            'Complete the easier missions in this world first!',
            [{ text: 'OK' }]
          );
        }
      } else {
        setSelectedTile(tile);
      }
    }
  };

  const handlePlayMission = async () => {
    if (!selectedTile || !token) return;
    
    setCompleting(true);
    try {
      const stars = Math.floor(Math.random() * 3) + 1;
      const score = Math.floor(Math.random() * 100) + 50;
      
      await axios.post(
        `${API_URL}/api/adventure/board/complete`,
        { mission_id: selectedTile.id, score, stars },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await refreshUser();
      await fetchBoardData();
      setSelectedTile(null);
      
      Alert.alert(
        '🎉 Mission Complete!',
        `You earned ${stars} star${stars > 1 ? 's' : ''}!`,
        [{ text: 'Awesome!' }]
      );
    } catch (error) {
      console.error('Error completing mission:', error);
      Alert.alert('Error', 'Could not complete mission');
    } finally {
      setCompleting(false);
    }
  };

  const renderTile = (tile: BoardTile) => {
    const isCompleted = tile.completed;
    const isLocked = !tile.unlocked;
    
    return (
      <TouchableOpacity
        key={tile.id}
        style={[
          styles.tile,
          { backgroundColor: tile.color },
          isLocked && styles.lockedTile,
        ]}
        onPress={() => handleTilePress(tile)}
        activeOpacity={0.8}
      >
        {isCompleted && (
          <View style={styles.completionBadge}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
          </View>
        )}
        
        {isLocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={16} color="white" />
          </View>
        )}
        
        <Text style={styles.tileEmoji}>{tile.emoji}</Text>
        <Text style={styles.tileName} numberOfLines={1}>{tile.name}</Text>
        
        {tile.type === 'mission' && !isLocked && (
          <View style={styles.starsRow}>
            {[1, 2, 3].map((star) => (
              <Ionicons
                key={star}
                name={star <= (tile.stars_earned || 0) ? 'star' : 'star-outline'}
                size={8}
                color={star <= (tile.stars_earned || 0) ? '#FBBF24' : 'rgba(255,255,255,0.5)'}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Build the board layout
  const getTile = (pos: number) => tiles.find(t => t.position === pos);
  
  // Positions for Monopoly-style board:
  // Top row: 0, 1, 2, 3 (left to right)
  // Right col: 4, 5, 6, 7 (top to bottom)
  // Bottom row: 8, 9, 10, 11 (left to right, but we go backwards from position 11)
  // Left col: 12, 13, 14, 15 (bottom to top)

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading game board...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.progressBadge}>
          <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
          <Text style={styles.progressText}>{progress.completed}/{progress.total} Done</Text>
        </View>
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pattern Adventure 🎲</Text>
        <Text style={styles.subtitle}>{childName}'s Journey</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Game Board */}
        <View style={styles.boardWrapper}>
          {/* Top Row: positions 0, 1, 2, 3 */}
          <View style={styles.boardRow}>
            {[0, 1, 2, 3].map(pos => {
              const tile = getTile(pos);
              return tile ? renderTile(tile) : <View key={pos} style={styles.emptyTile} />;
            })}
          </View>
          
          {/* Middle Section */}
          <View style={styles.middleSection}>
            {/* Left Column: positions 15, 14, 13, 12 (top to bottom) */}
            <View style={styles.sideColumn}>
              {[15, 14, 13, 12].map(pos => {
                const tile = getTile(pos);
                return tile ? renderTile(tile) : <View key={pos} style={styles.emptyTile} />;
              })}
            </View>
            
            {/* Center Area */}
            <View style={styles.centerArea}>
              <Text style={styles.centerEmoji}>🧩</Text>
              <Text style={styles.centerTitle}>Pattern</Text>
              <Text style={styles.centerTitle}>Coach</Text>
              <Text style={styles.centerTagline}>Learn through play!</Text>
            </View>
            
            {/* Right Column: positions 4, 5, 6, 7 (top to bottom) */}
            <View style={styles.sideColumn}>
              {[4, 5, 6, 7].map(pos => {
                const tile = getTile(pos);
                return tile ? renderTile(tile) : <View key={pos} style={styles.emptyTile} />;
              })}
            </View>
          </View>
          
          {/* Bottom Row: positions 11, 10, 9, 8 (left to right) */}
          <View style={styles.boardRow}>
            {[11, 10, 9, 8].map(pos => {
              const tile = getTile(pos);
              return tile ? renderTile(tile) : <View key={pos} style={styles.emptyTile} />;
            })}
          </View>
        </View>
        
        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>How to Play:</Text>
          <View style={styles.legendItem}>
            <Text style={styles.legendText}>🟢 Free missions - Start here!</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendText}>👑 Premium - Unlock all worlds!</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendText}>⭐ Earn stars by completing!</Text>
          </View>
        </View>
        
        {/* Premium Banner */}
        {!isPremium && (
          <TouchableOpacity 
            style={styles.premiumBanner}
            onPress={() => router.push('/subscription')}
          >
            <View style={styles.premiumContent}>
              <Text style={styles.premiumEmoji}>🚀</Text>
              <View>
                <Text style={styles.premiumTitle}>Unlock All Missions!</Text>
                <Text style={styles.premiumSubtitle}>Get access to 50+ adventures</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Mission Modal */}
      <Modal
        visible={selectedTile !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedTile(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTile && (
              <>
                <View style={[styles.modalHeader, { backgroundColor: selectedTile.color }]}>
                  <Text style={styles.modalEmoji}>{selectedTile.emoji}</Text>
                  <Text style={styles.modalTitle}>{selectedTile.name}</Text>
                  {selectedTile.world && (
                    <Text style={styles.modalWorld}>{selectedTile.world} world</Text>
                  )}
                </View>
                
                <View style={styles.modalBody}>
                  <View style={styles.modalInfo}>
                    <View style={styles.infoItem}>
                      <Ionicons name="star" size={24} color={COLORS.accent} />
                      <Text style={styles.infoText}>+{selectedTile.stars_reward || 10} stars</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="fitness" size={24} color={COLORS.secondary} />
                      <Text style={styles.infoText}>{selectedTile.difficulty || 'easy'}</Text>
                    </View>
                  </View>
                  
                  {selectedTile.completed && (
                    <View style={styles.completedInfo}>
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                      <Text style={styles.completedText}>
                        Completed! Best: {selectedTile.stars_earned || 0} stars
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.modalActions}>
                    <Button
                      title="Close"
                      onPress={() => setSelectedTile(null)}
                      variant="outline"
                      style={styles.modalButton}
                    />
                    <Button
                      title={selectedTile.completed ? "Play Again" : "Play!"}
                      onPress={handlePlayMission}
                      loading={completing}
                      style={styles.modalButton}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312E81',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#312E81',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: 'white',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  progressText: {
    color: 'white',
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  boardWrapper: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: TILE_GAP,
    marginHorizontal: BOARD_PADDING,
  },
  boardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  middleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sideColumn: {
    width: TILE_SIZE + TILE_GAP * 2,
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    margin: TILE_GAP,
    borderRadius: 12,
    paddingVertical: SPACING.md,
  },
  centerEmoji: {
    fontSize: 32,
  },
  centerTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: 'white',
    lineHeight: 20,
  },
  centerTagline: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 10,
    margin: TILE_GAP,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emptyTile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: TILE_GAP,
  },
  lockedTile: {
    opacity: 0.5,
  },
  completionBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 1,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  tileEmoji: {
    fontSize: 20,
  },
  tileName: {
    color: 'white',
    fontSize: 8,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 2,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 1,
  },
  legend: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: SPACING.md,
    marginHorizontal: BOARD_PADDING,
    marginTop: SPACING.md,
  },
  legendTitle: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  legendItem: {
    marginVertical: 2,
  },
  legendText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONTS.sizes.xs,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#A855F7',
    borderRadius: 12,
    padding: SPACING.md,
    marginHorizontal: BOARD_PADDING,
    marginTop: SPACING.md,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  premiumEmoji: {
    fontSize: 28,
  },
  premiumTitle: {
    color: 'white',
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
  },
  premiumSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONTS.sizes.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  modalEmoji: {
    fontSize: 56,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: 'white',
    marginTop: SPACING.sm,
  },
  modalWorld: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  modalBody: {
    padding: SPACING.lg,
  },
  modalInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  infoItem: {
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  completedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: '#F0FDF4',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  completedText: {
    color: COLORS.success,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
  },
});

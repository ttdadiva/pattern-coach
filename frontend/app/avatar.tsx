import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { Avatar, Button, Honeybee } from '../src/components';
import { COLORS, SPACING, FONTS, SHADOWS } from '../src/theme';

const SKIN_COLORS = [
  '#FFD4B8', '#F5C6A5', '#E5B898', '#D4A574', 
  '#C69C6D', '#A67C52', '#8D5524', '#6B3E26'
];

const HAIR_STYLES = [
  { id: 'curly', label: 'Curly' },
  { id: 'straight', label: 'Straight' },
  { id: 'spiky', label: 'Spiky' },
  { id: 'ponytail', label: 'Ponytail' },
];

const HAIR_COLORS = [
  '#4A2C2A', '#1A1A1A', '#8B4513', '#D4A574',
  '#FF6B6B', '#4ECDC4', '#9B59B6', '#3498DB'
];

const OUTFITS = [
  { id: 'explorer', label: 'Explorer', color: COLORS.primary },
  { id: 'scientist', label: 'Scientist', color: COLORS.info },
  { id: 'artist', label: 'Artist', color: COLORS.secondary },
  { id: 'athlete', label: 'Athlete', color: COLORS.warning },
];

const ACCESSORIES = [
  { id: 'none', label: 'None' },
  { id: 'glasses', label: 'Glasses' },
  { id: 'hat', label: 'Hat' },
  { id: 'bow', label: 'Bow' },
];

export default function AvatarCreator() {
  const router = useRouter();
  const { user, updateAvatar } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [avatar, setAvatar] = useState({
    skin_color: user?.avatar?.skin_color || '#FFD4B8',
    hair_style: user?.avatar?.hair_style || 'curly',
    hair_color: user?.avatar?.hair_color || '#4A2C2A',
    outfit: user?.avatar?.outfit || 'explorer',
    accessory: user?.avatar?.accessory || 'none',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateAvatar(avatar);
      Alert.alert('Success!', 'Your avatar has been updated!', [
        { text: 'Great!', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Could not save avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Your Avatar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Preview */}
        <View style={styles.previewSection}>
          <View style={styles.avatarPreview}>
            <Avatar size={150} avatar={avatar} />
          </View>
          <View style={styles.mascotBubble}>
            <Honeybee size={50} expression="excited" />
            <Text style={styles.bubbleText}>Looking great!</Text>
          </View>
        </View>

        {/* Skin Color */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skin Color</Text>
          <View style={styles.colorGrid}>
            {SKIN_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  avatar.skin_color === color && styles.colorSelected,
                ]}
                onPress={() => setAvatar({ ...avatar, skin_color: color })}
              >
                {avatar.skin_color === color && (
                  <Ionicons name="checkmark" size={20} color={COLORS.textWhite} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Hair Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hair Style</Text>
          <View style={styles.optionsRow}>
            {HAIR_STYLES.map((style) => (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.optionButton,
                  avatar.hair_style === style.id && styles.optionSelected,
                ]}
                onPress={() => setAvatar({ ...avatar, hair_style: style.id })}
              >
                <Text style={[
                  styles.optionText,
                  avatar.hair_style === style.id && styles.optionTextSelected,
                ]}>
                  {style.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Hair Color */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hair Color</Text>
          <View style={styles.colorGrid}>
            {HAIR_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  avatar.hair_color === color && styles.colorSelected,
                ]}
                onPress={() => setAvatar({ ...avatar, hair_color: color })}
              >
                {avatar.hair_color === color && (
                  <Ionicons name="checkmark" size={20} color={COLORS.textWhite} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Outfit */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outfit</Text>
          <View style={styles.optionsGrid}>
            {OUTFITS.map((outfit) => (
              <TouchableOpacity
                key={outfit.id}
                style={[
                  styles.outfitOption,
                  { borderColor: outfit.color },
                  avatar.outfit === outfit.id && { backgroundColor: outfit.color },
                ]}
                onPress={() => setAvatar({ ...avatar, outfit: outfit.id })}
              >
                <Ionicons 
                  name="shirt-outline" 
                  size={24} 
                  color={avatar.outfit === outfit.id ? COLORS.textWhite : outfit.color} 
                />
                <Text style={[
                  styles.outfitText,
                  { color: avatar.outfit === outfit.id ? COLORS.textWhite : outfit.color },
                ]}>
                  {outfit.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Accessories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessory</Text>
          <View style={styles.optionsRow}>
            {ACCESSORIES.map((acc) => (
              <TouchableOpacity
                key={acc.id}
                style={[
                  styles.optionButton,
                  avatar.accessory === acc.id && styles.optionSelected,
                ]}
                onPress={() => setAvatar({ ...avatar, accessory: acc.id })}
              >
                <Text style={[
                  styles.optionText,
                  avatar.accessory === acc.id && styles.optionTextSelected,
                ]}>
                  {acc.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <Button
          title="Save Avatar"
          onPress={handleSave}
          loading={loading}
          size="large"
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  previewSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    position: 'relative',
  },
  avatarPreview: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 100,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  mascotBubble: {
    position: 'absolute',
    right: 20,
    top: 20,
    alignItems: 'center',
  },
  bubbleText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: COLORS.text,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  optionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.textWhite,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  outfitOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    gap: SPACING.sm,
  },
  outfitText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: SPACING.lg,
  },
});

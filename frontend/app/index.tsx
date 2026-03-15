import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/context/AuthContext';
import { Honeybee, Button } from '../src/components';
import { COLORS, SPACING, FONTS } from '../src/theme';

const { width } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Honeybee size={120} expression="happy" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.mascotContainer}>
            <Honeybee size={140} expression="excited" />
          </View>
          <Text style={styles.title}>Pattern Coach</Text>
          <Text style={styles.subtitle}>Learn patterns through play!</Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🔍</Text>
            <Text style={styles.featureText}>Find patterns everywhere</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📸</Text>
            <Text style={styles.featureText}>Use the camera to discover</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🌟</Text>
            <Text style={styles.featureText}>Earn stars and badges</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🗺️</Text>
            <Text style={styles.featureText}>Explore 5 fun worlds</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <Button
            title="Get Started"
            onPress={() => router.push('/(auth)/signup')}
            variant="primary"
            size="large"
            style={styles.button}
          />
          <Button
            title="I already have an account"
            onPress={() => router.push('/(auth)/login')}
            variant="ghost"
            size="medium"
          />
        </View>

        {/* Trial Info */}
        <View style={styles.trialInfo}>
          <Text style={styles.trialText}>✨ 7-day free trial included</Text>
        </View>
      </View>
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
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  mascotContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  features: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  buttons: {
    gap: SPACING.md,
  },
  button: {
    width: '100%',
  },
  trialInfo: {
    alignItems: 'center',
  },
  trialText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.secondary,
    fontWeight: '600',
  },
});

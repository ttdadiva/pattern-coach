import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/context/AuthContext';
import { Honeybee, Button } from '../src/components';
import { COLORS, SPACING, FONTS } from '../src/theme';

const { width } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();
  const { user, token, loading } = useAuth();

  useEffect(() => {
    // Only redirect if we have BOTH user AND token (not logged out)
    if (!loading && user && token) {
      router.replace('/(tabs)');
    }
  }, [user, token, loading]);

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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.mascotContainer}>
              <Honeybee size={120} expression="excited" />
            </View>
            <Text style={styles.title}>Pattern Coach</Text>
            <Text style={styles.subtitle}>Building Critical Thinkers</Text>
          </View>

          {/* Educational Benefits Section */}
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Why Learn Patterns Early?</Text>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>🧠</Text>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Develops Critical Thinking</Text>
                <Text style={styles.benefitDesc}>Pattern recognition is the foundation of logical reasoning - a skill often missing in traditional education</Text>
              </View>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>🔬</Text>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>STEM Foundation</Text>
                <Text style={styles.benefitDesc}>Early pattern skills predict success in math, science, and coding</Text>
              </View>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>📚</Text>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Reading & Language</Text>
                <Text style={styles.benefitDesc}>Recognizing word patterns accelerates reading comprehension</Text>
              </View>
            </View>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <Text style={styles.sectionTitle}>What Kids Will Do</Text>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>📸</Text>
              <Text style={styles.featureText}>Discover patterns with AI camera</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🎮</Text>
              <Text style={styles.featureText}>Play Monopoly-style adventure</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>📖</Text>
              <Text style={styles.featureText}>Learn word roots & vocabulary</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🏆</Text>
              <Text style={styles.featureText}>Earn badges across 5 worlds</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Button
              title="Start Free Trial"
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
            <Text style={styles.trialText}>✨ 7-day free trial • No credit card required</Text>
            <Text style={styles.trialSubtext}>Join 10,000+ families building critical thinkers</Text>
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
  scrollContent: {
    flexGrow: 1,
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
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
  },
  mascotContainer: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
  benefitsSection: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  benefitEmoji: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  benefitDesc: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  features: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  featureEmoji: {
    fontSize: 22,
  },
  featureText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  buttons: {
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  button: {
    width: '100%',
  },
  trialInfo: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  trialText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  trialSubtext: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginTop: 4,
  },
});

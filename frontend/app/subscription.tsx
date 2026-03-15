import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { Honeybee, Button } from '../src/components';
import { COLORS, SPACING, FONTS, SHADOWS } from '../src/theme';

export default function Subscription() {
  const router = useRouter();
  const { user } = useAuth();

  const features = [
    { icon: 'infinite', text: 'Unlimited pattern recognition' },
    { icon: 'planet', text: 'Access to all 5 worlds' },
    { icon: 'ribbon', text: 'Exclusive badges and rewards' },
    { icon: 'people', text: 'Multiple child profiles' },
    { icon: 'cloud-done', text: 'Cloud progress sync' },
    { icon: 'sparkles', text: 'New content every month' },
  ];

  const handleSubscribe = () => {
    // In production, this would integrate with Stripe
    alert('Subscription integration with Stripe would go here!');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.hero}>
          <Honeybee size={100} expression="excited" />
          <Text style={styles.title}>Unlock Full Access!</Text>
          <Text style={styles.subtitle}>
            Get unlimited pattern adventures for your little explorer
          </Text>
        </View>

        {/* Current Status */}
        {user?.subscription_status === 'trial' && (
          <View style={styles.trialBanner}>
            <Ionicons name="time" size={24} color={COLORS.info} />
            <View style={styles.trialInfo}>
              <Text style={styles.trialTitle}>Free Trial Active</Text>
              <Text style={styles.trialText}>
                Subscribe now to keep learning when your trial ends!
              </Text>
            </View>
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Premium Includes:</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name={feature.icon as any} size={24} color={COLORS.primary} />
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View style={styles.pricingSection}>
          {/* Monthly */}
          <TouchableOpacity style={styles.pricingCard}>
            <View style={styles.pricingHeader}>
              <Text style={styles.planName}>Monthly</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceAmount}>$4.99</Text>
                <Text style={styles.pricePeriod}>/month</Text>
              </View>
            </View>
            <Text style={styles.pricingDesc}>Flexible monthly plan</Text>
          </TouchableOpacity>

          {/* Yearly */}
          <TouchableOpacity style={[styles.pricingCard, styles.pricingCardFeatured]}>
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>SAVE 40%</Text>
            </View>
            <View style={styles.pricingHeader}>
              <Text style={[styles.planName, { color: COLORS.textWhite }]}>Yearly</Text>
              <View style={styles.priceContainer}>
                <Text style={[styles.priceAmount, { color: COLORS.textWhite }]}>$2.99</Text>
                <Text style={[styles.pricePeriod, { color: 'rgba(255,255,255,0.8)' }]}>/month</Text>
              </View>
            </View>
            <Text style={[styles.pricingDesc, { color: 'rgba(255,255,255,0.8)' }]}>
              Billed $35.99/year
            </Text>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <Button
          title="Start Premium"
          onPress={handleSubscribe}
          size="large"
          style={styles.ctaButton}
        />

        {/* Terms */}
        <Text style={styles.terms}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Cancel anytime from your account settings.
        </Text>
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
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  trialBanner: {
    flexDirection: 'row',
    backgroundColor: '#EBF5FF',
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.md,
  },
  trialInfo: {
    flex: 1,
  },
  trialTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.info,
  },
  trialText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  featuresCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  featuresTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  featureText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  pricingSection: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  pricingCardFeatured: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    position: 'relative',
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 10,
  },
  saveBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.text,
  },
  pricingHeader: {
    marginBottom: SPACING.xs,
  },
  planName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceAmount: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  pricePeriod: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
  },
  pricingDesc: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
  },
  ctaButton: {
    marginBottom: SPACING.md,
  },
  terms: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { Honeybee, Button } from '../src/components';
import { COLORS, SPACING, FONTS, SHADOWS } from '../src/theme';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function Subscription() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, token, refreshUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | null>(null);

  // Check for payment status from URL params (after returning from Stripe)
  useEffect(() => {
    const sessionId = params.session_id;
    const status = params.status;

    if (status === 'success' && sessionId) {
      checkPaymentStatus(sessionId as string);
    } else if (status === 'cancelled') {
      setPaymentStatus('cancelled');
    }
  }, [params]);

  const checkPaymentStatus = async (sessionId: string) => {
    setCheckingPayment(true);
    try {
      // Poll for payment status
      let attempts = 0;
      const maxAttempts = 5;
      
      while (attempts < maxAttempts) {
        const response = await fetch(`${API_URL}/api/subscription/status/${sessionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.payment_status === 'paid') {
          setPaymentStatus('success');
          // Refresh user data to get updated subscription status
          if (refreshUser) {
            await refreshUser();
          }
          break;
        } else if (data.status === 'expired') {
          setPaymentStatus('cancelled');
          break;
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setCheckingPayment(false);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const originUrl = Platform.OS === 'web' 
        ? window.location.origin 
        : API_URL;

      const response = await fetch(`${API_URL}/api/subscription/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: selectedPlan,
          origin_url: originUrl
        })
      });

      const data = await response.json();

      if (data.checkout_url) {
        // Open Stripe checkout
        if (Platform.OS === 'web') {
          window.location.href = data.checkout_url;
        } else {
          await Linking.openURL(data.checkout_url);
        }
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: 'infinite', text: 'Unlimited pattern recognition' },
    { icon: 'planet', text: 'Access to all 5 worlds' },
    { icon: 'book', text: '175+ vocabulary words' },
    { icon: 'ribbon', text: 'Exclusive badges and rewards' },
    { icon: 'notifications', text: 'Daily learning reminders' },
    { icon: 'sparkles', text: 'New content every month' },
  ];

  // Payment success screen
  if (paymentStatus === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
          </View>
          <Honeybee size={120} expression="excited" />
          <Text style={styles.successTitle}>Welcome to Premium!</Text>
          <Text style={styles.successText}>
            Your subscription is now active. Enjoy unlimited access to all features!
          </Text>
          <Button
            title="Start Exploring"
            onPress={() => router.replace('/(tabs)/home')}
            size="large"
            style={{ marginTop: SPACING.xl }}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Checking payment status
  if (checkingPayment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Verifying your payment...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cancelled banner */}
        {paymentStatus === 'cancelled' && (
          <View style={styles.cancelledBanner}>
            <Ionicons name="close-circle" size={24} color={COLORS.error} />
            <Text style={styles.cancelledText}>Payment was cancelled. Try again when you're ready!</Text>
          </View>
        )}

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

        {/* Already subscribed */}
        {user?.subscription_status === 'active' && (
          <View style={styles.activeBanner}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            <View style={styles.trialInfo}>
              <Text style={[styles.trialTitle, { color: COLORS.success }]}>Premium Active</Text>
              <Text style={styles.trialText}>
                You have full access to all features!
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
        {user?.subscription_status !== 'active' && (
          <>
            <View style={styles.pricingSection}>
              {/* Monthly */}
              <TouchableOpacity 
                style={[
                  styles.pricingCard,
                  selectedPlan === 'monthly' && styles.pricingCardSelected
                ]}
                onPress={() => setSelectedPlan('monthly')}
              >
                {selectedPlan === 'monthly' && (
                  <View style={styles.selectedCheck}>
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  </View>
                )}
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
              <TouchableOpacity 
                style={[
                  styles.pricingCard, 
                  styles.pricingCardFeatured,
                  selectedPlan === 'yearly' && styles.pricingCardFeaturedSelected
                ]}
                onPress={() => setSelectedPlan('yearly')}
              >
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>BEST VALUE</Text>
                </View>
                {selectedPlan === 'yearly' && (
                  <View style={[styles.selectedCheck, { top: 15, right: 10 }]}>
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.textWhite} />
                  </View>
                )}
                <View style={styles.pricingHeader}>
                  <Text style={[styles.planName, { color: COLORS.textWhite }]}>Yearly</Text>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.priceAmount, { color: COLORS.textWhite }]}>$39.99</Text>
                    <Text style={[styles.pricePeriod, { color: 'rgba(255,255,255,0.8)' }]}>/year</Text>
                  </View>
                </View>
                <Text style={[styles.pricingDesc, { color: 'rgba(255,255,255,0.8)' }]}>
                  Save 33% vs monthly
                </Text>
              </TouchableOpacity>
            </View>

            {/* CTA */}
            <Button
              title={loading ? "Processing..." : `Subscribe ${selectedPlan === 'yearly' ? '($39.99/year)' : '($4.99/month)'}`}
              onPress={handleSubscribe}
              size="large"
              style={styles.ctaButton}
              disabled={loading}
            />
          </>
        )}

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
  cancelledBanner: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  cancelledText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
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
  activeBanner: {
    flexDirection: 'row',
    backgroundColor: '#D1FAE5',
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
    position: 'relative',
    ...SHADOWS.small,
  },
  pricingCardSelected: {
    borderColor: COLORS.primary,
  },
  pricingCardFeatured: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pricingCardFeaturedSelected: {
    borderColor: COLORS.accent,
    borderWidth: 3,
  },
  selectedCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    left: 10,
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
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  successIcon: {
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  successText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },
});

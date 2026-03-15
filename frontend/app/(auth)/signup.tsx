import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { Honeybee, Button } from '../../src/components';
import { COLORS, SPACING, FONTS } from '../../src/theme';

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!childName) {
      newErrors.childName = "Child's name is required";
    }
    
    if (!childAge) {
      newErrors.childAge = "Child's age is required";
    } else {
      const age = parseInt(childAge);
      if (isNaN(age) || age < 3 || age > 8) {
        newErrors.childAge = 'Age must be between 3 and 8';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      await signup(email, password, childName, parseInt(childAge));
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Signup Failed',
        error.response?.data?.detail || 'Could not create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Honeybee size={80} expression="excited" />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your pattern adventure!</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Parent Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Parent Email</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="parent@example.com"
                  placeholderTextColor={COLORS.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor={COLORS.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={COLORS.textLight} 
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Child Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Child's Name</Text>
              <View style={[styles.inputWrapper, errors.childName && styles.inputError]}>
                <Ionicons name="person-outline" size={20} color={COLORS.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="What's your child's name?"
                  placeholderTextColor={COLORS.textLight}
                  value={childName}
                  onChangeText={setChildName}
                  autoCapitalize="words"
                />
              </View>
              {errors.childName && <Text style={styles.errorText}>{errors.childName}</Text>}
            </View>

            {/* Child Age */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Child's Age (3-8)</Text>
              <View style={[styles.inputWrapper, errors.childAge && styles.inputError]}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="Age in years"
                  placeholderTextColor={COLORS.textLight}
                  value={childAge}
                  onChangeText={setChildAge}
                  keyboardType="number-pad"
                  maxLength={1}
                />
              </View>
              {errors.childAge && <Text style={styles.errorText}>{errors.childAge}</Text>}
            </View>

            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              size="large"
              style={styles.submitButton}
            />

            {/* Trial Info */}
            <View style={styles.trialInfo}>
              <Ionicons name="gift-outline" size={20} color={COLORS.secondary} />
              <Text style={styles.trialText}>Includes 7-day free trial</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
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
    marginTop: SPACING.xs,
  },
  form: {
    gap: SPACING.md,
  },
  inputContainer: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: SPACING.sm,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  errorText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.error,
  },
  submitButton: {
    marginTop: SPACING.sm,
  },
  trialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  trialText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
  },
  footerLink: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

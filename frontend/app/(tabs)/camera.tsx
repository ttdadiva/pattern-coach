import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../../src/context/AuthContext';
import { Honeybee, Button } from '../../src/components';
import { COLORS, SPACING, FONTS, SHADOWS } from '../../src/theme';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://root-detective.preview.emergentagent.com';

export default function Camera() {
  const { token, refreshUser } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Honeybee size={120} expression="thinking" />
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionText}>
          We need your camera to help you find patterns in the real world!
        </Text>
        <Button
          title="Enable Camera"
          onPress={requestPermission}
          size="large"
          style={styles.permissionButton}
        />
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
        });
        if (photo?.base64) {
          setCapturedImage(photo.base64);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Could not take picture. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].base64) {
      setCapturedImage(result.assets[0].base64);
    }
  };

  const analyzePattern = async () => {
    if (!capturedImage || !token) return;

    setAnalyzing(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/analyze-pattern`,
        { image_base64: capturedImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setResult(response.data);
      setShowResult(true);
      await refreshUser();
    } catch (error: any) {
      console.error('Error analyzing pattern:', error);
      Alert.alert(
        'Analysis Failed',
        error.response?.data?.detail || 'Could not analyze the image. Please try again.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setResult(null);
    setShowResult(false);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      {capturedImage ? (
        // Preview captured image
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${capturedImage}` }}
            style={styles.preview}
            resizeMode="contain"
          />
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.actionButton} onPress={resetCamera}>
              <Ionicons name="close" size={28} color={COLORS.textWhite} />
              <Text style={styles.actionButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.analyzeButton]} 
              onPress={analyzePattern}
              disabled={analyzing}
            >
              {analyzing ? (
                <ActivityIndicator color={COLORS.textWhite} />
              ) : (
                <Ionicons name="search" size={28} color={COLORS.textWhite} />
              )}
              <Text style={styles.actionButtonText}>
                {analyzing ? 'Finding...' : 'Find Patterns'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Camera view
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          {/* Overlay */}
          <SafeAreaView style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <Text style={styles.cameraTitle}>Find a Pattern!</Text>
              <Text style={styles.cameraSubtitle}>
                Point your camera at something with patterns
              </Text>
            </View>

            {/* Viewfinder */}
            <View style={styles.viewfinder}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
                <Ionicons name="images" size={28} color={COLORS.textWhite} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
                <Ionicons name="camera-reverse" size={28} color={COLORS.textWhite} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </CameraView>
      )}

      {/* Result Modal */}
      <Modal
        visible={showResult}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowResult(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Honeybee size={80} expression="excited" />
                <Text style={styles.modalTitle}>
                  {result?.pattern_count > 0 ? 'Patterns Found!' : 'Keep Looking!'}
                </Text>
              </View>

              {result?.patterns_found && result.patterns_found.length > 0 && (
                <View style={styles.patternsFound}>
                  {result.patterns_found.map((pattern: string, index: number) => (
                    <View key={index} style={styles.patternBadge}>
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                      <Text style={styles.patternBadgeText}>{pattern}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Text style={styles.description}>{result?.description}</Text>

              <View style={styles.encouragementBox}>
                <Ionicons name="sparkles" size={24} color={COLORS.accent} />
                <Text style={styles.encouragement}>{result?.encouragement}</Text>
              </View>

              {result?.score && (
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>Pattern Score</Text>
                  <View style={styles.scoreStars}>
                    {[...Array(10)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < result.score ? 'star' : 'star-outline'}
                        size={24}
                        color={COLORS.accent}
                      />
                    ))}
                  </View>
                </View>
              )}

              <Button
                title="Find More Patterns!"
                onPress={() => {
                  setShowResult(false);
                  resetCamera();
                }}
                size="large"
                style={styles.modalButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  permissionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  permissionText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  permissionButton: {
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  cameraHeader: {
    alignItems: 'center',
    paddingTop: SPACING.md,
  },
  cameraTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.textWhite,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  cameraSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textWhite,
    marginTop: SPACING.xs,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  viewfinder: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.primary,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: SPACING.lg,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.textWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  actionButton: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  analyzeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  patternsFound: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    justifyContent: 'center',
  },
  patternBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    gap: SPACING.xs,
  },
  patternBadgeText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.success,
  },
  description: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  encouragementBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: SPACING.md,
    borderRadius: 16,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  encouragement: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  scoreLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  scoreStars: {
    flexDirection: 'row',
    gap: 4,
  },
  modalButton: {
    marginTop: SPACING.md,
  },
});

import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/signup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="avatar" options={{ presentation: 'modal' }} />
          <Stack.Screen name="world/[id]" />
          <Stack.Screen name="gameboard" />
          <Stack.Screen name="rootdetective" />
          <Stack.Screen name="camera" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="subscription" options={{ presentation: 'modal' }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

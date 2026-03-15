import { Stack } from 'expo-router';

export default function RootDetectiveLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="explorer" />
      <Stack.Screen name="match" />
      <Stack.Screen name="sort" />
    </Stack>
  );
}

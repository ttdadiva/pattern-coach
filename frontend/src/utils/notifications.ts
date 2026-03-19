import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(token: string): Promise<string | null> {
  // Check if we're on a physical device
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  try {
    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    // Get project ID from app config
    const projectId = Constants.expoConfig?.extra?.eas?.projectId 
      ?? Constants.easConfig?.projectId;

    if (!projectId) {
      console.log('Project ID not found');
      return null;
    }

    // Get the Expo push token
    const expoPushToken = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;

    console.log('Expo Push Token:', expoPushToken);

    // Register token with backend
    try {
      const response = await fetch(`${API_URL}/api/push/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          token: expoPushToken,
          device_type: Platform.OS,
          device_model: Device.modelName,
        }),
      });

      if (response.ok) {
        console.log('Push token registered with backend');
      } else {
        console.error('Failed to register push token with backend');
      }
    } catch (error) {
      console.error('Error registering push token:', error);
    }

    // Set up Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFC727',
      });
    }

    return expoPushToken;
  } catch (error) {
    console.error('Error setting up push notifications:', error);
    return null;
  }
}

export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
) {
  // Listener for notifications received while app is foregrounded
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification received:', notification);
      onNotificationReceived?.(notification);
    }
  );

  // Listener for when user interacts with notification
  const responseListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log('Notification response:', response);
      const data = response.notification.request.content.data;
      
      // Handle different notification types
      switch (data.notification_type) {
        case 'achievement':
          // Navigate to journal/badges
          console.log('Achievement notification tapped');
          break;
        case 'daily_reminder':
          // Navigate to home
          console.log('Daily reminder notification tapped');
          break;
        case 'streak_reminder':
          // Navigate to activity
          console.log('Streak reminder notification tapped');
          break;
        default:
          console.log('Unknown notification type:', data.notification_type);
      }
      
      onNotificationResponse?.(response);
    }
  );

  // Return cleanup function
  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
}

// Schedule a local notification (for testing)
export async function scheduleLocalNotification(
  title: string,
  body: string,
  seconds: number = 5
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: { seconds },
  });
}

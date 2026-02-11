import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, AccessibilityInfo, useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';

export default function Layout() {
  const [largeTextEnabled, setLargeTextEnabled] = useState(false);
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);
  const { fontScale } = useWindowDimensions();

  useEffect(() => {
    // Load accessibility preferences from storage (mock)
    AccessibilityInfo.isReduceMotionEnabled().then(reduceMotion => {
      if (reduceMotion) {
        setLargeTextEnabled(true);
      }
    });
  }, []);

  const getTextStyle = () => {
    const baseStyle = { fontWeight: 'bold' };
    if (largeTextEnabled) {
      return { ...baseStyle, fontSize: 24 * fontScale };
    }
    return baseStyle;
  };

  const getBackgroundColor = () => {
    return highContrastEnabled ? '#000000' : '#0f172a';
  };

  return (
    <View style={{ flex: 1, backgroundColor: getBackgroundColor() }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: highContrastEnabled ? '#000000' : '#1e293b',
          },
          headerTintColor: highContrastEnabled ? '#ffff00' : '#fff',
          headerTitleStyle: {
            ...getTextStyle(),
          },
          contentStyle: {
            backgroundColor: getBackgroundColor(),
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'ServiceGenie',
            headerLargeTitle: true,
          }} 
        />
        <Stack.Screen 
          name="book/[id]" 
          options={{ 
            title: 'Book Appointment',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="stylist/dashboard" 
          options={{ 
            title: 'Stylist Dashboard',
          }} 
        />
        <Stack.Screen 
          name="admin" 
          options={{ 
            title: 'Admin Dashboard',
            headerShown: false,
          }} 
        />
      </Stack>
      <StatusBar style={highContrastEnabled ? 'dark' : 'light'} />
    </View>
  );
}

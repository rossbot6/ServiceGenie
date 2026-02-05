import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1e293b',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#0f172a',
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
      </Stack>
      <StatusBar style="light" />
    </View>
  );
}

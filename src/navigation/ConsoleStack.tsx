import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConsoleScreen } from '../screens/ConsoleScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export function ConsoleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="ConsoleMain" component={ConsoleScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

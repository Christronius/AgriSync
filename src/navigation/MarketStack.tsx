import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MarketScreen } from '../screens/MarketScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export function MarketStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MarketMain" component={MarketScreen} />
      <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

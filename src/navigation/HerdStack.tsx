import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HerdListScreen } from '../screens/HerdListScreen';
import { HerdDetailScreen } from '../screens/HerdDetailScreen';

const Stack = createNativeStackNavigator();

export function HerdStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HerdList" component={HerdListScreen} />
      <Stack.Screen name="HerdDetail" component={HerdDetailScreen} />
    </Stack.Navigator>
  );
}

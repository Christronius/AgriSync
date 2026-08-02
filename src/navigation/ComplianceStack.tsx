import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ComplianceScreen } from '../screens/ComplianceScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export function ComplianceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ComplianceMain" component={ComplianceScreen} />
      <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

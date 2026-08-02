import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FieldsListScreen } from '../screens/FieldsListScreen';
import { FieldDetailScreen } from '../screens/FieldDetailScreen';

const Stack = createNativeStackNavigator();

export function FieldsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FieldsList" component={FieldsListScreen} />
      <Stack.Screen name="FieldDetail" component={FieldDetailScreen} />
    </Stack.Navigator>
  );
}

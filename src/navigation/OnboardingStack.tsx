import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingProvider } from '../context/OnboardingContext';
import { SetupStep1_Identity } from '../screens/onboarding/SetupStep1_Identity';
import { SetupStep2_Operations } from '../screens/onboarding/SetupStep2_Operations';
import { SetupStep3_CropDetails } from '../screens/onboarding/SetupStep3_CropDetails';
import { SetupStep4_LivestockDetails } from '../screens/onboarding/SetupStep4_LivestockDetails';
import { SetupStep5_Technology } from '../screens/onboarding/SetupStep5_Technology';
import { SetupStep6_Compliance } from '../screens/onboarding/SetupStep6_Compliance';
import { SetupStep7_Documents } from '../screens/onboarding/SetupStep7_Documents';
import { SetupStep8_Review } from '../screens/onboarding/SetupStep8_Review';

const Stack = createNativeStackNavigator();

export function OnboardingStack() {
  return (
    <OnboardingProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="SetupStep1" component={SetupStep1_Identity} />
        <Stack.Screen name="SetupStep2" component={SetupStep2_Operations} />
        <Stack.Screen name="SetupStep3_CropDetails" component={SetupStep3_CropDetails} />
        <Stack.Screen name="SetupStep4_LivestockDetails" component={SetupStep4_LivestockDetails} />
        <Stack.Screen name="SetupStep5" component={SetupStep5_Technology} />
        <Stack.Screen name="SetupStep6" component={SetupStep6_Compliance} />
        <Stack.Screen name="SetupStep7" component={SetupStep7_Documents} />
        <Stack.Screen name="SetupStep8" component={SetupStep8_Review} />
      </Stack.Navigator>
    </OnboardingProvider>
  );
}

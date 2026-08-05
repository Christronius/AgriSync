import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './src/navigation/TabNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { colors } from './src/theme/theme';
import { OnboardingStack } from './src/navigation/OnboardingStack';
import * as Font from 'expo-font';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/LoginScreen';

import { FieldDetailScreen } from './src/screens/FieldDetailScreen';
import { HerdDetailScreen } from './src/screens/HerdDetailScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { EconomicsScreen } from './src/screens/EconomicsScreen';
import { AdminPanelScreen } from './src/screens/AdminPanelScreen';

import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootStack = createNativeStackNavigator();

function NavigationWrapper() {
  const { user, loading } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);

  if (loading || !splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
        {user ? (
          user.setupCompleted ? (
            <>
              <RootStack.Screen name="MainTabs" component={TabNavigator} />
              <RootStack.Screen name="FieldDetail" component={FieldDetailScreen} />
              <RootStack.Screen name="HerdDetail" component={HerdDetailScreen} />
              <RootStack.Screen name="Economics" component={EconomicsScreen} />
              <RootStack.Screen name="AdminPanel" component={AdminPanelScreen} />

              <RootStack.Screen name="Placeholder" component={PlaceholderScreen} />
            </>
          ) : (
            <RootStack.Screen name="OnboardingStack" component={OnboardingStack} />
          )
        ) : (
          <>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="Placeholder" component={PlaceholderScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'SpaceGrotesk-Regular': require('@expo-google-fonts/space-grotesk/SpaceGrotesk_400Regular.ttf'),
          'SpaceGrotesk-Medium': require('@expo-google-fonts/space-grotesk/SpaceGrotesk_500Medium.ttf'),
          'SpaceGrotesk-Bold': require('@expo-google-fonts/space-grotesk/SpaceGrotesk_700Bold.ttf'),
          'SpaceGrotesk': require('@expo-google-fonts/space-grotesk/SpaceGrotesk_700Bold.ttf'),
          'IBMPlexSans-Regular': require('@expo-google-fonts/ibm-plex-sans/IBMPlexSans_400Regular.ttf'),
          'IBMPlexSans-Medium': require('@expo-google-fonts/ibm-plex-sans/IBMPlexSans_500Medium.ttf'),
          'IBMPlexSans-SemiBold': require('@expo-google-fonts/ibm-plex-sans/IBMPlexSans_600SemiBold.ttf'),
          'IBMPlexSans-Bold': require('@expo-google-fonts/ibm-plex-sans/IBMPlexSans_700Bold.ttf'),
          'IBMPlexSans': require('@expo-google-fonts/ibm-plex-sans/IBMPlexSans_400Regular.ttf'),
          'IBMPlexMono-Regular': require('@expo-google-fonts/ibm-plex-mono/IBMPlexMono_400Regular.ttf'),
          'IBMPlexMono-Medium': require('@expo-google-fonts/ibm-plex-mono/IBMPlexMono_500Medium.ttf'),
          'IBMPlexMono-SemiBold': require('@expo-google-fonts/ibm-plex-mono/IBMPlexMono_600SemiBold.ttf'),
          'IBMPlexMono-Bold': require('@expo-google-fonts/ibm-plex-mono/IBMPlexMono_700Bold.ttf'),
          'IBMPlexMono': require('@expo-google-fonts/ibm-plex-mono/IBMPlexMono_400Regular.ttf'),
        });
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
          <NavigationWrapper />
        </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
